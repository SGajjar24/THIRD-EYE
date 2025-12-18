# 🔧 Utilities

Helper functions and shared logic used across the application.

## Functions

### `urlValidator.ts`
Robust validation logic to ensure target URLs are safe and properly formatted before analysis.
- **Protocol Checks**: Enforces `https://` or `http://`.
- **Formatting**: Strips trailing slashes and validates domain structure.
- **Safety**: Flags potentially malicious patterns or invalid IP ranges.
