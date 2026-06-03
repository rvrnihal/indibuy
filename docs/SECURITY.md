# IndiBuy - Security Guide

## Table of Contents

1. [Overview](#overview)
2. [Authentication Security](#authentication-security)
3. [Authorization](#authorization)
4. [Data Protection](#data-protection)
5. [API Security](#api-security)
6. [Frontend Security](#frontend-security)
7. [Infrastructure Security](#infrastructure-security)
8. [Compliance](#compliance)
9. [Incident Response](#incident-response)
10. [Security Checklist](#security-checklist)

---

## Overview

Security is a critical aspect of IndiBuy. This document outlines security practices and requirements.

---

## Authentication Security

### Password Requirements

- Minimum 8 characters
- Must contain uppercase letter
- Must contain lowercase letter
- Must contain number
- Must contain special character

```javascript
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
```

### Password Hashing

All passwords are hashed using bcrypt with salt rounds of 10:

```javascript
const salt = await bcryptjs.genSalt(10);
const hashedPassword = await bcryptjs.hash(password, salt);
```

### Session Management

- JWT tokens expire after 7 days
- Refresh tokens expire after 30 days
- Tokens are stored securely in httpOnly cookies
- Logout invalidates tokens on server

### Multi-Factor Authentication (MFA)

Optional MFA using:
- Email OTP
- SMS OTP
- Authenticator apps (TOTP)

---

## Authorization

### Role-Based Access Control (RBAC)

Four user roles:

1. **Buyer**: Can purchase products, view orders, leave reviews
2. **Vendor**: Can manage products, inventory, orders, analytics
3. **Admin**: Full access to manage platform
4. **Delivery Partner**: Can view assigned orders and update delivery status

### Permission Checking

```javascript
async function authorizeUser(req, res, next, requiredRoles) {
  const { user } = req;
  
  if (!requiredRoles.includes(user.role)) {
    return res.status(403).json({
      success: false,
      message: 'Insufficient permissions'
    });
  }
  
  next();
}
```

---

## Data Protection

### Encryption

**In Transit:**
- All API communication uses HTTPS/TLS 1.2+
- Sensitive data encrypted before transmission

**At Rest:**
- Database encryption enabled
- Sensitive fields encrypted in database
- Encryption keys stored securely (AWS KMS, Vault)

### Data Minimization

- Collect only necessary data
- Delete data after retention period
- Anonymize user data when possible

### PII Protection

- Credit card data not stored (Razorpay/Stripe)
- Phone numbers encrypted
- Email addresses hashed for privacy

---

## API Security

### Input Validation

```javascript
const { body, validationResult } = require('express-validator');

app.post('/api/auth/register', [
  body('email').isEmail(),
  body('password').isLength({ min: 8 }),
  body('phone').matches(/^[6-9]\d{9}$/),
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  // Process request
});
```

### SQL/NoSQL Injection Prevention

- Use parameterized queries
- ORM with Mongoose (automatically escaped)
- Input validation and sanitization

### Rate Limiting

```javascript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests'
});

app.use('/api/', limiter);
```

### CORS Configuration

```javascript
app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(','),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

### Security Headers

```javascript
import helmet from 'helmet';

app.use(helmet());
// Sets: X-Content-Type-Options, X-Frame-Options, X-XSS-Protection, etc.
```

---

## Frontend Security

### XSS Protection

- React automatically escapes content
- Use `dangerouslySetInnerHTML` carefully
- Sanitize user-generated content

```jsx
import DOMPurify from 'dompurify';

// Safe rendering
<div dangerouslySetInnerHTML={{ 
  __html: DOMPurify.sanitize(userContent) 
}} />
```

### CSRF Protection

- Token-based CSRF protection
- SameSite cookie attribute set to Strict

```javascript
app.use(csrf());
```

### Content Security Policy (CSP)

```javascript
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'", "'unsafe-inline'"],
    styleSrc: ["'self'", "'unsafe-inline'"],
    imgSrc: ["'self'", 'data:', 'https:'],
  }
}));
```

### Secure Cookie Settings

```javascript
session({
  cookie: {
    secure: true, // Only sent over HTTPS
    httpOnly: true, // Not accessible via JavaScript
    sameSite: 'strict', // CSRF protection
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  }
})
```

---

## Infrastructure Security

### Network Security

- All traffic encrypted (HTTPS)
- Firewall rules restrict access
- DDoS protection enabled
- Web Application Firewall (WAF)

### Database Security

- Database access restricted to backend
- Connection string uses strong password
- Database user has minimal required permissions
- Automated backups encrypted
- Regular security patches applied

### Server Security

- OS security patches applied regularly
- SSH key-based authentication
- Failed login attempts monitored
- Root login disabled
- UFW firewall enabled

### Secrets Management

```bash
# Never commit secrets
echo ".env" >> .gitignore

# Use environment variables
process.env.JWT_SECRET
process.env.DATABASE_PASSWORD

# Or use secret management:
# - AWS Secrets Manager
# - HashiCorp Vault
# - Azure Key Vault
```

---

## Compliance

### GDPR Compliance

- User data collection consent
- Right to access personal data
- Right to be forgotten (data deletion)
- Data portability support
- Privacy policy available
- DPA with third-party services

### Payment Security (PCI DSS)

- No credit card data stored
- PCI DSS Level 1 compliance via Razorpay/Stripe
- Secure payment gateway integration
- Regular security audits

### Data Breach Protocol

1. **Identify**: Confirm the breach
2. **Contain**: Stop ongoing access
3. **Investigate**: Determine scope
4. **Notify**: Inform affected users (within 72 hours)
5. **Document**: Record all actions

---

## Logging & Monitoring

### Security Logging

```javascript
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'logs/security.log' })
  ]
});

// Log authentication attempts
logger.info('User login', { userId, timestamp, ip });
logger.warn('Failed login attempt', { email, ip });
```

### Monitoring Alerts

- Failed login attempts (>5 in 15 min)
- Unusual API activity
- Database access anomalies
- Certificate expiration warnings
- Backup failures

---

## Vulnerability Management

### Dependency Management

```bash
# Check for vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix

# Auto-fix on install
npm install --audit-fix
```

### Regular Updates

- Update Node.js regularly
- Update all dependencies
- Apply security patches
- Test updates in staging first

### Security Testing

- Penetration testing quarterly
- Code reviews for security
- OWASP Top 10 compliance check
- Automated security scanning

---

## Incident Response

### Response Plan

1. **Triage**: Assess severity
2. **Contain**: Limit damage
3. **Investigate**: Determine cause
4. **Remediate**: Fix the issue
5. **Recovery**: Restore normal operation
6. **Post-Mortem**: Learn from incident

### Severity Levels

- **Critical**: System down or data compromised
- **High**: Major security issue
- **Medium**: Moderate security risk
- **Low**: Minor issue or informational

---

## Security Checklist

### Before Deployment

- [ ] All secrets removed from code
- [ ] HTTPS enabled and configured
- [ ] CORS properly configured
- [ ] Rate limiting enabled
- [ ] Input validation implemented
- [ ] Error messages don't reveal sensitive info
- [ ] Security headers configured
- [ ] Database backups encrypted
- [ ] Logging configured
- [ ] Security tests passed

### Regular Security Tasks

- [ ] Update dependencies (weekly)
- [ ] Review logs for anomalies (daily)
- [ ] Check certificate expiration (monthly)
- [ ] Backup database (daily)
- [ ] Security audit (quarterly)
- [ ] Penetration testing (annually)
- [ ] Employee security training (annually)

---

## Reporting Security Issues

If you find a security vulnerability:

1. **Do NOT** create a public GitHub issue
2. Email: security@indibuy.com
3. Include:
   - Description of vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix

We will:
- Acknowledge receipt within 24 hours
- Investigate and confirm
- Develop and test fix
- Release security patch
- Credit reporter (if desired)

---

## Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [NIST Cybersecurity Framework](https://www.nist.gov/cyberframework)
- [CWE Top 25](https://cwe.mitre.org/top25/)
- [Security Headers](https://securityheaders.com/)

---

## References

- RFC 7519 - JWT
- RFC 6749 - OAuth 2.0
- RFC 6234 - US Secure Hash
- ISO/IEC 27001 - Information Security

---

## Document Version

Version: 1.0
Last Updated: January 2024
Next Review: July 2024

