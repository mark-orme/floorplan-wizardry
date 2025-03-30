
/**
 * Paper Size definitions
 * @module types/core/floor-plan/PaperSize
 */

/**
 * Paper size enum
 */
export enum PaperSize {
  A3 = "A3",
  A4 = "A4",
  A5 = "A5",
  Letter = "Letter",
  Legal = "Legal",
  Tabloid = "Tabloid",
  Custom = "Custom"
}

/**
 * Convert string to PaperSize enum
 * @param paperSizeString - String representation of paper size
 * @returns PaperSize enum value
 */
export const stringToPaperSize = (paperSizeString: string): PaperSize => {
  // Check if the string is a valid PaperSize value
  if (Object.values(PaperSize).includes(paperSizeString as PaperSize)) {
    return paperSizeString as PaperSize;
  }
  
  // Default to A4 if not valid
  return PaperSize.A4;
};
