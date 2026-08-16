# Frontend security notes

## Already applied

- Signed-in routes and their child routes require a valid, unexpired JWT.
- Invalid or expired locally stored authentication data is removed safely.
- The interceptor sends the bearer token only to the configured API URL.
- Return URLs are limited to internal application paths.
- New-window actions use `noopener,noreferrer`.
- Angular templates use normal text interpolation; the workspace does not use `innerHTML`, `eval` or dynamic script execution.
- Production uses same-origin `/api` instead of a hardcoded HTTP backend URL.

## Required before a public production launch

This project is intentionally still on Angular 13 because that is the version of the supplied codebase. A dependency audit reports high-severity advisories in this unsupported Angular line. The automatic fix is a breaking framework upgrade, so it was not forced into this frontend redesign.

Plan a tested Angular upgrade before production. During the backend phase also move authentication to `Secure`, `HttpOnly`, `SameSite` cookies where practical; validate and authorize every request on the server; add rate limits to authentication and sharing endpoints; validate template configuration; and implement a read-only public-share endpoint that exposes only the intended resume fields.
