# N2H-Backend

This repository contains the backend API for the N2H Enterprises ecommerce project.

## Deploying to Render

When deploying this Node.js backend to Render, set the following build and start commands in the Render dashboard:

- Build command: npm run build
- Start command: npm run start

Notes:
- The `build` script is a no-op because this project doesn't require a build step. Render expects a build command; using `npm run build` avoids invoking `nodemon` during build.
- For local development, continue using `npm run dev` (which uses `nodemon`). `nodemon` is a dev dependency and is not required on Render.
# N2H-Backend
