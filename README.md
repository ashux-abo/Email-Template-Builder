# Email Template Builder

A project built with **Next.js** that allows users to send emails using a web interface. This project was made to practice full-stack development, API routes, and email handling.

## Purpose

The main goal of this project is to understand how email sending works in a web application using server-side logic.

## Tech Stack

* Next.js (App Router)
* React
* TypeScript
* Nodemailer
* MongoDB + Mongoose
* Tailwind CSS

## Features

* Send emails using a form
* Server-side email handling
* User authentication
* Create and design custom email templates
* Send styled emails such as:
  * Invitation cards
  * Interview emails
  * Birthday invitations
* Clean and minimal UI

## Installation

1. Clone the repository

```bash
git clone https://github.com/ashux-abo/Email-Template-Builder.git
```

2. Install dependencies

```bash
npm install
```

3. Create a `.env` file and add the required environment variables

```env
# MongoDB Connection
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database

# Authentication
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
JWT_SECRET=your_jwt_secret

# NEXT_PUBLIC_APP_URL
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@example.com
SMTP_PASSWORD=your_email_password

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

4. Run the project

```bash
npm run dev
```

## Usage

* Open the app in the browser
* Fill in the email form
* Submit to send an email

## Folder Structure

```
/app
  /api
    /auth        → Authentication routes
    /email       → Email sending routes
  /dashboard    → User dashboard pages
  /templates    → Email template editor and preview
  /auth         → Login and register pages

/lib            → Database, email, and utility helpers
/models         → Mongoose models
/components     → Reusable UI components
/styles         → Global and component styles
/public         → Static assets
/utils          → Utility functions and helpers
```
