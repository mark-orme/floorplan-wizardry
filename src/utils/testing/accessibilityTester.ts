
/**
 * Accessibility Testing Utilities
 * Provides functions for checking accessibility of the application
 */

// Type definitions for accessibility issues
export interface AccessibilityIssue {
  id: string;
  impact: 'minor' | 'moderate' | 'serious' | 'critical';
  description: string;
  help: string;
  helpUrl: string;
  nodes: {
    html: string;
    failureSummary: string;
  }[];
}

// Compatibility shim for axe-core if available
declare global {
  interface Window {
    axe?: any;
  }
}

// Run accessibility checks (requires axe-core to be loaded)
export async function runAccessibilityCheck(
  element: string | HTMLElement = document.body
): Promise<AccessibilityIssue[]> {
  // Check if axe is available
  if (typeof window === 'undefined' || !window.axe) {
    console.warn('axe-core not available for accessibility testing');
    return [];
  }
  
  try {
    // Run axe analysis
    const results = await window.axe.run(element);
    
    // Return violations
    return results.violations.map((violation: any) => ({
      id: violation.id,
      impact: violation.impact,
      description: violation.description,
      help: violation.help,
      helpUrl: violation.helpUrl,
      nodes: violation.nodes.map((node: any) => ({
        html: node.html,
        failureSummary: node.failureSummary
      }))
    }));
  } catch (error) {
    console.error('Error running accessibility check:', error);
    return [];
  }
}

// Check color contrast for a specific element
export function checkColorContrast(
  foregroundColor: string,
  backgroundColor: string
): { ratio: number; passes: { AA: boolean; AAA: boolean } } {
  // Simple contrast ratio calculation
  const getLuminance = (color: string): number => {
    // Convert hex to RGB
    let r, g, b;
    
    if (color.startsWith('#')) {
      const hex = color.slice(1);
      r = parseInt(hex.slice(0, 2), 16) / 255;
      g = parseInt(hex.slice(2, 4), 16) / 255;
      b = parseInt(hex.slice(4, 6), 16) / 255;
    } else if (color.startsWith('rgb')) {
      const match = color.match(/\d+/g);
      if (!match || match.length < 3) return 0;
      r = parseInt(match[0], 10) / 255;
      g = parseInt(match[1], 10) / 255;
      b = parseInt(match[2], 10) / 255;
    } else {
      return 0;
    }
    
    // Calculate luminance
    const toLinear = (channel: number): number => {
      return channel <= 0.03928
        ? channel / 12.92
        : Math.pow((channel + 0.055) / 1.055, 2.4);
    };
    
    r = toLinear(r);
    g = toLinear(g);
    b = toLinear(b);
    
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  
  const foregroundLuminance = getLuminance(foregroundColor);
  const backgroundLuminance = getLuminance(backgroundColor);
  
  // Calculate contrast ratio
  const contrastRatio =
    (Math.max(foregroundLuminance, backgroundLuminance) + 0.05) /
    (Math.min(foregroundLuminance, backgroundLuminance) + 0.05);
  
  // Check against WCAG standards
  return {
    ratio: contrastRatio,
    passes: {
      AA: contrastRatio >= 4.5,
      AAA: contrastRatio >= 7
    }
  };
}

// Validate aria attributes on an element
export function validateAriaAttributes(element: HTMLElement): string[] {
  const issues: string[] = [];
  
  // Check for common aria mistakes
  if (element.hasAttribute('role') && element.getAttribute('role') === 'button') {
    if (!element.hasAttribute('tabindex') && element.tagName !== 'BUTTON') {
      issues.push('Button role needs tabindex if not a button element');
    }
  }
  
  if (element.hasAttribute('aria-expanded')) {
    const validRoles = ['button', 'link', 'checkbox', 'menuitem', 'tab'];
    const role = element.getAttribute('role');
    if (!role || !validRoles.includes(role)) {
      issues.push('aria-expanded should be used with appropriate role');
    }
  }
  
  // Check label associations
  if (element.tagName === 'INPUT' || element.tagName === 'SELECT' || element.tagName === 'TEXTAREA') {
    const hasLabel = !!element.id && !!document.querySelector(`label[for="${element.id}"]`);
    const hasAriaLabel = element.hasAttribute('aria-label') || element.hasAttribute('aria-labelledby');
    
    if (!hasLabel && !hasAriaLabel) {
      issues.push('Form control missing label association');
    }
  }
  
  return issues;
}

// Provide focus order analysis
export function analyzeFocusOrder(): HTMLElement[] {
  if (typeof document === 'undefined') return [];
  
  const focusableElements = document.querySelectorAll<HTMLElement>(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  
  return Array.from(focusableElements);
}

// Load axe-core dynamically for development
export function loadAccessibilityTester(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || window.axe) {
      resolve();
      return;
    }
    
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.7.0/axe.min.js';
    script.integrity = 'sha512-hzRE/YMvtFr+47aIBhOV3z+HuGzfb9nL0o+hPHOmruhiLYTzmR5hE1CcSHJ5/jxJgCj9WTGrEfhlfhH/e8khwg==';
    script.crossOrigin = 'anonymous';
    script.referrerPolicy = 'no-referrer';
    
    script.onload = () => resolve();
    script.onerror = (e) => reject(new Error('Failed to load axe-core'));
    
    document.head.appendChild(script);
  });
}
