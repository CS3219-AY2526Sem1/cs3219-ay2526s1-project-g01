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

2025-10-13 02:00

# Tool:

Github Copilot (GPT-5 mini)

# Prompt/Command:

Help me add code to the api-gateway's default.conf file for my question-service and postgres. I am only using postgres from dockerhub's image.

# Output Summary:

- Proposed code for the api-gateway for question-service and postgres

# Action Taken:

- [ ] Accepted as-is
- [x] Modified
- [ ] Rejected

# Author Notes:

- Modified to ensure the code does minimal disruption to existing logic

---

## Entry 27

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

- Validated nodemon polling configuration successfully resolves Windows/WSL2 file watching limitations
- Confirmed hybrid architecture provides optimal development experience with both Docker consistency and native performance
- Tested live reload functionality by modifying controller files and verifying automatic service restarts
- Verified Docker networking allows proper communication between containerized microservices and host frontend
- Performance optimized with cached volume mounts and selective node_modules exclusions
- Maintainability: comprehensive documentation and flexible deployment options (hybrid vs full Docker)
- Windows/WSL2 compatibility: polling-based file watching ensures reliable live reload across development environments

---

## Entry 28

# Date/Time:

2025-10-16 01:00

# Tool:

Github Copilot (GPT-5 mini)

# Prompt/Command:

"Help me to generate the routes, controller and model for my existing question-service"

# Output Summary:

- Generated a rough folder structure and some boilerplate code

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

## Entry 30

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

## Entry 31

# Date/Time:

2025-10-21 01:30

# Tool:

ChatGPT (model: ChatGPT 5 thinking)

"How do I check if an email address is valid? Note that I already check its syntax, so I just need a helper function in JS served on an Express backend to check if the email actually exists. You may use any library you want; make sure it is well commented."

# Output Summary:

- Created comprehensive email verification utility with DNS MX lookup and SMTP RCPT TO probing
- Implemented proper error handling and timeout management
- Added support for STARTTLS upgrade and multiple MX host attempts
- Included detailed JSDoc documentation for all functions

# Action Taken:

- [ ] Accepted as-is
- [x] Modified
- [ ] Rejected

# Author Notes:

- I validated correctness, security, and performance of the code. I also redued the retry timer for more responsiveness.

---

## Entry 32

# Date/Time:

2025-10-21 02:00

# Tool:

GitHub Copilot (Grok Code Fast 1)

# Prompt/Command:

To add error handling for DNS resolution failures in verifyEmailExists function to prevent service crashes.

# Output Summary:

- Added try-catch block around resolveMx() DNS lookup call
- Implemented graceful handling of ENOTFOUND errors for invalid domains
- Return proper "unknown" status instead of throwing unhandled exceptions
- Prevent 500 errors during user registration with non-existent domains

# Action Taken:

- [x] Accepted as-is
- [ ] Modified
- [ ] Rejected

# Author Notes:

- Added try-catch block around resolveMx() call to handle ENOTFOUND errors gracefully and return proper unknown status instead of throwing unhandled exceptions.

---

## Entry 33

# Date/Time:

2025-10-21 13:40

# Tool:

GitHub Copilot (Grok Code Fast 1)

# Prompt/Command:

To add password reset email functionality with link generation and email sending functions similar to verification emails.

# Output Summary:

- Created makeResetPasswordLink function taking email, username, and rawToken parameters
- Created sendResetPasswordEmail function with professional HTML/plaintext templates
- Added comprehensive JSDoc documentation for both functions
- Implemented proper error handling and parameter validation
- Followed same security patterns as verification email functions

# Action Taken:

- [x] Accepted as-is
- [ ] Modified
- [ ] Rejected

# Author Notes:

- Validated functions follow the same pattern as verification emails with proper security and error handling
- Ensured consistent API design and documentation standards
- Added appropriate expiration notices and user-friendly email templates

---

## Entry 34

# Date/Time:

2025-10-21 14:00

# Tool:

GitHub Copilot (Grok Code Fast 1)

# Prompt/Command:

To create a password reset model similar to user verification model with proper MongoDB schema and security features.

# Output Summary:

- Created PasswordResetModel schema with userId, token, and createdAt fields
- Implemented proper indexing for userId and token fields for performance
- Added 1-hour expiration for reset tokens using MongoDB TTL
- Included comprehensive AI disclosure and documentation
- Followed same security patterns as UserVerifyModel

