# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 0.1.x   | :white_check_mark: |

## Reporting a Vulnerability

If you discover a security vulnerability in CatchLog+, please report it by:

1. **Do NOT** open a public issue
2. Email the repository owner directly at the email associated with the GitHub account
3. Include detailed steps to reproduce the vulnerability
4. Allow up to 48 hours for initial response

## Security Features

### Workflow Security

The Vibeify Command Dispatcher workflow implements multiple security layers:

- **Multi-factor Authorization**: Actor verification + label-based approval + PR prevention
- **Command Whitelisting**: Only pre-approved command patterns can execute
- **Input Sanitization**: Dangerous shell characters are blocked
- **Audit Logging**: All execution attempts logged with unique IDs
- **Sandboxed Execution**: 15-minute timeout, strict error handling
- **Least Privilege**: Minimal token permissions

For detailed security documentation, see:
- [Vibeify Security Guide](.github/vibeify/docs/workflows/VIBEIFY_DISPATCHER_SECURITY.md)
- [Quick Start Guide](.github/vibeify/docs/workflows/VIBEIFY_DISPATCHER_QUICKSTART.md)

### Dependency Security

We regularly monitor dependencies for vulnerabilities:

```bash
npm audit
```

Run this command locally to check for known vulnerabilities in project dependencies.

## Security Updates

Security improvements are documented in commit messages and pull requests with the `security` label.

Recent security enhancements:
- **2025-11-12**: Hardened Vibeify Command Dispatcher with comprehensive security controls
  - Added command whitelisting
  - Implemented multi-layer authorization
  - Added comprehensive audit logging
  - Separated validation and execution jobs

## Best Practices

### For Contributors

- Never commit secrets or API keys
- Use environment variables for sensitive data
- Run `npm audit` before submitting PRs
- Follow the principle of least privilege
- Validate all user inputs

### For Workflow Authors

- Always use the `vibe:run-prompt` label for command execution
- Validate commands locally with `scripts/validate-vibe-command.sh`
- Review workflow logs for unusual patterns
- Keep command whitelist minimal
- Document security implications of workflow changes

## Security Checklist for PRs

Before submitting a PR that touches workflows or security-sensitive areas:

- [ ] No hardcoded secrets or credentials
- [ ] Input validation implemented
- [ ] Error handling in place
- [ ] Audit logging added where appropriate
- [ ] Documentation updated
- [ ] `npm audit` passes
- [ ] Workflow validation passes (YAML syntax)
- [ ] Security implications documented

## Contact

For security concerns, contact the repository owner through GitHub.

---

**Last Updated**: 2025-11-12  
**Next Review**: 2026-02-12
