
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Property, PropertyStatus } from "@/types/propertyTypes";
import { toast } from "sonner";
import logger from "@/utils/logger";
import { usePropertyBase } from "./usePropertyBase";
import { captureError } from "@/utils/sentryUtils";

/**
 * Hook for creating new properties
 */
export const usePropertyCreate = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { checkAuthentication } = usePropertyBase();

  // Updated to accept a property data object instead of individual fields
  const createProperty = async (propertyData: {
    order_id: string;
    address: string;
    client_name: string;
    branch_name?: string;
  }) => {
    setIsLoading(true);
    
    try {
      logger.info("Creating property...", propertyData);
      
      // Get current user if logged in
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("User must be authenticated to create a property");
      }
      
      // Create property in Supabase
      const newProperty = {
        user_id: user.id,
        status: PropertyStatus.DRAFT,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        order_id: propertyData.order_id,
        address: propertyData.address,
        client_name: propertyData.client_name,
        branch_name: propertyData.branch_name || "",
        name: propertyData.address.split(',')[0] // Create a name from address
      };
      
      // Fixed Supabase query syntax
      const { data, error } = await supabase
        .from('properties')
        .insert(newProperty)
        .select();
        
      if (error) {
        logger.error("Error creating property:", error);
        captureError(error, 'property-create-supabase-error', {
          extra: { propertyData }
        });
        throw error;
      }
      
      logger.info("Property created successfully:", data[0]);
      return data[0];
    } catch (error: any) {
      logger.error("Error creating property:", error);
      captureError(error, 'property-create-error', {
        extra: { propertyData }
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { createProperty, isLoading, checkAuthentication };
};
