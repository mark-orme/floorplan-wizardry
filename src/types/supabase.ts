
/**
 * Supabase database schema type definitions
 * @module supabase-types
 */

/**
 * JSON value type supported by Supabase
 * Can be a string, number, boolean, null, object with JSON values, or array of JSON values
 * @typedef {string|number|boolean|null|{[key: string]: Json|undefined}|Json[]} Json
 */
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

/**
 * Database schema interface for Supabase
 * Defines tables, their row types, and operations (insert/update)
 * @interface Database
 */
export interface Database {
  public: {
    Tables: {
      /**
       * Floor plans table schema
       */
      floor_plans: {
        /** Row data returned from queries */
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          user_id: string;
          name: string;
          data: Json;
        };
        /** Data needed for inserting new rows */
        Insert: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          user_id: string;
          name: string;
          data: Json;
        };
        /** Data for updating existing rows */
        Update: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          user_id?: string;
          name?: string;
          data?: Json;
        };
      };
      /**
       * User profiles table schema
       */
      user_profiles: {
        /** Row data returned from queries */
        Row: {
          id?: string;
          user_id: string;
          role: string;
          created_at: string;
        };
        /** Data needed for inserting new rows */
        Insert: {
          user_id: string;
          role: string;
          created_at?: string;
        };
        /** Data for updating existing rows */
        Update: {
          user_id?: string;
          role?: string;
          created_at?: string;
        };
      };
      /**
       * Users table schema
       */
      users: {
        /** Row data returned from queries */
        Row: {
          id: string;
          email: string;
          created_at: string;
        };
        /** Data needed for inserting new rows */
        Insert: {
          id: string;
          email: string;
          created_at?: string;
        };
        /** Data for updating existing rows */
        Update: {
          id?: string;
          email?: string;
          created_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