# Action Taken:

- [x] Accepted as-is
- [ ] Modified
- [ ] Rejected

# Author Notes:

- Validated schema structure follows MongoDB best practices with proper indexing
- Ensured token expiration prevents stale reset links
- Maintained consistency with existing verification model patterns

---

## Entry 35

# Date/Time:

2025-10-21 16:00

# Tool:

GitHub Copilot (Claude Sonnet 4.5)

# Prompt/Command:

To create a forgot password page with email input, reset link sending functionality, and proper error handling including 429 rate limiting with 30-second cooldown, and add forgot password link to login page.

# Output Summary:

- Created forgot password page at /auth/forgot-password with email input form
- Implemented 30-second cooldown timer similar to unverified page
- Added comprehensive error handling for 429 (rate limiting), 404 (user not found), and 403 (unverified email) status codes
- Added forgot password link to login component footer for easy access
- Integrated sendPasswordResetEmail API function from userServiceApi
- Used consistent styling and layout matching other auth pages
- Added AI disclosure header to new page

# Action Taken:

- [ ] Accepted as-is
- [x] Modified
- [ ] Rejected

# Author Notes:

- Validated error handling covers all expected failure scenarios including rate limiting
- Ensured cooldown timer prevents spam requests
- Confirmed visual consistency with existing auth pages (login, signup, unverified)
- Tested email validation before making API calls

---

## Entry 36

# Date/Time:

2025-10-21 17:00

# Tool:

GitHub Copilot (Claude Sonnet 4.5)

# Prompt/Command:

To create a password reset page that validates reset tokens from URL query parameters, displays loading state during validation, shows password input fields with strength validation similar to signup page, and handles password reset confirmation with proper error handling.

# Output Summary:

- Created reset password page at /auth/reset-password with query parameter parsing for email, username, and token
- Implemented initial token validation on page load with loading spinner
- Added three distinct UI states: validating token (spinner), invalid token (error message), and valid token (password reset form)
- Integrated password strength validation with visual indicators matching signup page requirements (length, uppercase, lowercase, number, special character)
- Added password visibility toggles for both password and confirm password fields
- Implemented debounced confirm password validation to check password match
- Used handleApiError for consistent error handling across all API calls
- Added comprehensive HTML comments explaining each section of the UI
- Displayed username and email (read-only) in password reset form for user verification
- Implemented automatic redirect to login page after successful password reset
- Added AI disclosure header to new page

# Action Taken:

- [ ] Accepted as-is
- [x] Modified
- [ ] Rejected

# Author Notes:

- Validated token validation occurs before showing password form to prevent unauthorized access
- Ensured password requirements match signup page for consistency
- Confirmed error handling covers all scenarios: invalid token, expired token, missing parameters, API failures
- Tested UI states transition correctly from loading to error/success states
- Verified proper integration with validatePasswordResetToken and confirmPasswordReset API functions
- Modified to improve code readability and maintainability with additional comments
- Modified to standardize styling and layout with existing auth pages

---

## Entry 37

# Date/Time:

2025-10-21 20:30

# Tool:

GitHub Copilot (Claude Sonnet 4.5)

# Prompt/Command:

Create a user account management page at /account with profile settings and password change functionality, matching the design and validation patterns from the signup page. Save buttons should only be enabled when fields are changed or filled, and disabled states should be visually obvious. Simulate API calls with timeouts and show toast notifications for success.

# Output Summary:

- Created /account page with three sections: Email Address (read-only), Profile (editable username), and Password (current, new, confirm fields)
- Implemented password strength validation and match checking identical to signup page, with visual indicators for requirements
- Added password visibility toggles for all password fields
- Save Changes button for username only enabled when username is changed; disabled state shows helper text and styling
- Save Changes button for password only enabled when all fields are filled; disabled state shows helper text and styling
- Simulated API calls for both profile and password changes using setTimeout
- Used toast notifications for success, matching app style
- Comprehensive comments and region organization for maintainability
- AI disclosure header included at top of file

# Action Taken:

- [ ] Accepted as-is
- [x] Modified
- [ ] Rejected

# Author Notes:

- Validated all button enable/disable logic and visual feedback for disabled states
- Ensured password validation and UX matches signup page for consistency
- Confirmed toast notifications and simulated API calls work as expected
- Code is clean, modular, and easy to maintain

---

## Entry 38

# Date/Time:

