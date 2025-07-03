# FormMail.pl Setup Guide for Your Website

## 📧 Overview
Your formmail.pl script is a secure Perl CGI script that will handle form submissions from your React website. This is much more secure than using Gmail passwords!

## 🔧 Required Modifications to formmail.pl

### 1. Update Email Configuration
Find these lines in your formmail.pl and modify them:

```perl
# Change this line (around line 50):
@allow_mail_to = ('info@inlandempireland.com');

# TO:
@allow_mail_to = ('padams247@gmail.com', 'info@inlandempireland.com');

# Update postmaster if needed (around line 45):
$postmaster = 'formmail@inlandempireland.com';
# OR change to:
$postmaster = 'noreply@inlandempireland.com';
```

### 2. Update Allowed Referrers
Find the @referers array and add your domain:

```perl
# Around line 60:
@referers = ('inlandempireland.com', 'www.inlandempireland.com', 'localhost');
```

### 3. Enable Debugging (temporarily)
For testing, set debugging to 1:

```perl
# Around line 30:
$DEBUGGING = 1;
```

## 🚀 Server Setup Steps

### Step 1: Upload formmail.pl
1. Upload `formmail.pl` to your server's `cgi-bin` directory
2. Set execute permissions: `chmod 755 formmail.pl`
3. Ensure the path is accessible at: `https://inlandempireland.com/cgi-bin/formmail.pl`

### Step 2: Test the Script
Create a simple HTML test file to verify the script works:

```html
<!DOCTYPE html>
<html>
<head>
    <title>FormMail Test</title>
</head>
<body>
    <form action="/cgi-bin/formmail.pl" method="POST">
        <input type="hidden" name="recipient" value="padams247@gmail.com">
        <input type="hidden" name="subject" value="Test Form Submission">
        <input type="text" name="realname" placeholder="Your Name" required>
        <input type="email" name="email" placeholder="Your Email" required>
        <textarea name="message" placeholder="Your Message" required></textarea>
        <button type="submit">Send Test</button>
    </form>
</body>
</html>
```

### Step 3: Update React Form
The React form is already configured to work with your Perl script. It sends these fields:

- `recipient`: padams247@gmail.com
- `subject`: Website Design Inquiry from [Name]
- `realname`: User's name
- `email`: User's email
- `phone`: User's phone
- `project_type`: Selected project type
- `budget`: Selected budget range
- `timeline`: Selected timeline
- `message`: Project description
- `features`: Selected features (comma-separated)

## 🔍 Troubleshooting

### Common Issues:

1. **500 Internal Server Error**
   - Check file permissions (should be 755)
   - Verify Perl path in first line of script
   - Check server error logs

2. **Form Not Submitting**
   - Verify the script URL is correct
   - Check that your domain is in @referers array
   - Ensure recipient email is in @allow_mail_to array

3. **Not Receiving Emails**
   - Check spam folder
   - Verify server can send emails (test with simple mail command)
   - Check that sendmail is configured on server

### Testing Commands:
```bash
# Test if Perl is working:
perl -v

# Test script syntax:
perl -c formmail.pl

# Check permissions:
ls -la formmail.pl
```

## 📝 Email Template
The emails you receive will look like this:

```
Subject: Website Design Inquiry from [Name]
From: formmail@inlandempireland.com
Reply-To: [User's Email]

Name: [User's Name]
Email: [User's Email]
Phone: [User's Phone]
Project Type: [Selected Type]
Budget: [Selected Budget]
Timeline: [Selected Timeline]
Features: [Selected Features]

Message:
[User's Project Description]
```

## 🔒 Security Notes
- Never put email passwords in code
- The formmail.pl script includes built-in security features
- Always keep the @referers and @allow_mail_to arrays restrictive
- Turn off debugging ($DEBUGGING = 0) in production

## 📞 Next Steps
1. Upload and configure formmail.pl on your server
2. Test with the simple HTML form first
3. Once working, your React form should work automatically
4. Turn off debugging once everything is working
5. Monitor your email for form submissions!