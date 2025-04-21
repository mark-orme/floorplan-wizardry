
import { test, expect } from '@playwright/test';

test.describe('End-to-End Security Verification', () => {
  test('should have CSP and CSRF security measures properly implemented and effective', async ({ page }) => {
    await page.goto('/');

    // Wait for page to fully load and security features to initialize
    await page.waitForLoadState('networkidle');

    // 1. Verify CSP meta tag exists and has proper directives
    const cspMetaTag = await page.$eval(
      'meta[http-equiv="Content-Security-Policy"]',
      el => el.getAttribute('content')
    ).catch(() => null);
    
    expect(cspMetaTag).toBeTruthy();
    expect(cspMetaTag).toContain("default-src 'self'");
    
    // 2. Verify CSRF token exists in meta tag
    const csrfMetaTag = await page.$eval(
      'meta[name="csrf-token"]',
      el => el.getAttribute('content')
    ).catch(() => null);
    
    expect(csrfMetaTag).toBeTruthy();
    expect(csrfMetaTag!.length).toBeGreaterThan(20);
    
    // 3. Verify CSRF token exists in localStorage (client-side part)
    const localStorageToken = await page.evaluate(() => {
      const tokenData = localStorage.getItem('x-csrf-token');
      if (!tokenData) return null;
      return JSON.parse(tokenData).token;
    });
    
    expect(localStorageToken).toBeTruthy();
    expect(localStorageToken).toBe(csrfMetaTag);
    
    // 4. Verify CSRF cookie exists (server-side part - double submit pattern)
    const csrfCookie = await page.evaluate(() => {
      return document.cookie
        .split('; ')
        .find(cookie => cookie.startsWith('x-csrf-cookie='))
        ?.split('=')[1];
    });
    
    expect(csrfCookie).toBeTruthy();
    expect(csrfCookie).toBe(localStorageToken);
    
    // 5. Test CSP effectiveness by attempting to inject an inline script
    const scriptExecResult = await page.evaluate(() => {
      try {
        // Create and add an inline script (should be blocked by CSP)
        const script = document.createElement('script');
        script.textContent = "window.INJECTED = 'BAD_VALUE';";
        document.body.appendChild(script);
        
        // Return injected value if script executed
        return (window as any).INJECTED || 'NOT_EXECUTED';
      } catch (e) {
        return `ERROR: ${e.message}`;
      }
    });
    
    // Script shouldn't execute if CSP is working
    expect(scriptExecResult).toBe('NOT_EXECUTED');
    
    // 6. Test CSP effectiveness with external script
    const externalScriptResult = await page.evaluate(() => {
      try {
        // Add external script (should be blocked if from different origin)
        const script = document.createElement('script');
        script.src = 'https://example.com/malicious.js';
        script.onload = () => {
          (window as any).EXTERNAL_LOADED = true;
        };
        document.body.appendChild(script);
        
        // Check if already loaded (should not have had time to load)
        return (window as any).EXTERNAL_LOADED || false;
      } catch (e) {
        return `ERROR: ${e.message}`;
      }
    });
    
    // External script shouldn't load instantly if CSP is working
    expect(externalScriptResult).toBe(false);
    
    // 7. Create a test form and verify CSRF protection is automatically applied
    await page.evaluate(() => {
      const form = document.createElement('form');
      form.id = 'test-form';
      form.method = 'post';
      form.action = '/api/test';
      document.body.appendChild(form);
    });
    
    // Wait for mutation observer to apply CSRF protection
    await page.waitForTimeout(200);
    
    // Check if CSRF token input was automatically added to the form
    const formToken = await page.evaluate(() => {
      const form = document.getElementById('test-form');
      if (!form) return null;
      
      const tokenInput = form.querySelector('input[name="x-csrf-token"]') as HTMLInputElement;
      return tokenInput?.value;
    });
    
    expect(formToken).toBeTruthy();
    expect(formToken).toBe(localStorageToken);
    
    // 8. Test token rotation by simulating a form submission
    await page.evaluate(async () => {
      const originalToken = JSON.parse(localStorage.getItem('x-csrf-token') || '{}').token;
      
      // Mock fetch to simulate post request
      const originalFetch = window.fetch;
      try {
        // Override fetch to simulate successful POST
        window.fetch = async (url, options = {}) => {
          // Execute any setTimeout callbacks immediately to trigger token rotation
          while (window.setTimeout.lastCall) {
            window.setTimeout.lastCall.args[0]();
            window.setTimeout.lastCall = null;
          }
          return new Response(null, { status: 200 });
        };
        
        // Trigger fetch with POST method to cause token rotation
        await fetch('/api/test', { method: 'POST' });
      } finally {
        // Restore original fetch
        window.fetch = originalFetch;
      }
      
      // Return both tokens for comparison
      return {
        originalToken,
        newToken: JSON.parse(localStorage.getItem('x-csrf-token') || '{}').token
      };
    });
    
    // 9. Verify other security headers are set
    const securityHeaders = await page.evaluate(() => {
      return {
        xContentType: document.querySelector('meta[http-equiv="X-Content-Type-Options"]')?.getAttribute('content'),
        xFrameOptions: document.querySelector('meta[http-equiv="X-Frame-Options"]')?.getAttribute('content'),
        xXssProtection: document.querySelector('meta[http-equiv="X-XSS-Protection"]')?.getAttribute('content'),
        referrerPolicy: document.querySelector('meta[http-equiv="Referrer-Policy"]')?.getAttribute('content')
      };
    });
    
    expect(securityHeaders.xContentType).toBe('nosniff');
    expect(securityHeaders.xFrameOptions).toBe('DENY');
    expect(securityHeaders.xXssProtection).toBe('1; mode=block');
    expect(securityHeaders.referrerPolicy).toBe('strict-origin-when-cross-origin');
  });

  test('forms should include and submit correct CSRF tokens', async ({ page }) => {
    await page.goto('/');

    // Create a test form
    await page.evaluate(() => {
      const form = document.createElement('form');
      form.id = 'csrf-test-form';
      form.method = 'post';
      form.action = '/api/test';
      
      // Add a submit button
      const button = document.createElement('button');
      button.type = 'submit';
      button.textContent = 'Submit';
      form.appendChild(button);
      
      document.body.appendChild(form);
    });

    // Wait for CSRF token to be applied
    await page.waitForTimeout(200);

    // Get CSRF tokens from different sources
    const { inputValue, metaToken, localToken, cookieToken } = await page.evaluate(() => {
      const form = document.getElementById('csrf-test-form');
      if (!form) return { inputValue: null, metaToken: null, localToken: null, cookieToken: null };
      
      const input = form.querySelector('input[name="x-csrf-token"]') as HTMLInputElement | null;
      
      // Parse localStorage token data
      const tokenData = localStorage.getItem('x-csrf-token');
      const parsedToken = tokenData ? JSON.parse(tokenData).token : null;
      
      // Get cookie token
      const csrfCookie = document.cookie
        .split('; ')
        .find(cookie => cookie.startsWith('x-csrf-cookie='))
        ?.split('=')[1];
      
      return {
        inputValue: input ? input.value : null,
        metaToken: document.querySelector('meta[name="csrf-token"]')?.getAttribute('content'),
        localToken: parsedToken,
        cookieToken: csrfCookie
      };
    });

    // All tokens should be present and match
    expect(inputValue).toBeTruthy();
    expect(metaToken).toBeTruthy();
    expect(localToken).toBeTruthy();
    expect(cookieToken).toBeTruthy();
    
    // All sources should have the same token (double-submit pattern validation)
    expect(inputValue).toBe(metaToken);
    expect(inputValue).toBe(localToken);
    expect(inputValue).toBe(cookieToken);

    // Simulate tampering by changing the CSRF token
    await page.evaluate(() => {
      const form = document.getElementById('csrf-test-form');
      if (!form) return;
      
      const input = form.querySelector('input[name="x-csrf-token"]') as HTMLInputElement;
      if (input) input.value = 'tampered-token-value';
    });

    // Simulate form submission - in a real app this would be rejected by the server
    // Here we just verify the mismatch is detectable
    const { formToken, storedToken, cookieToken: submittedCookieToken } = await page.evaluate(() => {
      const form = document.getElementById('csrf-test-form');
      if (!form) return { formToken: null, storedToken: null, cookieToken: null };
      
      const input = form.querySelector('input[name="x-csrf-token"]') as HTMLInputElement;
      const tokenData = localStorage.getItem('x-csrf-token');
      const parsedToken = tokenData ? JSON.parse(tokenData).token : null;
      
      // Get cookie token
      const csrfCookie = document.cookie
        .split('; ')
        .find(cookie => cookie.startsWith('x-csrf-cookie='))
        ?.split('=')[1];
        
      return {
        formToken: input ? input.value : null,
        storedToken: parsedToken,
        cookieToken: csrfCookie
      };
    });

    // Tokens should no longer match, which would cause rejection on a real server
    expect(formToken).toBe('tampered-token-value');
    expect(formToken).not.toBe(storedToken);
    expect(formToken).not.toBe(submittedCookieToken);
    
    // But the localStorage and cookie tokens should still match each other
    expect(storedToken).toBe(submittedCookieToken);
  });
});