2025-10-21 23:30

# Tool:

GitHub Copilot (Claude Sonnet 4.5)

# Prompt/Command:

Create backend routes and controller functions for updating user password and username separately. PATCH /:id/password route accepts currentPassword and newPassword in body. PATCH /:id/username route accepts username in body. Include proper authentication, validation, and error handling.

# Output Summary:

- Added AI disclosure headers to user-routes.js, user-controller.js, and repository.js
- Created PATCH /:id/password route with verifyAccessToken and verifyIsOwnerOrAdmin middleware
- Created PATCH /:id/username route with verifyAccessToken and verifyIsOwnerOrAdmin middleware
- Implemented updateUserPassword controller function with:
  - Current password verification using bcrypt.compare
  - New password strength validation (minimum 8 characters)
  - Password hashing with bcrypt
  - Proper error handling for incorrect current password, missing fields, and user not found
- Implemented updateUsername controller function with:
  - Username uniqueness validation
  - Conflict checking to prevent duplicate usernames
  - Proper error handling for missing username and user not found
- Added updateUsernameById repository function to update username in database
- Both functions return formatted user response on success
- Added console.log debugging statements for both controller functions

# Action Taken:

- [x] Accepted as-is
- [ ] Modified
- [ ] Rejected

# Author Notes:

- Validated proper authentication and authorization using existing middleware
- Ensured password validation matches security requirements from signup
- Confirmed username uniqueness check prevents conflicts
- Verified bcrypt password comparison for current password verification
- Routes follow RESTful conventions and existing codebase patterns

---

## Entry 39

# Date/Time:

2025-10-22 15:00

# Tool:

ChatGPT

# Prompt/Command:

- Ask for tips on how to implement a background image as well as making components slightly transparent.
- Review current code and give suggestions on how to improve readability and interactivity.
- Ask for websites that provide free stock images without the need for attribution.

# Output Summary:

- Use bg-cover, bg-center, and bg-no-repeat in Tailwind for full coverage and positioning.
- Add a semi-transparent overlay with bg-black/30 or bg-opacity-30 to make text readable.
- Use drop shadows (drop-shadow-md) on headings for contrast.
- Recommended websites like Unsplash for stock images that do need require attribution

# Action Taken:

- [ ] Accepted as-is
- [x] Modified
- [ ] Rejected

# Author Notes:

- Structured the advice for implementing background images and transparency.
- Reviewed the current UI code and provided actionable improvements.
- Compiled a list of free stock image sources that do not require attribution.
- Recommended best practices for interactive and visually readable UI.

---

## Entry 40

# Date/Time:

2025-10-23 12:00

# Tool:

GitHub Copilot (model: Grok Code Fast 1)

# Prompt/Command:

"with syntax similar to password-reset-models (but not the logic) generate a ChangeEmailCodeSchema which contains the user id and a 6 digit code which expires in one hour"

# Output Summary:

- Created ChangeEmailCodeSchema in change-email-code.js with userId, code (6-digit), and createdAt with 1-hour expiration
- Followed password reset model syntax with proper indexing and MongoDB TTL for expiration
- Included comprehensive AI disclosure and documentation

# Action Taken:

- [x] Accepted as-is
- [ ] Modified
- [ ] Rejected

# Author Notes:

- Validated schema structure follows MongoDB best practices with proper indexing for userId and code fields
- Ensured 1-hour expiration prevents stale change codes using MongoDB TTL
- Maintained consistency with existing password reset model patterns for code organization

---

## Entry 41

# Date/Time:

2025-10-23 12:05

# Tool:

GitHub Copilot (model: Grok Code Fast 1)

# Prompt/Command:

implement the change emai code model related fns in the repostory i just need one which find by user id

# Output Summary:

- Added ChangeEmailCode model import to repository.js
- Implemented repository functions for change email code operations: createChangeEmailCodeRecord, findChangeEmailCodeByUserId, findChangeEmailCodeByCodeAndUserId, and deleteChangeEmailCodeByUserId
- Functions follow the same pattern as other models with proper MongoDB operations

# Action Taken:

- [x] Accepted as-is
- [ ] Modified
- [ ] Rejected

# Author Notes:

- Validated functions follow the same pattern as other models with proper MongoDB operations and error handling
- Ensured findChangeEmailCodeByUserId function meets the specific requirement
- Maintained consistency with existing repository function naming and structure

---

## Entry 42

