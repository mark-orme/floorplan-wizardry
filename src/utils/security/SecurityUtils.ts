
/**
 * Security utilities for forms and user input
 */

/**
 * Apply security measures to a form element
 * @param form The form element to secure
 */
export function secureForm(form: HTMLFormElement): void {
  // Add CSRF protection (assuming a token is available in meta tag)
  const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
  
  if (csrfToken) {
    const csrfInput = document.createElement('input');
    csrfInput.type = 'hidden';
    csrfInput.name = '_csrf';
    csrfInput.value = csrfToken;
    form.appendChild(csrfInput);
  }
  
  // Prevent autocomplete on sensitive fields
  const sensitiveInputs = form.querySelectorAll('input[type="password"], input[name*="card"], input[name*="cvv"]');
  sensitiveInputs.forEach(input => {
    if (input instanceof HTMLInputElement) {
      input.autocomplete = 'off';
    }
  });
  
  // Add novalidate attribute to let our own validation handle things
  form.setAttribute('novalidate', 'true');
  
  // Add referrer policy header
  const meta = document.createElement('meta');
  meta.name = 'referrer';
  meta.content = 'same-origin';
  document.head.appendChild(meta);
}

/**
 * Generate a secure nonce for CSP
 * @returns A random nonce string
 */
export function generateNonce(): string {
  const array = new Uint8Array(16);
  window.crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Apply Content Security Policy nonce to inline scripts
 * @param nonce The nonce value to apply
 */
export function applyCSPNonce(nonce: string): void {
  const scripts = document.querySelectorAll('script');
  scripts.forEach(script => {
    script.nonce = nonce;
  });
}
