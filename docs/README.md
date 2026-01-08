# GitHub Pages Setup for Privacy Policy

This folder contains the privacy policy page for LogMyLog.

## Setup Instructions

### Option 1: Using GitHub Pages with Custom Domain (Recommended)

If you have `logmylog.app` domain:

1. Go to your GitHub repository settings
2. Navigate to **Pages** section
3. Set source to **Deploy from a branch**
4. Select branch: `main` and folder: `/docs`
5. Configure your custom domain `logmylog.app` in the Pages settings
6. The privacy policy will be available at: `https://logmylog.app/privacy-policy.html`

### Option 2: Using GitHub Pages Default Domain

If you don't have a custom domain:

1. Go to your GitHub repository settings
2. Navigate to **Pages** section
3. Set source to **Deploy from a branch**
4. Select branch: `main` and folder: `/docs`
5. The privacy policy will be available at: `https://[username].github.io/[repo-name]/privacy-policy.html`
6. Update `app.json` to use this URL instead

### Option 3: Manual Deployment

The GitHub Actions workflow (`.github/workflows/deploy-pages.yml`) will automatically deploy when you push changes to the `docs/privacy-policy.html` file.

## Updating the Privacy Policy

Simply edit `docs/privacy-policy.html` and push to the `main` branch. The GitHub Actions workflow will automatically deploy the changes.

## Testing Locally

You can test the privacy policy page locally by opening `docs/privacy-policy.html` in a web browser.

