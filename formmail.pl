#!/usr/bin/perl

# FormMail.pl - Secure form-to-email script
# Configured for padams247
# Updated to send emails to padams247@gmail.com

use strict;
use warnings;
use CGI qw(:standard);
use CGI::Carp qw(fatalsToBrowser);

# Configuration Variables
my $DEBUGGING = 0;  # Set to 1 for testing, 0 for production
my $postmaster = 'formmail@inlandempireland.com';
my $mailprog = '/usr/sbin/sendmail';

# Security: Only allow emails to these addresses
my @allow_mail_to = (
    'padams247@gmail.com',
    'info@inlandempireland.com'
);

# Security: Only allow forms from these domains
my @referers = (
    'inlandempireland.com',
    'www.inlandempireland.com',
    'localhost',
    '127.0.0.1'
);

# Other configuration
my $max_recipients = 5;
my $mailprog_args = '-t';
my $date_fmt = '%A, %B %d, %Y at %H:%M:%S';

# Main program starts here
my $q = CGI->new;

# Print content type
print $q->header('text/html');

# Get form data
my %form_data;
for my $param ($q->param) {
    $form_data{$param} = $q->param($param);
}

# Debug output if enabled
if ($DEBUGGING) {
    print "<h2>Debug Information</h2>\n";
    print "<p><strong>Referrer:</strong> " . ($ENV{'HTTP_REFERER'} || 'None') . "</p>\n";
    print "<p><strong>Form Data:</strong></p>\n";
    print "<ul>\n";
    for my $key (sort keys %form_data) {
        print "<li><strong>$key:</strong> $form_data{$key}</li>\n";
    }
    print "</ul>\n";
}

# Security check: Verify referrer
if (!$DEBUGGING && !check_referrer()) {
    print_error("Access denied. Invalid referrer.");
    exit;
}

# Get recipient email
my $recipient = $form_data{'recipient'} || $allow_mail_to[0];

# Security check: Verify recipient is allowed
if (!grep { $_ eq $recipient } @allow_mail_to) {
    print_error("Invalid recipient email address.");
    exit;
}

# Get other required fields
my $subject = $form_data{'subject'} || 'Website Contact Form Submission';
my $realname = $form_data{'realname'} || $form_data{'name'} || 'Anonymous';
my $email = $form_data{'email'} || '';

# Validate email address
if ($email && !is_valid_email($email)) {
    print_error("Invalid email address format.");
    exit;
}

# Send the email
if (send_email()) {
    print_success();
} else {
    print_error("Failed to send email. Please try again.");
}

# Subroutines

sub check_referrer {
    my $referrer = $ENV{'HTTP_REFERER'} || '';
    return 1 if !$referrer;  # Allow empty referrer for testing
    
    for my $allowed (@referers) {
        return 1 if $referrer =~ /\Q$allowed\E/i;
    }
    return 0;
}

sub is_valid_email {
    my $email = shift;
    return $email =~ /^[^\@]+\@[^\@]+\.[^\@]+$/;
}

sub send_email {
    # Prepare email content
    my $message_body = build_message();
    
    # Open sendmail
    if (!open(MAIL, "|$mailprog $mailprog_args")) {
        return 0;
    }
    
    # Email headers
    print MAIL "To: $recipient\n";
    print MAIL "From: $postmaster\n";
    print MAIL "Reply-To: $email\n" if $email;
    print MAIL "Subject: $subject\n";
    print MAIL "Content-Type: text/plain; charset=UTF-8\n";
    print MAIL "\n";
    
    # Email body
    print MAIL $message_body;
    
    # Close sendmail
    close(MAIL);
    
    return ($? == 0);
}

sub build_message {
    my $message = "";
    my $timestamp = localtime();
    
    $message .= "Website Contact Form Submission\n";
    $message .= "Submitted on: $timestamp\n";
    $message .= "=" x 50 . "\n\n";
    
    # Contact Information
    $message .= "CONTACT INFORMATION:\n";
    $message .= "-" x 20 . "\n";
    $message .= "Name: " . ($form_data{'realname'} || $form_data{'name'} || 'Not provided') . "\n";
    $message .= "Email: " . ($form_data{'email'} || 'Not provided') . "\n";
    $message .= "Phone: " . ($form_data{'phone'} || 'Not provided') . "\n";
    $message .= "\n";
    
    # Project Details
    $message .= "PROJECT DETAILS:\n";
    $message .= "-" x 15 . "\n";
    $message .= "Project Type: " . ($form_data{'project_type'} || 'Not specified') . "\n";
    $message .= "Budget Range: " . ($form_data{'budget'} || 'Not specified') . "\n";
    $message .= "Timeline: " . ($form_data{'timeline'} || 'Not specified') . "\n";
    $message .= "Features: " . ($form_data{'features'} || 'None selected') . "\n";
    $message .= "\n";
    
    # Project Description
    $message .= "PROJECT DESCRIPTION:\n";
    $message .= "-" x 20 . "\n";
    $message .= ($form_data{'message'} || $form_data{'description'} || 'No description provided') . "\n";
    $message .= "\n";
    
    # Additional form fields
    $message .= "ADDITIONAL INFORMATION:\n";
    $message .= "-" x 25 . "\n";
    for my $key (sort keys %form_data) {
        next if $key =~ /^(recipient|subject|realname|name|email|phone|project_type|budget|timeline|features|message|description)$/;
        $message .= "$key: $form_data{$key}\n";
    }
    
    return $message;
}

sub print_success {
    print <<HTML;
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Message Sent Successfully</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 600px;
            margin: 50px auto;
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            text-align: center;
        }
        .success-container {
            background: rgba(255, 255, 255, 0.1);
            padding: 40px;
            border-radius: 15px;
            backdrop-filter: blur(10px);
        }
        h1 { color: #4CAF50; margin-bottom: 20px; }
        .checkmark {
            font-size: 60px;
            color: #4CAF50;
            margin-bottom: 20px;
        }
        a {
            color: #4CAF50;
            text-decoration: none;
            font-weight: bold;
        }
        a:hover { text-decoration: underline; }
    </style>
</head>
<body>
    <div class="success-container">
        <div class="checkmark">✓</div>
        <h1>Message Sent Successfully!</h1>
        <p>Thank you for your inquiry. I'll get back to you within 24 hours with a detailed proposal.</p>
        <p><a href="javascript:history.back()">← Go Back</a></p>
    </div>
</body>
</html>
HTML
}

sub print_error {
    my $error_msg = shift;
    
    print <<HTML;
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Error</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 600px;
            margin: 50px auto;
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            text-align: center;
        }
        .error-container {
            background: rgba(255, 255, 255, 0.1);
            padding: 40px;
            border-radius: 15px;
            backdrop-filter: blur(10px);
        }
        h1 { color: #f44336; margin-bottom: 20px; }
        .error-icon {
            font-size: 60px;
            color: #f44336;
            margin-bottom: 20px;
        }
        a {
            color: #4CAF50;
            text-decoration: none;
            font-weight: bold;
        }
        a:hover { text-decoration: underline; }
    </style>
</head>
<body>
    <div class="error-container">
        <div class="error-icon">⚠</div>
        <h1>Error</h1>
        <p>$error_msg</p>
        <p>Please try again or contact me directly at <a href="mailto:padams247\@gmail.com">padams247\@gmail.com</a></p>
        <p><a href="javascript:history.back()">← Go Back</a></p>
    </div>
</body>
</html>
HTML
}

1;