# Date/Time:

2025-10-23 12:10

# Tool:

GitHub Copilot (model: Grok Code Fast 1)

# Prompt/Command:

implement the change email code functions which takes in an email user id user name and a 6 digit token and send to user. in the email address the user by his user name with bracket user id and tell him what is this code for and give a warning that if he did not request for it he should change his password immediately

# Output Summary:

- Implemented sendChangeEmailCode function in emailSender.js that sends 6-digit verification codes for email changes
- Added personalized greeting with username and userId in brackets as requested
- Included clear explanation that the code is for changing email address
- Added prominent security warning about changing password if request was not made
- Function follows the same pattern as other email functions with HTML and plaintext versions

# Action Taken:

- [x] Accepted as-is
- [ ] Modified
- [ ] Rejected

# Author Notes:

- Validated email template includes proper user identification with username (userId) format
- Ensured security warning is prominent and clear about password change recommendation
- Confirmed function parameters match requirements: email, userId, username, and 6-digit code
- Maintained consistency with existing email function patterns and error handling

---

## Entry 43

# Date/Time:

2025-10-23 12:20

# Tool:

GitHub Copilot (model: Grok Code Fast 1)

# Prompt/Command:

now create a function which send a warning to the user that a request to change email is made. this will be sent when user confirm want to change email. and request user to change password immediately and if he is already uanble to log in contact Peerprep technical support to report a phishing attempt

# Output Summary:

- Implemented sendEmailChangeWarning function in emailSender.js for security alerts when email change requests are initiated
- Included clear action steps: change password immediately and contact support if unable to log in
- Function follows security email patterns with both HTML and plaintext versions

# Action Taken:

- [ ] Accepted as-is
- [x] Modified
- [ ] Rejected

# Author Notes:

- Validated security-focused email template provides clear, urgent warnings about potential phishing attempts
- Ensured contact information is prominently displayed for technical support access
- Confirmed function parameters match requirements: email, userId, username
- Maintained consistency with existing security email patterns and error handling

---

## Entry 44

# Date/Time:

2025-10-23 12:30

# Tool:

GitHub Copilot (model: Grok Code Fast 1)

# Prompt/Command:

update the user-verify model to include a new field called purpose which should be either "new" or "change email" (change the phrasing as needed) the go to every single function for verify email to utilise the purpose including emailSender,routes to verify email (optional queryParams for purpose which defaults to new so i no need modify frontend) etc etc update ai dislosure to any file where u cchange where u change and then append new entry to ai/usage-log at the back. do not need to add new functions for new email yet just put it as a todo for now where it is expected

# Output Summary:

- Added purpose field to UserVerifyModel schema with enum values 'signup' and 'email-change', defaulting to 'signup'
- Updated createUserVerifyRecord repository function to accept optional purpose parameter
- Modified user-controller.js createUser function to pass 'signup' purpose when creating verification records
- Updated verification-controller.js to handle optional purpose query parameter in verifyUser and resendVerification functions
- Added TODO comment in verifyUser for implementing email change verification logic (returns 501 Not Implemented for now)
- Modified makeVerificationLink in emailSender.js to accept and include optional purpose parameter
- Updated verification routes to document optional purpose query parameter
- Added AI disclosure headers to all modified files: user-verify-model.js, repository.js, user-controller.js, verification-controller.js, emailSender.js, and verification-routes.js
- Purpose parameter defaults to 'signup' throughout the application to maintain backward compatibility

# Action Taken:

- [x] Accepted as-is
- [ ] Modified
- [ ] Rejected

# Author Notes:

- Validated that purpose field uses appropriate enum values ('signup' and 'email-change')
- Confirmed backward compatibility by making purpose optional with default value 'signup'
- Ensured all verification functions properly handle the purpose parameter
- Added TODO placeholder for future email change verification implementation
- Verified that existing frontend code doesn't need modification due to default parameter values

---

## Entry 45

# Date/Time:

2025-10-23 13:30

# Tool:

GitHub Copilot (model: Claude Sonnet 4.5)

# Prompt/Command:

ok now implement the needed route one to request for the 6 digit verification code to change email another to request for email change which will send an email verification to the email it will take in the 6 digit code username and new user email old user email and will only send the verification email if relevant

# Output Summary:

