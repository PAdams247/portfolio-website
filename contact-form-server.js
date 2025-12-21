const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Rate limiting to prevent spam
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: 'Too many form submissions, please try again later.'
});

app.use('/api/contact', limiter);

// Email configuration
const transporter = nodemailer.createTransporter({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'your-email@gmail.com',
    pass: process.env.EMAIL_PASS || 'your-app-password'
  }
});

// Contact form endpoint
app.post('/api/contact', async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      company,
      projectType,
      budget,
      timeline,
      message,
      features
    } = req.body;

    // Validate required fields
    if (!name || !email || !projectType || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please fill in all required fields.'
      });
    }

    // Create email content
    const emailContent = `
      <h2>New Website Design Inquiry</h2>
      
      <h3>Contact Information:</h3>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
      <p><strong>Company:</strong> ${company || 'Not provided'}</p>
      
      <h3>Project Details:</h3>
      <p><strong>Project Type:</strong> ${projectType}</p>
      <p><strong>Budget Range:</strong> ${budget || 'Not specified'}</p>
      <p><strong>Timeline:</strong> ${timeline || 'Not specified'}</p>
      
      <h3>Project Description:</h3>
      <p>${message}</p>
      
      ${features && features.length > 0 ? `
      <h3>Desired Features:</h3>
      <ul>
        ${features.map(feature => `<li>${feature}</li>`).join('')}
      </ul>
      ` : ''}
      
      <hr>
      <p><em>This inquiry was submitted through your portfolio website contact form.</em></p>
    `;

    // Email to you (the business owner)
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: 'padams247@gmail.com',
      subject: `New Website Design Inquiry from ${name}`,
      html: emailContent,
      replyTo: email
    };

    // Auto-reply to the client
    const autoReplyOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Thank you for your website design inquiry',
      html: `
        <h2>Thank you for your inquiry, ${name}!</h2>
        
        <p>I've received your website design inquiry and will get back to you within 24 hours with a detailed proposal.</p>
        
        <h3>What happens next:</h3>
        <ul>
          <li>I'll review your project requirements carefully</li>
          <li>Prepare a custom proposal tailored to your needs</li>
          <li>Schedule a consultation call if needed</li>
          <li>Send you a detailed timeline and quote</li>
        </ul>
        
        <p>In the meantime, feel free to check out my portfolio and recent work examples.</p>
        
        <p>Best regards,<br>
        Your Name<br>
        Web Design & Development Services</p>
        
        <hr>
        <p><em>This is an automated response. Please don't reply to this email - I'll contact you directly from my personal email address.</em></p>
      `
    };

    // Send both emails
    await transporter.sendMail(mailOptions);
    await transporter.sendMail(autoReplyOptions);

    res.json({
      success: true,
      message: 'Your inquiry has been sent successfully! I\'ll get back to you within 24 hours.'
    });

  } catch (error) {
    console.error('Email sending error:', error);
    res.status(500).json({
      success: false,
      message: 'There was an error sending your message. Please try again or contact me directly.'
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Contact form API is running' });
});

app.listen(PORT, () => {
  console.log(`Contact form server running on port ${PORT}`);
});

module.exports = app;