
/**
 * Encryption Type Definitions
 * 
 * This module provides type definitions for encryption-related functionality.
 * 
 * @module types/security/encryptionTypes
 */

/**
 * Encryption algorithm types
 */
export type EncryptionAlgorithm = 'AES-GCM' | 'AES-CBC' | 'RSA';

/**
 * Encryption key types
 */
export type KeyType = 'symmetric' | 'asymmetric';

/**
 * Key derivation function types
 */
export type KeyDerivationFunction = 'PBKDF2' | 'Argon2' | 'Scrypt';

/**
 * Encrypted data structure
 */
export interface EncryptedData {
  /**
   * Base64-encoded encrypted data
   */
  data: string;
  
  /**
   * Base64-encoded initialization vector
   */
  iv: string;
  
  /**
   * Algorithm used for encryption
   */
  algorithm: EncryptionAlgorithm;
  
  /**
   * Additional authenticated data (optional)
   */
  aad?: string;
  
  /**
   * Authentication tag for authenticated encryption modes
   */
  tag?: string;
}

/**
 * Encryption configuration options
 */
export interface EncryptionConfig {
  /**
   * Encryption algorithm to use
   * @default 'AES-GCM'
   */
  algorithm: EncryptionAlgorithm;
  
  /**
   * Key size in bits
   * @default 256
   */
  keySize: 128 | 192 | 256;
  
  /**
   * Initialization vector size in bytes
   * @default 12
   */
  ivSize: number;
  
  /**
   * Key derivation function parameters
   */
  keyDerivation?: {
    /**
     * Function to use
     * @default 'PBKDF2'
     */
    function: KeyDerivationFunction;
    
    /**
     * Iterations for key derivation
     * @default 100000
     */
    iterations: number;
    
    /**
     * Salt size in bytes
     * @default 16
     */
    saltSize: number;
  };
}

/**
 * Key pair for asymmetric encryption
 */
export interface KeyPair {
  /**
   * Public key (PEM format)
   */
  publicKey: string;
  
  /**
   * Private key (PEM format)
   */
  privateKey: string;
}

/**
 * Encryption key metadata
 */
export interface KeyMetadata {
  /**
   * Key ID
   */
  id: string;
  
  /**
   * When the key was created
   */
  createdAt: Date;
  
  /**
   * When the key expires, if applicable
   */
  expiresAt?: Date;
  
  /**
   * Key algorithm
   */
  algorithm: EncryptionAlgorithm;
  
  /**
   * Key size in bits
   */
  keySize: number;
  
  /**
   * Key usage permission
   */
  usage: 'encrypt' | 'decrypt' | 'both';
  
  /**
   * Whether this is a primary key
   */
  isPrimary: boolean;
}
