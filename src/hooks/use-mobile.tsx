
/**
 * Custom hook for detecting mobile screen sizes
 * Provides a reactive boolean value that updates on window resize
 * @module use-mobile
 */
import * as React from "react"

/**
 * Mobile breakpoint in pixels
 * Screen widths below this value are considered mobile
 * @constant
 */
const MOBILE_BREAKPOINT = 768

/**
 * Hook to detect if the current viewport is mobile-sized
 * Uses media queries and window resize events for responsive detection
 * 
 * @returns {boolean} True if viewport is mobile-sized, false otherwise
 */
export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    /**
     * Media query list for mobile breakpoint
     */
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    
    /**
     * Update isMobile state when media query status changes
     */
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    
    // Add event listener
    mql.addEventListener("change", onChange)
    
    // Set initial value
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    
    // Clean up event listener on unmount
    return () => mql.removeEventListener("change", onChange)
  }, [])

  // Return boolean value (coerce undefined to false)
  return !!isMobile
}
