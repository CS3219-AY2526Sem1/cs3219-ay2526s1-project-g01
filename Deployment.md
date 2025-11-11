# PeerPrep Deployment Guide

This guide provides instructions for deploying the PeerPrep application to Google Cloud Platform (GCP).

## Prerequisites

Before deploying PeerPrep, ensure you have the following services and accounts set up:

1. **MongoDB Cloud** (MongoDB Atlas) - For user service database
2. **PostgreSQL Cloud Service** (e.g., Supabase) - For question service database
3. **Redis Cloud Service** (e.g., Upstash) - For matching and collaboration services
4. **Gemini API Key** - For AI service functionality
5. **TURN Server** - For WebRTC video chat (e.g., Metered, Twilio)
6. **Google Cloud Platform (GCP) Account** - For hosting services
7. **Docker** - For containerization
8. **Domain Name** (optional) - For custom domain configuration

## Infrastructure Setup

### General Deployment Instructions
1. Go to Google CLoud Console and create a new project for PeerPrep.
2. Navigate to Cloud Run in the GCP console and select Services.
3. Select "Deploy Container" then choose "Continuously deploy from a repository (source or function)".
4. Choose "Set up with Cloud Build". You may need to connect your GitHub repository if you haven't done so.
5. Select the repository and branch where your PeerPrep code is hosted.
6. For build type , select "Dockerfile" and specify the path to the Dockerfile for each service (e.g., `user-service/Dockerfile`) and save.
7. Configure the service settings:
   - Set the service name (e.g., `user-service`).
   - Choose the region closest to your users.
8. Go to "Variables & Secrets" tab and add the necessary environment variables for each service as per the `.env` files.
9. Set the memory and CPU allocation based on the expected load (optional).
11. Click "Create" to deploy the service.

### Additional Instructions for Frontend (after pressing deploy container)
1. As Next.js frontend is built on compile time, environment variables need to be set during build time.
2. Update the .env.production.no-sensitive file with the appropriate environment variables for production.(after u get the links for the services deployed on GCP)
3. Go to `https://console.cloud.google.com/cloud-build` and select "Triggers".
4. Change the in line CLoudbuild configurations to this
```
steps:
  - name: 'gcr.io/google.com/cloudsdktool/cloud-sdk:slim'
    args:
      - '-lc'
      - >
        set -euo pipefail


        if [ ! -f frontend/.env.production.no-sensitive ]; then
          echo "❌ Missing frontend/.env.production.no-sensitive. Create it with your NEXT_PUBLIC_* vars." >&2
          exit 1
        fi


        cp frontend/.env.production.no-sensitive frontend/.env.local

        echo "✅ Copied frontend/.env.production.no-sensitive ->
        frontend/.env.local" fi
    id: PrepareEnv
    entrypoint: bash
  - name: gcr.io/cloud-builders/docker
    args:
      - build
      - '--no-cache'
      - '-t'
      - >-
        $_AR_HOSTNAME/$_AR_PROJECT_ID/$_AR_REPOSITORY/$REPO_NAME/$_SERVICE_NAME:$COMMIT_SHA
      - frontend
      - '-f'
      - frontend/Dockerfile
    id: Build
  - name: gcr.io/cloud-builders/docker
    args:
      - push
      - >-
        $_AR_HOSTNAME/$_AR_PROJECT_ID/$_AR_REPOSITORY/$REPO_NAME/$_SERVICE_NAME:$COMMIT_SHA
    id: Push
  - name: 'gcr.io/google.com/cloudsdktool/cloud-sdk:slim'
    args:
      - run
      - services
      - update
      - $_SERVICE_NAME
      - '--platform=$_PLATFORM'
      - >-
        --image=$_AR_HOSTNAME/$_AR_PROJECT_ID/$_AR_REPOSITORY/$REPO_NAME/$_SERVICE_NAME:$COMMIT_SHA
      - >-
        --labels=managed-by=gcp-cloud-build-deploy-cloud-run,commit-sha=$COMMIT_SHA,gcb-build-id=$BUILD_ID,gcb-trigger-id=$_TRIGGER_ID
      - '--region=$_DEPLOY_REGION'
      - '--quiet'
    id: Deploy
    entrypoint: gcloud
images:
  - >-
    $_AR_HOSTNAME/$_AR_PROJECT_ID/$_AR_REPOSITORY/$REPO_NAME/$_SERVICE_NAME:$COMMIT_SHA
options:
  substitutionOption: ALLOW_LOOSE
  logging: CLOUD_LOGGING_ONLY
substitutions:
  _AR_REPOSITORY: cloud-run-source-d
```