- Created two new email change routes in verification-routes.js: POST /request-email-change-code and POST /change-email
- Implemented requestEmailChangeCode controller function that generates 6-digit code, saves to ChangeEmailCode collection, and sends code to current email
- Implemented changeEmail controller function that validates 6-digit code, creates UserVerifyModel record with email-change purpose and newEmail field, sends verification link to new email, and sends security warning to old email
- Added imports for new email sender functions (sendChangeEmailCode, sendEmailChangeWarning) and repository functions (createChangeEmailCodeRecord, findChangeEmailCodeByCodeAndUserId, deleteChangeEmailCodeByUserId, findUserByEmail)
- Both routes include comprehensive validation: userId, username, email verification, code validation, duplicate email checking
- Routes follow existing authentication patterns and error handling conventions
- Added AI disclosure headers to verification-controller.js and verification-routes.js documenting the changes
- Simplified verifyUser function to remove newEmail field dependency - now uses email from query params directly

# Action Taken:

- [ ] Accepted as-is
- [x] Modified
- [ ] Rejected

# Author Notes:

- Validated that two-route flow properly separates code generation from email change request
- Confirmed security measures: 6-digit code validation, duplicate email checking, warnings sent to old email
- Ensured newEmail field simplification aligns with "keep it simple" principle - uses query params instead
- User undid the newEmail simplification and kept the field for data integrity
- Verified error handling covers all scenarios: missing fields, invalid codes, email conflicts

---

## Entry 46

# Date/Time:

2025-10-23 13:35

# Tool:

GitHub Copilot (model: Claude Sonnet 4.5)

# Prompt/Command:

"create a route to verify the 6 digit email-change-code only, and modify the verify page and the api endpoint it called to take in query params purpose and when purpose is not empty or signup there should not be a resend email button but instead will be replaced by a message log in to request for a new email change request (on the error page)""

# Output Summary:

- Created POST /verification/verify-email-change-code route that validates 6-digit codes without sending verification links
- Implemented verifyEmailChangeCode controller function with userId and code validation, returns success if code is valid
- Updated verifyUserEmail API function to accept optional purpose parameter and include it in query string
- Modified verify page to extract purpose from URL query params and pass it to API and error redirects
- Updated error page to extract purpose parameter and conditionally render:
  - Resend button when purpose is empty or "signup"
  - Login message ("Please log in to request a new email change verification.") when purpose is email-change
- Added AI disclosure headers to verification-controller.js, verification-routes.js, verify page, and error page
- Code does not delete or consume the verification code, allowing reuse until expiration

# Action Taken:

- [ ] Accepted as-is
- [x] Modified
- [ ] Rejected

# Author Notes:

- Validated verify-email-change-code route provides separate validation step before sending verification link
- Confirmed purpose parameter properly controls UI behavior on error page based on verification type
- Ensured backward compatibility with existing signup flow (purpose defaults to signup)
- Verified error page shows appropriate next steps based on verification context
- Code validation endpoint enables frontend to check code validity before proceeding with email change

---

## Entry 47

# Date/Time:

2025-10-23 23:15

# Tool:

GitHub Copilot (Claude Sonnet 4.5)

# Prompt/Command:

"add a delete account section which on click open a confirmation dialog which does the following ask user to enter their user name and press confirm and user can only press confirm when he typed it in and upon confirm call api user api helper function(implement it for me) and upon successfully delete account log out and rmb to clear cookies upon logging out"

# Output Summary:

- Created deleteAccount API function in userServiceApi.ts that calls DELETE /users/:userId with authentication
- Added delete account dialog states (isDeleteDialogOpen, deleteConfirmUsername, isDeletingAccount)
- Implemented handleDeleteAccount function with username confirmation validation
- Added automatic logout with cookie clearing (removeToken) and redirect to login after successful deletion
- Created Danger Zone card section with red border and destructive styling
- Implemented confirmation dialog requiring exact username match before enabling delete button
- Added proper error handling and toast notifications for delete operations
- Integrated with existing authentication flow and user context management

# Action Taken:

- [ ] Accepted as-is
- [x] Modified
- [ ] Rejected

# Author Notes:

- Validated deleteAccount API function uses correct endpoint (USER_SERVICE) and authentication header
- Confirmed username confirmation prevents accidental account deletion
- Ensured cookie clearing and logout flow properly cleans up user session
- Verified destructive/red styling provides clear visual warning for dangerous action
- Tested dialog flow: open → username input → confirm → delete → logout → redirect
- Security validated: requires authentication token and exact username match
- Structured the advice for implementing background images and transparency.
- Reviewed the current UI code and provided actionable improvements.
- Compiled a list of free stock image sources that do not require attribution.
- Recommended best practices for interactive and visually readable UI.

