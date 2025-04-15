
/**
 * HTTP Security Utilities
 * Functions for adding security headers to the application
 */

/**
 * Apply security meta tags to the document head
 * These simulate HTTP headers for development and some production environments
 */
export function applySecurityMetaTags(): void {
  // Remove any existing security meta tags
  document.querySelectorAll('meta[http-equiv]').forEach(tag => {
    if (
      tag.getAttribute('http-equiv') === 'Content-Security-Policy' ||
      tag.getAttribute('http-equiv') === 'X-Content-Type-Options' ||
      tag.getAttribute('http-equiv') === 'X-Frame-Options' ||
      tag.getAttribute('http-equiv') === 'Referrer-Policy' ||
      tag.getAttribute('http-equiv') === 'Permissions-Policy'
    ) {
      tag.remove();
    }
  });

  // Define security headers as meta tags
  const securityMeta = [
    {
      httpEquiv: 'X-Content-Type-Options',
      content: 'nosniff'
    },
    {
      httpEquiv: 'X-Frame-Options',
      content: 'DENY'
    },
    {
      httpEquiv: 'Referrer-Policy',
      content: 'strict-origin-when-cross-origin'
    },
    {
      httpEquiv: 'Permissions-Policy',
      content: 'accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()'
    }
  ];

  // Add security meta tags to document head
  securityMeta.forEach(meta => {
    const metaTag = document.createElement('meta');
    metaTag.httpEquiv = meta.httpEquiv;
    metaTag.content = meta.content;
    document.head.appendChild(metaTag);
  });

  // Add Strict-Transport-Security meta tag (HSTS)
  // Note: This is most effective when applied as an actual HTTP header by the server
  const hstsTag = document.createElement('meta');
  hstsTag.httpEquiv = 'Strict-Transport-Security';
  hstsTag.content = 'max-age=63072000; includeSubDomains; preload';
  document.head.appendChild(hstsTag);

  // Log that security meta tags have been applied
  console.log('Security meta tags applied to document');
}

/**
 * Check if a specific meta tag exists in the document head
 * @param httpEquiv The http-equiv attribute value
 * @returns boolean indicating if the tag exists
 */
export function checkMetaTagExists(httpEquiv: string): boolean {
  return !!document.querySelector(`meta[http-equiv="${httpEquiv}"]`);
}

/**
 * Get the content of a specific meta tag
 * @param httpEquiv The http-equiv attribute value
 * @returns The content attribute value or null if the tag doesn't exist
 */
export function getMetaTagContent(httpEquiv: string): string | null {
  const tag = document.querySelector(`meta[http-equiv="${httpEquiv}"]`);
  return tag ? tag.getAttribute('content') : null;
}
