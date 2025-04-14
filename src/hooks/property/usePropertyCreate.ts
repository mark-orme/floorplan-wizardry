import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Property, PropertyStatus } from "@/types/propertyTypes";
import { toast } from "sonner";
import logger from "@/utils/logger";
import { usePropertyBase } from "./usePropertyBase";

/**
 * Hook for creating new properties
 */
export const usePropertyCreate = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { checkAuthentication } = usePropertyBase();

  // Fix the created_by property which should be created_at
  const createProperty = async (propertyData: Omit<Property, "id">) => {
    setIsLoading(true);
    
    try {
      logger.info("Creating property...", propertyData);
      
      // Get current user if logged in
      const { data: { user } } = await supabase.auth.getUser();
      
      // Create property in Supabase
      const newProperty = {
        ...propertyData,
        user_id: user?.id || propertyData.userId || "anonymous",
        status: PropertyStatus.DRAFT,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        name: propertyData.address.split(',')[0]
      };
      
      const { data, error } = await supabase
        .from('properties')
        .insert([newProperty])
        .select()
        .single();
        
      if (error) {
        logger.error("Error creating property:", error);
        throw error;
      }
      
      logger.info("Property created successfully:", data);
      toast.success("Property created successfully!");
      
      return data;
    } catch (error: any) {
      logger.error("Error creating property:", error);
      toast.error(error.message || "Error creating property");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { createProperty, isLoading, checkAuthentication };
};