---

## Entry 48

# Date/Time:

2025-10-28 11:00

# Tool:

ChatGPT (model: ChatGPT 5 thinking)

# Prompt/Command:

Request to create a utility script for generating public/private key pairs in JWK format for JWT signing and verification.

# Output Summary:

- Created generate-key.mjs utility script using jose library for JWK generation
- Implemented RS256 algorithm with 2048-bit modulus length for RSA key pairs
- Generated keys with extractable option enabled for export capabilities
- Added unique kid (key ID) using crypto.randomUUID() for key identification
- Set alg (algorithm) and use (signature) fields in JWK output
- Exported both public and private keys in JWK format ready for .env configuration
- Script outputs PUBLIC_JWK and PRIVATE_JWK as JSON strings for easy environment variable usage

# Action Taken:

- [x] Accepted as-is
- [ ] Modified
- [ ] Rejected

# Author Notes:

- Validated correctness of JWK format and RS256 algorithm selection
- Confirmed security: 2048-bit RSA key provides adequate security for JWT signing
- Performance: Script generates keys quickly for development workflow
- Keys can be directly copied to environment variables for JWT configuration

---

## Entry 49

# Date/Time:

2025-10-28 23:55

# Tool:

GitHub Copilot (model: Claude Sonnet 4)

# Prompt/Command:

"check through my middleware an controller and make it use the private and public jwt instead of the og one"

# Output Summary:

- Updated auth-controller.js handleLogin to sign JWT tokens using PRIVATE_JWK instead of JWT_SECRET
- Added jose library imports: importJWK and exportPKCS8 for JWK to PEM conversion
- Implemented private key import from environment variable with extractable flag
- Converted imported JWK to PEM format using exportPKCS8 for jsonwebtoken compatibility
- Updated basic-access-control.js middleware to verify tokens using PUBLIC_JWK
- Added exportSPKI import for public key PEM conversion
- Implemented public key import and PEM conversion in verifyAccessToken middleware
- Maintained RS256 algorithm specification in both signing and verification
- Preserved existing token payload structure (id only) and 1-day expiration

# Action Taken:

- [x] Accepted as-is
- [ ] Modified
- [ ] Rejected

# Author Notes:

- Validated asymmetric JWT flow: signing with PRIVATE_JWK, verification with PUBLIC_JWK
- Confirmed jsonwebtoken library requires PEM format, not raw CryptoKey objects
- Security: Separation of signing and verification keys allows services to verify without signing capability
- Troubleshooting: Resolved "secretOrPrivateKey is not valid" and "CryptoKey is not extractable" errors
- Performance: importJWK and PEM conversion add minimal overhead to JWT operations
- Architecture: Enables distributed authentication where each service can verify tokens independently
- Tested end-to-end: Token generation at login → Token verification in middleware → User authentication successful

---

## Entry 50

# Date/Time:

2025-10-29 16:30

# Tool:

GitHub Copilot (model: Claude Sonnet 4)

# Prompt/Command:

"add middleware pasring on matching service all u need to do is to parse the jwt token and update the req.user and if not valid throw error put it in all th path" and "update matching controller so user it checks query params match the jwt parsed user id"

# Output Summary:

- Created middleware/auth.js in matching-service with verifyAccessToken function
- Implemented JWT verification using PUBLIC_JWK from environment variables
- Added jose library imports (importJWK, exportSPKI) for JWK to PEM conversion
- Applied verifyAccessToken middleware to all routes in matching-routes.js
- Added jsonwebtoken and jose dependencies to matching-service package.json
- Updated matching-controller.js to validate userId in params/body matches authenticated user ID
- Added authorization checks in startMatch, terminateMatch, checkStatus, and endSession endpoints
- Returns 403 Forbidden error when users attempt to access other users' resources
- Extracts user ID from JWT token and stores in req.user for controller access

# Action Taken:

- [x] Accepted as-is
- [ ] Modified
- [ ] Rejected

# Author Notes:

