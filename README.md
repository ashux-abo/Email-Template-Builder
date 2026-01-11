# Email Sender

A simple student project built with **Next.js** that allows users to send emails using a web interface. This project was made to practice full-stack development, API routes, and email handling.

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
git clone <your-repo-link>
```

2. Install dependencies

```bash
npm install
```

3. Create a `.env` file and add the required environment variables

```env
MONGODB_URI=your_mongodb_uri
EMAIL_USER=your_email
EMAIL_PASS=your_email_password
JWT_SECRET=your_secret_key
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
```

## Notes

* This project is for learning purposes only
* Security features are minimal

## Future Improvements

* Better validation
* Improved UI
* Email templates
* Error handling

## Author

John Ashley Dulay

## License

This project is for educational use.
