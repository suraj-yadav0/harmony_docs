# OCR API — Render Deployment

This project deploys the prebuilt `rpmlabweb/ocrmypdf-fastapi-lite` Docker image on Render and exposes OCR functionality through a REST API.

The architecture is:

Your Application → Render → FastAPI → OCRmyPDF → Extracted Text

---

## 1. Docker Image

This deployment uses the following Docker image:

`rpmlabweb/ocrmypdf-fastapi-lite:latest`

Docker Hub:

https://hub.docker.com/r/rpmlabweb/ocrmypdf-fastapi-lite

The image already contains:

- FastAPI
- Uvicorn
- OCRmyPDF
- Tesseract OCR
- Required OCR dependencies

You do not need to create your own Dockerfile.

---

# 2. Deploy on Render

## Step 1 — Open Render

Go to:

https://dashboard.render.com/

Log in to your Render account.

---

## Step 2 — Create a Web Service

From the Render dashboard:

**New + → Web Service**

Choose the option to deploy an existing Docker image.

---

## Step 3 — Enter the Docker Image

Use:

```text
docker.io/rpmlabweb/ocrmypdf-fastapi-lite:latest