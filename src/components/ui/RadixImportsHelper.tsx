
/**
 * Radix UI Imports Guide
 * 
 * This file demonstrates how to properly import Radix UI components
 * to ensure proper tree-shaking and smaller bundle sizes.
 * 
 * IMPORTANT: Always use named imports from Radix packages
 * instead of importing the entire library.
 */
import React from 'react';

// RECOMMENDED: Import only what you need with named imports
import { Root as AccordionRoot, Item as AccordionItem } from '@radix-ui/react-accordion';
import { Root as AlertDialogRoot } from '@radix-ui/react-alert-dialog';
import { Root as AvatarRoot, Image as AvatarImage } from '@radix-ui/react-avatar';

// Example component showing proper Radix imports pattern
export const RadixImportExample: React.FC = () => {
  return (
    <div className="p-4 border rounded-md bg-gray-50 dark:bg-gray-900">
      <h2 className="text-lg font-semibold mb-4">Radix UI Import Examples</h2>
      
      {/* Accordion example */}
      <AccordionRoot type="single" collapsible>
        <AccordionItem value="item-1">
          {/* Accordion content */}
        </AccordionItem>
      </AccordionRoot>
      
      {/* Avatar example */}
      <AvatarRoot>
        <AvatarImage src="example.jpg" alt="User" />
      </AvatarRoot>
      
      <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-md text-amber-800">
        <h3 className="font-medium">Important</h3>
        <p className="text-sm mt-1">
          Always use named imports for Radix UI components to ensure proper tree-shaking.
          This significantly reduces bundle size compared to importing the entire module.
        </p>
        <pre className="mt-2 p-2 bg-white text-xs rounded border overflow-x-auto">
          {`// ❌ Don't do this (imports everything)
import * as Accordion from '@radix-ui/react-accordion';

// ✅ Do this instead (imports only what you need)
import { Root, Item } from '@radix-ui/react-accordion';`}
        </pre>
      </div>
    </div>
  );
};

/**
 * Common Radix UI components re-exported with proper imports
 * Allows standardized usage across the application
 */
export const Accordion = AccordionRoot;
export const AccordionSection = AccordionItem;
export const AlertDialog = AlertDialogRoot;
export const Avatar = AvatarRoot;
export const AvatarImg = AvatarImage;