- Validated JWT verification middleware follows same pattern as user-service
- Security: Prevents users from starting matches, terminating, or checking status for other users
- Confirmed PUBLIC_JWK is already configured in matching-service .env files
- Tested middleware integration: All routes now require valid JWT tokens
- Authorization layer ensures userId from JWT matches userId in request parameters
- Maintains consistency across microservices for authentication architecture
- Successfully installed jose and jsonwebtoken packages via npm install

---

## Entry 51

# Date/Time:

2025-10-24 22:45

# Tool:

ChatGPT (model: GPT-5)

# Prompt/Command:

Request to review WebRTC signaling code and verify the correctness of the flow, including whether the exchange of SDP offers and answers between users works properly, and how ICE candidates are handled before the remote description is set.

# Output Summary:
- Reviewed the code handling offer-made, offer-accepted, and ice-candidate socket events.
- Confirmed that the logic correctly ensures both peers can exchange SDP offers and answers through the signaling server.
- Explained the proper WebRTC flow:
 1. User A creates an SDP offer and sends it through the signaling server.
 2. User B receives the offer, sets it as a remote description, creates an SDP answer, and returns it.
 3. User A then sets the received answer as a remote description.
 4. Both sides exchange ICE candidates

# Action Taken:
- [ ] Accepted as-is
- [x] Modified
- [ ] Rejected

Author Notes:
- The signaling logic and peer connection setup were tested in a live environment with two users joining the same session room.
- Connection established successfully with audio/video exchange.
- Fix bugs where the server emits to the wrong user (eg to the current user instead of the other user)
- WebRTC connection is working but bugs are encountered, such as the connection not being made if one user refreshes his/her browser or leaves and rejoins the same room

---

## Entry 52

# Date/Time:

2025-10-26 19:30

# Tool:

Claude Sonnet 4.5

# Prompt/Command:

Request to fix bug where remote description was null, resulting in an error where 
ice candidates cannot be added for the RTC Connection.

# Output Summary:
- Implemented a queue where ice candidates are stored in a queue and then added once 
remote description is set
- Added checks for remoteDescription before ice candidates are added
- Added a delay to allow both users to set up their socket listeners

# Action Taken:
- [x] Accepted as-is
- [ ] Modified
- [ ] Rejected

# Author Notes:
- Validated that the updated code is working by deploying the service and testing it with
another teammate
- No bugs were observed during the test
- Remove unnessecary loggings and refactor some code into a separate function (eg answerCall())

---

## Entry 53

# Date/Time:
2025-10-28 20:00

# Tool:
Claude Sonnet 4.5

# Prompt/Command:
Request to route Socket.IO frontend connection through API Gateway (Nginx) instead of connecting directly to Express server at localhost:8080

# Output Summary:
- Provided solution to route Socket.IO through Nginx API Gateway
- Added `communication-service` to docker-compose.yaml with live reload capability
- Changed service port from 8080 to 6000 to resolve port conflict
- Configured Nginx location block for WebSocket proxying with `/communication-socket/` custom path
- Updated frontend Socket.IO client to use custom path option: `{ path: '/communication-socket/' }`
- Explained Nginx `proxy_pass` path rewriting mechanism (how `/communication-socket/` rewrites to `/socket.io/` on backend)
- Added proper WebSocket headers: `Upgrade`, `Connection`, `proxy_http_version 1.1`
- Configured CORS headers for Socket.IO through API Gateway
- Updated docker-compose dependencies and environment variables for `COMMUNICATION_SERVICE_URL`

# Action Taken:
- [X] Accepted as-is
- [ ] Modified
- [ ] Rejected

# Author Notes:
- Validated that the updated code is working by testing with 2 users and verifying that both users are using the api-gateway to connect to the Socket.IO server 
- Validated that the server is able to exchange offers/calls, allowing both users to communicate with each other

---

## Entry 54

# Date/Time:
2025-10-29 11:00

# Tool:
Claude Sonnet 4.5

# Prompt/Command:
Request to change the Socket.IO route in nginx config from /socket.io/ to /communication-socket/ for better readability and clarity

# Output Summary:
- Updated nginx location block from `location /socket.io/` to `location /communication-socket/`
- Added `path: '/communication-socket/'` for the frontend Socket.IO client configuration

# Action Taken:
- [X] Accepted as-is
- [ ] Modified
- [ ] Rejected

# Author Notes:
- Similar to entry 50, validated that the updated code is working by testing with 2 users and verifying that both users are using the api-gateway to connect to the Socket.IO server 
- Validated that the server is able to exchange offers/calls, allowing both users to communicate with each other