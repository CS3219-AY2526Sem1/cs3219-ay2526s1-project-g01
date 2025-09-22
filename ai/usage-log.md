# AI Usage Log

## Entry 1

# Date/Time:
2025-09-15 12:00

# Tool:
ChatGPT (model: ChatGPT-4.1)

# Prompt/Command:
Request to implement a reusable debounced input component in React with TypeScript support, extending shadcn/ui Input component with custom debouncing functionality.

# Output Summary:
- Complete React component with TypeScript interfaces
- Custom useDebouncedValue hook implementation
- DebouncedInput component with forwardRef support
- Proper prop extension from React.ComponentProps<"input">
- Integration with shadcn/ui Input component
- Debounce functionality with configurable delay (default 300ms)
- Support for controlled/uncontrolled input patterns

# Action Taken:
- [x] Accepted as-is
- [ ] Modified
- [ ] Rejected

# Author Notes:
- Validated correctness of debouncing logic and React hooks usage
- Confirmed security implications are minimal (client-side UI component)
- Tested performance with different debounce delays

---

## Entry 2

# Date/Time:
2025-09-15 15:20

# Tool:
GitHub Copilot (model: Claude Sonnet 4)

# Prompt/Command:
"set up docker file for my express app" - Request to create Dockerfile and .dockerignore for Node.js Express user-service application

# Output Summary:
- Multi-stage Dockerfile with deps, builder, and runner stages
- Production-optimized configuration with Alpine Linux base
- Security features: non-root user (expressjs:nodejs), production dependencies only
- Performance optimizations: layer caching, small image size
- Health check endpoint configuration
- Comprehensive .dockerignore file excluding unnecessary files
- Proper file copying and permissions setup

# Action Taken:
- [x] Accepted as-is
- [ ] Modified
- [ ] Rejected

# Author Notes:
- Reviewed multi-stage build structure for optimization
- Verified security configurations (non-root user, Alpine base)
- Confirmed port 3001 matches application configuration
- Validated .dockerignore excludes sensitive files (.env, node_modules)
- Health check endpoint may need implementation in Express app
- Docker setup follows best practices for Node.js applications

---

## Entry 3

# Date/Time:
2025-09-15 17:30

# Tool:
GitHub Copilot (model: Claude Sonnet 4)

# Prompt/Command:
"Create a root package.json with concurrently scripts for concurrent development workflow" - Request to set up npm scripts for running both frontend and user-service simultaneously during development

# Output Summary:
- Root-level package.json configuration for monorepo-style development
- Concurrently package integration for parallel script execution
- Development scripts: dev, dev:frontend, dev:user-service
- Production scripts: start, start:frontend, start:user-service
- Build scripts: build, build:frontend, build:user-service
- Utility scripts: install:all, clean
- Proper cross-platform script configuration for Windows/Unix compatibility

# Action Taken:
- [x] Accepted as-is
- [ ] Modified
- [ ] Rejected

# Author Notes:
- Validated script paths and directory navigation (cd commands)
- Confirmed concurrently package version (^8.2.2) is current
- Tested npm run dev workflow for concurrent frontend/backend startup
- Scripts support both development and production deployment scenarios
- Clean script properly removes node_modules from all service directories
- install:all script ensures all dependencies are installed across services
- Improves developer experience with single command for multi-service development

---

## Entry 4

# Date/Time:
2025-09-15 18:45

# Tool:
GitHub Copilot (model: Claude Sonnet 4)

# Prompt/Command:
Request to implement toast notifications for signup form validation with top-center positioning and custom styling, replacing disabled button with specific error feedback.

# Output Summary:
- Sonner toast library integration in Next.js layout.tsx
- Custom toast positioning (top-center) with enhanced visual styling
- Password complexity validation with detailed toast feedback
- Custom CSS styling with backdrop blur, hover effects, and type-specific border colors
- Toast configuration with rich colors, close button, and 4-second duration
- Individual validation checks replacing single disabled button state

# Action Taken:
- [x] Accepted as-is
- [ ] Modified
- [ ] Rejected

# Author Notes:
- Validated toast notification UX improves over disabled button approach
- Confirmed Sonner library is modern and well-maintained for React/Next.js
- Reviewed custom CSS for accessibility and visual consistency
- Tested toast positioning and timing for optimal user experience
- Security implications minimal (client-side UI feedback only)
- Enhanced user experience with specific, actionable error messages

---

## Entry 5

# Date/Time:
2025-09-15 19:15

# Tool:
GitHub Copilot (model: Claude Sonnet 4)

# Prompt/Command:
Request to implement comprehensive signup form improvements including controlled inputs, debounced password validation, password complexity requirements with visual indicators, and enhanced UX patterns.

# Output Summary:
- Converted all form inputs to controlled React components with proper state management
- Implemented DebouncedInput component for confirm password field with 300ms delay
- Added password complexity validation using regex patterns (length, uppercase, lowercase, number, special characters)
- Dynamic password requirements display with focus/blur states and visual indicators (Check/X icons)
- Password visibility toggle buttons for both password fields
- Real-time password match validation with error messaging
- Enhanced form validation logic with proper state synchronization
- Improved accessibility with proper labeling and error states

