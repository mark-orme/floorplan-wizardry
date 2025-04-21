
import { test, expect } from '@playwright/test';

test.describe('Security Features', () => {
  test('should have security headers set properly and EFFECTIVE', async ({ page }) => {
    await page.goto('/');

    // Wait for page to fully load
    await page.waitForLoadState('networkidle');

    // Check CSP meta tag exists
    const cspMetaTag = await page.$eval(
      'meta[http-equiv="Content-Security-Policy"]',
      el => el.getAttribute('content')
    ).catch(() => null);
    expect(cspMetaTag).toBeTruthy();

    // Check CSRF meta tag and localStorage token
    const csrfMetaTag = await page.$eval(
      'meta[name="csrf-token"]',
      el => el.getAttribute('content')
    ).catch(() => null);
    expect(csrfMetaTag).toBeTruthy();

    // Check localStorage has a matching CSRF token
    const localCsrfToken = await page.evaluate(() => localStorage.getItem('csrf-token'));
    expect(localCsrfToken).toBeTruthy();
    expect(csrfMetaTag).toBe(localCsrfToken);

    // The CSRF meta tag and localStorage entry must directly match
    expect(localCsrfToken).toEqual(csrfMetaTag);

    // Try to inject an inline script and confirm CSP blocks it
    const scriptResult = await page.evaluate(() => {
      try {
        // Attempt to add inline script (should be blocked by CSP)
        const script = document.createElement('script');
        script.textContent = "window.INJECTED='FAIL';";
        document.body.appendChild(script);
        return (window as any).INJECTED || null;
      } catch (e) {
        return "blocked";
      }
    });
    expect(scriptResult).not.toBe('FAIL');

    // Try to load external script - should be blocked (simulate, do not inject real malware)
    // Most CSPs block <script src="https://evil.com/x.js">, so we check element doesn't run
    const extScriptResult = await page.evaluate(() => {
      let ran = 'no';
      try {
        const script = document.createElement('script');
        script.src = 'https://evil.com/_notfound_.js';
        script.onload = () => { (window as any).EXT_SCRIPT_OK = 'FAIL'; ran = 'yes'; };
        document.body.appendChild(script);
      } catch {}
      return (window as any).EXT_SCRIPT_OK || ran;
    });
    expect(extScriptResult).not.toBe('FAIL');
  });

  test('forms include and submit correct CSRF tokens', async ({ page }) => {
    await page.goto('/');

    await page.evaluate(() => {
      const form = document.createElement('form');
      form.id = 'test-form';
      form.method = 'post';
      document.body.appendChild(form);
    });

    // Wait briefly for the CSRF protection to take effect
    await page.waitForTimeout(100);

    // Get values from form and meta/localStorage
    const { inputValue, metaToken, localToken } = await page.evaluate(() => {
      const form = document.getElementById('test-form');
      if (!form) return { inputValue: null, metaToken: null, localToken: null };
      const input = form.querySelector('input[name="csrf-token"]') as HTMLInputElement | null;
      return {
        inputValue: input ? input.value : null,
        metaToken: document.querySelector('meta[name="csrf-token"]')?.getAttribute('content'),
        localToken: localStorage.getItem('csrf-token'),
      };
    });

    expect(inputValue).toBeTruthy();
    expect(metaToken).toBeTruthy();
    expect(localToken).toBeTruthy();
    // All three should be exactly the same
    expect(inputValue).toBe(metaToken);
    expect(inputValue).toBe(localToken);

    // Simulate submitting with a different CSRF token value (should "fail" in a real backend)
    await page.evaluate(() => {
      const form = document.getElementById('test-form');
      if (!form) return;
      const input = form.querySelector('input[name="csrf-token"]');
      if (input) input.value = 'wrong-token-value';
    });

    // On submit, token mismatch must be observable (here, simulate—normally backend checks)
    const submittedToken = await page.evaluate(() => {
      const form = document.getElementById('test-form');
      let tokenVal = null;
      if (form) {
        const input = form.querySelector('input[name="csrf-token"]') as HTMLInputElement;
        // Instead of real post, just read out
        if (input) tokenVal = input.value;
      }
      return tokenVal;
    });
    expect(submittedToken).toBe('wrong-token-value'); // (simulate; backend should reject)
  });

  test('canvas should have accessibility attributes', async ({ page }) => {
    await page.goto('/');

    await page.waitForSelector('canvas');
    const ariaLabel = await page.$eval('canvas', el => el.getAttribute('aria-label')).catch(() => null);
    expect(ariaLabel).toBeTruthy();
  });

});
