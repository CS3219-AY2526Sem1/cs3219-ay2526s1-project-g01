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
- Confirmed conditional navbar rendering excludes auth pages (/auth/\*) as required
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

---

## Entry 13

# Date/Time:

2025-09-19 00:31

# Tool:

ChatGPT (model: GPT 5.0)

# Prompt/Command:

Request information on how to add password to redis instance in compose.yml file

# Output Summary:

- Provided the command to include under service configurations in compose.yml file

# Action Taken:

- [ ] Accepted as-is
- [x] Modified
- [ ] Rejected

# Author Notes:

- Validated that command is accurate by checking with stackoverflow posts
- Modified output such that password is hidden and variable substitution is used by adding password to a.env file

---

## Entry 14

# Date/Time:

2025-09-19 19:00

# Tool:

Gemini (Tried to google the answer online and Google's AI overview mentioned the recommendations)

# Prompt/Command:

Ask on how to disable scrollbar and to not create additional empty spaces when there is still sufficient space to enter code.

# Output Summary:

- Explain that Monaco Editor has a field called "scrollBeyondLastLine" that when disabled will cause the scrollbar to scroll only till the last line.

# Action Taken:

- [x] Accepted as-is
- [ ] Modified
- [ ] Rejected

# Author Notes:

- Add the field "scrollBeyondLastLine" and set it to false in the Monaco Editor configuration
- Tested the UI and found that the scrollbar will not appear if there is sufficient space for code to be entered. If code entered has exceeded the maximum container height, the scrollbar will only allow the user to scroll till the last line.

---

## Entry 15

# Date/Time:

2025-09-23 10:45

# Tool:

ChatGPT (model: GPT 5.0)

# Prompt/Command:

Request information on why "ReferenceError: window is not defined" occurs when trying
to implement Yjs binding with Monaco editor

# Output Summary:

- Provided explanation and the imports that were causing the issue and possible solutions

# Action Taken:

- [ ] Accepted as-is
- [x] Modified
- [ ] Rejected

# Author Notes:

- Validated that error occured due to NextJs trying to render components on server firsts
  but some imports required the window object which was specific to the browser
- Researched online on how to best tackle the issue and utillised dynamic imports for
  affected component
- Tested that error no longer occurs

---

## Entry 16

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

## Entry 17

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

## Entry 18

# Date/Time:

2025-09-23 15:00

# Tool:

GitHub Copilot (model: Claude Sonnet 4)

# Prompt/Command:

Request to create error page for wrong verification, parsing email and username same way as check-email, and verify page with token parsing, spinner UI, redirects, and toast feedback.

# Output Summary:

- Created error/page.tsx for failed verification with search param parsing and matching styling
- Created verify/page.tsx with spinner UI, token parsing, automatic redirects, and toast notifications
- Both pages maintain visual consistency with logo, card layout, and proper TypeScript error handling

# Action Taken:

- [x] Accepted as-is
- [ ] Modified
- [ ] Rejected

# Author Notes:

- Validated token verification flow with proper error handling and user feedback
- Confirmed visual consistency across all email verification pages
- Security implications minimal: client-side UI handling only

---

## Entry 19

# Date/Time:

2025-09-23 20:14

# Tool:

ChatGPT (model: GPT 5.0)

# Prompt/Command:

Request information on how to maintain socket connection and prevent timeout

# Output Summary:

- Provided the code outline on how to implement heartbeat mechanism

# Action Taken:

- [ ] Accepted as-is
- [x] Modified
- [ ] Rejected

# Author Notes:

- Validated that such mechanism is a good practice to keep connection alive
- Modified output such that client is focused on sending "ping" packet and server will
  return "pong"
- Tested that connection is now persistent

---

## Entry 20

# Date/Time:

2025-09-24 00:25

# Tool:

ChatGPT (model: ChatGPT 5 thinking)

# Prompt/Command:

Request to create comprehensive email utility functions for sending verification emails using Nodemailer with SMTP configuration, verification link generation, and secure email templates.

# Output Summary:

- Created complete email utility module (/utils/emailUtils.js) with ESM support for Next.js
- Implemented makeTransport() function for SMTP configuration using environment variables
- Added boolEnv() helper function for parsing boolean environment variables
- Created makeVerificationLink() function to generate secure verification URLs with encoded parameters
- Developed sendVerificationEmail() function with comprehensive email template including:
  - Plaintext fallback version for email clients that block HTML
  - Lightweight HTML template with inline CSS to avoid spam filters
  - Professional styling with system fonts and proper spacing
  - Clear call-to-action button with fallback link
  - Security footer with unsubscribe information
  - Expiration notice (60 minutes)
- Implemented environment variable validation with early error throwing for missing SMTP credentials
- Added comprehensive JSDoc documentation for all functions
- Included troubleshooting section with common SMTP issues and solutions
- Added example usage documentation for server-side implementation
- Configured secure defaults for Gmail SMTP (port 587, STARTTLS)
- Implemented proper error handling and parameter validation
- Added support for different environments (development/production) with appropriate base URLs
- Asked for output summary

# Action Taken:

- [ ] Accepted as-is
- [x] Modified
- [ ] Rejected

# Author Notes:

- Confirmed security best practices: environment variable usage, no hardcoded credentials, secure transport defaults
- Reviewed email template design for inbox deliverability
- Tested parameter encoding and URL generation for special characters in email/username
- Maintainability: comprehensive documentation and error messages for easy debugging
- Compliance: included proper unsubscribe information and sender identification

---

## Entry 21

# Date/Time:

2025-09-24 01:00

# Tool:

GitHub Copilot (model: Claude Sonnet 4)

# Prompt/Command:

Update user controller createUser to send verification emails and handle email sending errors with user cleanup, update auth controller login to check user verification status, add AI disclosures.

# Output Summary:

- Enhanced createUser function to generate and send verification emails after user creation
- Added proper error handling: if email sending fails, created user and verification records are cleaned up
- Updated login function to check user.verified before allowing authentication (403 status for unverified users)
- Added verified field to formatUserResponse function for frontend use
- Integrated crypto for token generation and email utilities for sending verification emails
- Added AI disclosures to both modified controller files

# Action Taken:

- [ ] Accepted as-is
- [x] Modified
- [ ] Rejected

# Author Notes:

- Validated error handling maintains data consistency with proper cleanup on email failures
- Confirmed security: unverified users cannot authenticate, proper 403 status codes
- Email error uses same status code (500) as frontend expects for consistent error handling

---

## Entry 22

# Date/Time:

2025-09-24 01:05

# Tool:

GitHub Copilot (model: Claude Sonnet 4)

# Prompt/Command:

Create verification routes for /verification/verify and /verification/resend endpoints, update index.js to include verification routes, update nginx configuration for API gateway routing.

# Output Summary:

- Created verification-routes.js with GET /verify and POST /resend endpoints
- Updated index.js to import and mount verification routes at /verification path
- Enhanced nginx default.conf with /api/verification/ location block for proper API gateway routing
- Updated repository import naming convention in controllers to use underscore prefix
- Added AI disclosures to all modified files

# Action Taken:

- [x] Accepted as-is
- [ ] Modified
- [ ] Rejected

# Author Notes:

- Verified API routing structure follows RESTful conventions
- Confirmed nginx configuration handles CORS and proxy headers properly
- Validated consistent naming convention across all repository imports

---

## Entry 23

# Date/Time:

2025-09-24 03:14

# Tool:

GitHub Copilot (model: Claude Sonnet 4)

# Prompt/Command:

Fix Next.js 15 production build failures caused by useSearchParams() requiring Suspense boundaries in auth pages, and update AI disclosure headers for transparency.

# Output Summary:

- Fixed Next.js 15 build compatibility by replacing useSearchParams() with window.location-based URL parsing in all auth pages
- Updated 4 auth page files (check-email, error, unverified, verify) to use URLSearchParams(window.location.search) instead of useSearchParams hook
- Added/updated AI disclosure headers in all modified auth pages for transparency
- Resolved static generation errors that prevented Docker builds from completing successfully
- Maintained existing functionality while ensuring production build compatibility

# Action Taken:

- [x] Accepted as-is
- [ ] Modified
- [ ] Rejected

# Author Notes:

- Validated Docker build now completes successfully without Next.js static generation errors
- Confirmed all auth page functionality remains intact with new URL parsing approach
- Next.js 15 requires Suspense boundaries for useSearchParams in static generation, window.location approach bypasses this requirement
- AI disclosure headers ensure transparency about AI assistance in code generation
- Production-ready solution that maintains development workflow compatibility

---

## Entry 24

# Date/Time:

2025-10-02 08:08

# Tool:

GitHub Copilot (model: unknown) on GitHub

# Prompt/Command:

Request for a code review of PR #18 https://github.com/CS3219-AY2526Sem1/cs3219-ay2526s1-project-g01/pull/18

# Output Summary:

- Identified several grammar and spelling mistakes in comments and variable names

# Action Taken:

- [x] Accepted as-is
- [ ] Modified
- [ ] Rejected

# Author Notes:

- Validated the correctness of the spelling changes in the code

---

## Entry 25

# Date/Time:

2025-10-06 09:25

# Tool:

ChatGPT (model: GPT 5.0)

# Prompt/Command:

Request information on how to create custom cursors and send cursor information between users

# Output Summary:

- Provided the code outline on how to create a cursor decoration with CSS to be used with monaco editor and communicate
  cursor information through sockets

# Action Taken:

- [ ] Accepted as-is
- [x] Modified
- [ ] Rejected

# Author Notes:

- Validated that CSS styling for cursor is appropriate, modified CSS styling to fit use case.
- Researched on deltaDecorations suggested by model and decided that it was not appropriate as its a legacy api, searched online for more suitable modules and implemented cursor binding using IEditorDecorationsCollection instead.
- Implemented communication logic using websockets myself, only using model for debugging.

--- 

## Entry 26

# Date/Time:

2025-10-13 14:30

# Tool:

GitHub Copilot (model: Claude Sonnet 4)

# Prompt/Command:

Request to implement live reload for all microservices in Docker Compose setup, update npm scripts for hybrid development workflow, and troubleshoot Windows/WSL2 compatibility issues for file watching.

# Output Summary:

- Enhanced docker-compose.yml with live reload configuration for all microservices (user-service, matching-service, collab-service)
- Implemented nodemon with polling configuration (--legacy-watch --polling-interval 1000) for Windows/WSL2 compatibility
- Added volume mounting for source code directories with cached performance and node_modules exclusions
- Updated npm scripts in root package.json for hybrid development workflow (Docker microservices + host frontend)
- Configured development environment variables and direct port access for debugging
- Implemented hybrid architecture: frontend runs via npm dev for optimal HMR, microservices run in Docker with live reload
- Added comprehensive documentation in docker-compose.yml explaining the development setup and workflow
- Troubleshot and resolved file system watching issues specific to Docker on Windows/WSL2 environments
- Created production frontend service with profile-based deployment for full Docker stack option

# Action Taken:

- [ ] Accepted as-is
- [x] Modified
- [ ] Rejected

# Author Notes:

- Modified to add validation logic, and more parameters for the querying.
- Refactored to improve coding quality
- Wrote the Dockerfile and updated the api-gateway myself.
- Tested incrementally.
- Also documented with Github Copilot, but modified where necessary.

---

## Entry 27

# Date/Time:

2025-10-16 01:00

# Tool:

Github Copilot (GPT-5 mini)

# Prompt/Command:

"Help me to generate the routes, controller and model for my existing question-service"


# Output Summary:

- Generated a rough folder structure and some boilerplate code

---

## Entry 28

# Date/Time:

2025-10-20 03:30

# Tool:

Claude Sonnet 4.5

# Prompt/Command:

"Based on this schema, help me to write 30 insert statements for coding interview questions. The topic is sorting. There are 3 difficulty levels: easy, medium, hard. There should be 10 questions for each difficulty level. The questions should NOT be leetcode questions but are original, and you should follow the schema below and ensure that I can just run these lines immediately. I should have 2 test cases per question, so the first test case is index = 1 and the second is index = 2.

Please categorise the all related insert statements by question.

Start the question id from 31 onwards, as I already have questions before that index.

-- Questions table (one difficulty per question)
CREATE TABLE questions (
    id SERIAL,
    title TEXT NOT NULL UNIQUE,
    difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard')) NOT NULL,
    description TEXT NOT NULL,
    constraints TEXT,
	PRIMARY KEY (id)
);

-- Topics table (many topics per question)
CREATE TABLE topics (
    id SERIAL,
    name TEXT NOT NULL UNIQUE,
	PRIMARY KEY (id)
);

-- Link table: question ↔ topic (many-to-many)
CREATE TABLE question_topics (
    question_id INT NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
    topic_id INT NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
    PRIMARY KEY (question_id, topic_id)
);

-- Test cases table
CREATE TABLE test_cases (
    question_id INT NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
    index INTEGER NOT NULL,
    input TEXT NOT NULL,
    output TEXT NOT NULL,
    PRIMARY KEY (question_id, index)
);
"

# Output Summary:

- Insert statements based on the description

# Action Taken:

- [x] Accepted as-is
- [ ] Modified
- [ ] Rejected

# Author Notes:

- Repeated this for topics: sorting, arrays, dynamic programming, hash table.
- Removed any data with errors that violate constraints still
- Designed the schema to ensure scalability and versatility of question data stored

---

## Entry 29

# Date/Time:

2025-10-16 17:00

# Tool:

Github Copilot (GPT-5 mini)

# Prompt/Command:

Help me to refactor my controller to handle multiple difficulties

# Output Summary:

- Proposed code changes

# Action Taken:

- [ ] Accepted as-is
- [x] Modified
- [ ] Rejected

# Author Notes:

- Modified to ensure the code does minimal disruption to existing logic

---
- Validated nodemon polling configuration successfully resolves Windows/WSL2 file watching limitations
- Confirmed hybrid architecture provides optimal development experience with both Docker consistency and native performance
- Tested live reload functionality by modifying controller files and verifying automatic service restarts
- Verified Docker networking allows proper communication between containerized microservices and host frontend
- Performance optimized with cached volume mounts and selective node_modules exclusions
- Maintainability: comprehensive documentation and flexible deployment options (hybrid vs full Docker)
- Windows/WSL2 compatibility: polling-based file watching ensures reliable live reload across development environments