# Action Taken:
- [ ] Accepted as-is
- [x] Modified
- [ ] Rejected

# Author Notes:
- Validated all form state management follows React best practices
- Confirmed password regex patterns meet common security requirements
- Tested debounced validation prevents excessive API calls or state updates
- Reviewed accessibility features for screen readers and keyboard navigation
- Performance optimized with proper useCallback and state dependencies
- UX improvements provide clear visual feedback for password requirements
- Security considerations: client-side validation only, server validation still required

---

## Entry 6

# Date/Time:
2025-09-15 20:30

# Tool:
GitHub Copilot (model: Claude Sonnet 4)

# Prompt/Command:
Request to create reusable error handling utilities for consistent API error management and user feedback across the application.

# Output Summary:
- Created comprehensive error handling utility (/utils/errorHandler.ts)
- Implemented extractErrorInfo function for normalizing different error types
- Added handleApiError function with smart error detection and toast notifications
- Created handleApiSuccess function for consistent success feedback
- Added withErrorHandling and withLoadingAndErrorHandling wrapper functions
- Integrated TypeScript interfaces for error responses
- Implemented status-specific error titles (Conflict, Validation Error, etc.)
- Added automatic toast management with loading state handling
- Updated SignUpComponent to use new error handling utilities

# Action Taken:
- [x] Accepted as-is
- [ ] Modified
- [ ] Rejected

# Author Notes:
- Validated error handling covers all HTTP status codes and network scenarios
- Confirmed TypeScript type safety for all error and response scenarios
- Reviewed reusable utility functions for DRY principle adherence
- Performance considerations: automatic loading toast dismissal prevents UI conflicts
- Security implications minimal: client-side error handling only
- UX improvements: consistent error messaging and user feedback across application
- Maintainability: centralized error handling logic for easy updates

---

## Entry 7

# Date/Time:
2025-09-15 21:15

# Tool:
GitHub Copilot (model: Claude Sonnet 4)

# Prompt/Command:
Request to implement simple cookie utilities for JWT token storage and removal, ensuring compatibility with Next.js middleware authentication.

# Output Summary:
- Created minimal cookie management utilities (/services/userServiceCookies.ts)
- Implemented addToken function for setting JWT token in browser cookies
- Implemented removeToken function for clearing authentication cookies on logout


# Action Taken:
- [x] Accepted as-is
- [ ] Modified
- [ ] Rejected

# Author Notes:
- Validated cookie naming convention matches middleware token reading logic
- Confirmed simplicity over complexity for basic token storage requirements
- Maintainability: simple two-function API for easy integration across application

---

## Entry 8

# Date/Time:
2025-09-16 00:05

# Tool:
GitHub Copilot (model: Claude Sonnet 4)

# Prompt/Command:
Request to implement UserContext for managing user authentication state and create a global navigation bar that appears on all non-auth pages with conditional rendering.

# Output Summary:
- Created React UserContext (/contexts/UserContext.tsx) for centralized user state management
- Implemented automatic token verification using verifyToken API
- Added user data persistence across page refreshes with token-based restoration
- Created Navbar component (/app/components/layout/Navbar.tsx) with PeerPrep branding and navigation
- Implemented NavbarWrapper (/app/components/layout/NavbarWrapper.tsx) for conditional rendering
- Updated root layout.tsx to include UserProvider and NavbarWrapper
- Enhanced LoginComponent to set user data in context after successful authentication
- Updated WelcomeComponent to display actual username from UserContext instead of hardcoded name
- Fixed cookie utilities with getToken function for token retrieval

# Action Taken:
- [ ] Accepted as-is
- [x] Modified
- [ ] Rejected

