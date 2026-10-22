import rateLimit from 'express-rate-limit';

/**
 * Enterprise Rate Limiting Protection (PRD Security & Anti-Brute-Force Specification)
 * Protects against credential stuffing, dictionary attacks, bot registrations, and OTP enumeration.
 */

// 1. Strict Login Brute-Force & Credential Stuffing Limiter
// Enforces max 5 login attempts per 15 minutes per IP
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit to 5 requests per windowMs
  standardHeaders: true, // Return standard RateLimit-* headers
  legacyHeaders: false, // Disable legacy X-RateLimit-* headers
  statusCode: 429,
  message: {
    error: 'Too many login attempts. Account access is temporarily locked to prevent unauthorized brute-force attacks. Please try again in 15 minutes.',
    code: 'RATE_LIMIT_EXCEEDED',
    retryAfterSeconds: 900,
  },
});

// 2. Strict Registration Anti-Bot & Spam Account Limiter
// Enforces max 5 registrations per hour per IP to eliminate automated spam accounts
export const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // Limit to 5 registrations per hour
  standardHeaders: true,
  legacyHeaders: false,
  statusCode: 429,
  message: {
    error: 'Too many registration requests from this network. To protect against automated bot activity, registration is temporarily throttled. Please try again in an hour.',
    code: 'REGISTRATION_RATE_LIMIT_EXCEEDED',
    retryAfterSeconds: 3600,
  },
});

// 3. OTP Verification & 6-Digit Code Anti-Brute-Force Limiter
// Enforces max 5 verification attempts per 10 minutes per IP
export const otpLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  statusCode: 429,
  message: {
    error: 'Too many OTP verification attempts. Please wait 10 minutes before trying again or request a new OTP code.',
    code: 'OTP_RATE_LIMIT_EXCEEDED',
    retryAfterSeconds: 600,
  },
});

// 4. Password Reset & Inbox Flooding Protection Limiter
// Enforces max 3 password reset requests per 15 minutes per IP
export const passwordResetLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3,
  standardHeaders: true,
  legacyHeaders: false,
  statusCode: 429,
  message: {
    error: 'Too many password reset requests. Please check your inbox or try again in 15 minutes.',
    code: 'RESET_RATE_LIMIT_EXCEEDED',
    retryAfterSeconds: 900,
  },
});
