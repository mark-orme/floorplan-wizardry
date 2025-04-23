
/**
 * Gets the CSRF token from localStorage
 */
export const getCSRFToken = (): string | null => {
  return localStorage.getItem('csrfToken');
};

/**
 * Validates a CSRF token
 */
export const validateCSRFToken = (token: string): boolean => {
  const storedToken = getCSRFToken();
  return token === storedToken;
};

/**
 * Regenerates a new CSRF token
 */
export const regenerateCSRFToken = (): string => {
  const token = Math.random().toString(36).substring(2, 15);
  localStorage.setItem('csrfToken', token);
  return token;
};