# Author Notes:
- Validated UserContext properly handles token verification through API calls rather than JWT parsing
- Confirmed conditional navbar rendering excludes auth pages (/auth/*) as required
- Reviewed user state persistence across page refreshes and browser sessions
- Tested integration between LoginComponent, UserContext, and display components
- Security considerations: Token verification through backend API ensures data integrity
- UX improvements: Consistent navigation experience with user-aware display elements
- Maintainability: Centralized user state management with clear separation of concerns
- Debug logging enables easier troubleshooting of authentication state issues
- Navbar modified by me after AI implementation to meet specific design requirements

---

## Entry 9

# Date/Time:
2025-09-16 16:00

# Tool:
GitHub Copilot (model: Claude Sonnet 4)

# Prompt/Command:
Configure Nginx reverse proxy for PeerPrep frontend and user service with proper routing, CORS handling, and Next.js client-side navigation support.

# Output Summary:
- Configured Nginx API gateway for frontend and user service routing
- Fixed Docker networking issues for login redirects
- Enhanced API configuration for server-side vs client-side calls

# Action Taken:
- [x] Accepted as-is
- [ ] Modified
- [ ] Rejected

# Author Notes:
- Validated correctness, security, and performance of the configuration

---

## Entry 10

# Date/Time:
2025-09-16 16:30

# Tool:
GitHub Copilot (model: Claude Sonnet 4)

# Prompt/Command:
Fix Docker networking bug where middleware (server-side) and browser (client-side) need different API endpoints for same service.

# Output Summary:
- Added dynamic axios client creation to handle different execution contexts
- Implemented separate URLs for server-side (http://user-service:4000) and client-side (http://localhost/api) calls
- Fixed middleware token verification failing due to incorrect API endpoint routing
- Added comprehensive documentation explaining the Docker networking solution

# Action Taken:
- [x] Accepted as-is
- [ ] Modified
- [ ] Rejected

# Author Notes:
- Validated dynamic client creation approach fixes Docker container-to-container communication issues
- Confirmed solution maintains proper API gateway routing for browser requests

---

## Entry 11

# Date/Time:
2025-09-16 20:00

# Tool:
ChatGPT (model: GPT-4.1)

# Prompt/Command:
Request to generate email regex validation.

# Output Summary:
- Comprehensive regex pattern for validating email addresses
- Support for various email formats including subdomains and special characters
- Edge case handling for common email validation pitfalls

# Action Taken:
- [x] Accepted as-is
- [ ] Modified
- [ ] Rejected

# Author Notes:
- I validated correctness, security, and performance of the code

---

## Entry 12

# Date/Time:
2025-09-16 21:00

# Tool:
GitHub Copilot (model: Claude Sonnet 4)

# Prompt/Command:
Request to create a simple client-side auth guard that prevents browser back navigation to cached protected pages after logout.

# Output Summary:
- Created AuthGuard component (/app/components/layout/AuthGuard.tsx) for layout-level protection
- Implemented pathname-based token checking using Next.js usePathname hook
- Added immediate redirect to login when no token found on protected routes
- Integrated AuthGuard into root layout.tsx for automatic protection on all pages
- Enhanced middleware with cookie clearing on redirects for complete logout state
- Combined server-side cache control headers with client-side token verification

# Action Taken:
- [ ] Accepted as-is
- [x] Modified
- [ ] Rejected

# Author Notes:
- Validated AuthGuard catches browser back navigation edge case after logout
- Confirmed minimal performance impact with simple token existence check
- Security implications: client-side protection complements server-side middleware
- UX improvements: immediate redirect prevents brief flash of protected content
- Maintainability: simple, reusable component for future auth requirements


## Entry 13

# Date/Time:
2025-09-19 19:00

# Tool:
Gemini (Tried to google the answer online and Google's AI overview mentioned the recommendations)

# Prompt/Command:
Ask on how to disable scrollbar and to not create additional empty spaces when there is still sufficient space to enter code.

# Output Summary:
- Explain that Monaco Editor has a field called "scrollBeyondLastLine" that when disabled will cause the scrollbar to scroll only till the last line.

# Action Taken:
- [X] Accepted as-is
- [ ] Modified
- [ ] Rejected

# Author Notes:
- Add the field "scrollBeyondLastLine" and set it to false in the Monaco Editor configuration
- Tested the UI and found that the scrollbar will not appear if there is sufficient space for code to be entered. If code entered has exceeded the maximum container height, the scrollbar will only allow the user to scroll till the last line.

---

## Entry 14

# Date/Time:
2025-09-23 14:30

# Tool:
GitHub Copilot (model: Claude Sonnet 4)

# Prompt/Command:
Request to create an email unverified page with logo similar to login page, information about unverified email status, and clickable resend functionality with proper AI disclosure formatting.

# Output Summary:
- Created UnverifiedPage component (/app/auth/unverified/page.tsx) with consistent visual design
- Implemented logo display matching login page layout using Next.js Image component
- Included back to login navigation link for user convenience

# Action Taken:
- [ ] Accepted as-is
- [x] Modified
- [ ] Rejected

# Author Notes:
- Validated visual consistency with existing login page design patterns
- Confirmed accessibility features with proper button states and navigation
- Maintainability: clean component structure ready for API integration

---

## Entry 15

# Date/Time:
2025-09-23 14:45

# Tool:
GitHub Copilot (model: Claude Sonnet 4)

# Prompt/Command:
Request to create a check-email page with same instructions where check email happens after users first press sign up, with logo display and resend functionality.

# Output Summary:
- Created CheckEmailPage component (/app/auth/check-email/page.tsx) for post-signup email verification
- Implemented logo display matching login page layout using Next.js Image component
- Added resend email functionality with loading state and toast notifications
- Included back to login navigation link for user convenience

# Action Taken:
- [ ] Accepted as-is
- [x] Modified
- [ ] Rejected

# Author Notes:
- Validated visual consistency with existing auth page design patterns
- Confirmed accessibility features with proper button states and navigation
- Maintainability: clean component structure ready for API integration

---


