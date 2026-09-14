/**
 * Production Environment Configuration & Validation
 * Server-Side Only. Never import or bundle into client components.
 */

export interface AppEnv {
  DATABASE_URL: string;
  AUTH_SECRET: string;
  ADMIN_EMAIL: string;
  ADMIN_PASSWORD_HASH?: string;
  ADMIN_PASSWORD_HASH_B64?: string;
  OWNER_WHATSAPP_NUMBER?: string;
  WHATSAPP_ACCESS_TOKEN?: string;
  WHATSAPP_PHONE_NUMBER_ID?: string;
  EMAIL_API_KEY?: string;
  EMAIL_FROM: string;
  NODE_ENV: 'development' | 'production' | 'test';
}

export function validateEnv(): { valid: boolean; missing: string[]; warnings: string[] } {
  const missing: string[] = [];
  const warnings: string[] = [];

  if (!process.env.DATABASE_URL) {
    missing.push('DATABASE_URL');
  }

  if (!process.env.AUTH_SECRET) {
    missing.push('AUTH_SECRET');
  } else if (process.env.AUTH_SECRET === 'fallback-secret-change-in-production') {
    warnings.push('AUTH_SECRET is set to the default placeholder. Use a strong random key in production.');
  }

  if (!process.env.ADMIN_EMAIL) {
    warnings.push('ADMIN_EMAIL is not set. Defaulting to admin@edencloudix.tech.');
  }

  if (!process.env.ADMIN_PASSWORD_HASH && !process.env.ADMIN_PASSWORD_HASH_B64) {
    missing.push('ADMIN_PASSWORD_HASH or ADMIN_PASSWORD_HASH_B64');
  }

  if (!process.env.OWNER_WHATSAPP_NUMBER) {
    warnings.push('OWNER_WHATSAPP_NUMBER is not set. WhatsApp notifications will be queued with FAILED status.');
  }

  if (!process.env.WHATSAPP_ACCESS_TOKEN || !process.env.WHATSAPP_PHONE_NUMBER_ID) {
    warnings.push('WhatsApp Cloud API credentials (WHATSAPP_ACCESS_TOKEN / WHATSAPP_PHONE_NUMBER_ID) not fully configured.');
  }

  if (!process.env.EMAIL_API_KEY) {
    warnings.push('EMAIL_API_KEY not configured. Email notifications will be skipped or saved as FAILED.');
  }

  return {
    valid: missing.length === 0,
    missing,
    warnings,
  };
}

export const env: AppEnv = {
  DATABASE_URL: process.env.DATABASE_URL || '',
  AUTH_SECRET: process.env.AUTH_SECRET || 'fallback-secret-change-in-production',
  ADMIN_EMAIL: process.env.ADMIN_EMAIL || 'admin@edencloudix.tech',
  ADMIN_PASSWORD_HASH: process.env.ADMIN_PASSWORD_HASH,
  ADMIN_PASSWORD_HASH_B64: process.env.ADMIN_PASSWORD_HASH_B64,
  OWNER_WHATSAPP_NUMBER: process.env.OWNER_WHATSAPP_NUMBER,
  WHATSAPP_ACCESS_TOKEN: process.env.WHATSAPP_ACCESS_TOKEN,
  WHATSAPP_PHONE_NUMBER_ID: process.env.WHATSAPP_PHONE_NUMBER_ID,
  EMAIL_API_KEY: process.env.EMAIL_API_KEY,
  EMAIL_FROM: process.env.EMAIL_FROM || 'notifications@edencloudix.tech',
  NODE_ENV: (process.env.NODE_ENV as 'development' | 'production' | 'test') || 'development',
};
