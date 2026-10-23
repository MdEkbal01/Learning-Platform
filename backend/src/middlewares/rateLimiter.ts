import rateLimit from 'express-rate-limit';

/**
 * Enterprise Rate Limiting Protection (PRD Security & Anti-Brute-Force Specification)
 * Protects against credential stuffing, dictionary attacks, bot registrations, and OTP enumeration.
 */

// 1. Strict Login Brute-Force & Credential Stuffing Limiter
// Enforces max 30 login attempts per 15 minutes per IP
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // Max 30 attempts per 15 minutes (balanced protection)
  standardHeaders: true, // Return standard RateLimit-* headers
  legacyHeaders: false, // Disable legacy X-RateLimit-* headers
  statusCode: 429,
  message: {
    error: 'Too many login attempts from this IP. Please wait a few minutes before trying again.',
    code: 'RATE_LIMIT_EXCEEDED',
    retryAfterSeconds: 900,
  },
});

// 2. Strict Registration Anti-Bot & Spam Account Limiter
// Enforces max 20 registrations per hour per IP to eliminate automated spam accounts
export const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  statusCode: 429,
  message: {
    error: 'Too many registration requests from this network. Please try again later.',
    code: 'REGISTRATION_RATE_LIMIT_EXCEEDED',
    retryAfterSeconds: 3600,
  },
});

// 3. OTP Verification & 6-Digit Code Anti-Brute-Force Limiter
// Enforces max 20 verification attempts per 10 minutes per IP
export const otpLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  statusCode: 429,
  message: {
    error: 'Too many OTP verification attempts. Please wait a few minutes or request a new code.',
    code: 'OTP_RATE_LIMIT_EXCEEDED',
    retryAfterSeconds: 600,
  },
});

// 4. Password Reset & Inbox Flooding Protection Limiter
// Enforces max 15 password reset requests per 15 minutes per IP
export const passwordResetLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 15,
  standardHeaders: true,
  legacyHeaders: false,
  statusCode: 429,
  message: {
    error: 'Too many password reset requests. Please check your inbox or try again in 15 minutes.',
    code: 'RESET_RATE_LIMIT_EXCEEDED',
    retryAfterSeconds: 900,
  },
});
