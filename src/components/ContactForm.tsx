import { useState } from 'react';
import '../styles/ContactForm.css';

interface ContactFormProps {
  title?: string;
  subtitle?: string;
  showProjectType?: boolean;
  showBudget?: boolean;
  showTimeline?: boolean;
  showFeatures?: boolean;
  onSubmit?: (data: FormData) => void | Promise<void>;
}

interface FormData {
  name: string;
  email: string;
  phone: string;
  company: string;
  projectType: string;
  budget: string;
  timeline: string;
  message: string;
  features: string[];
}

const ContactForm: React.FC<ContactFormProps> = ({
  title = "Get In Touch",
  subtitle = "Let's discuss your project",
  showProjectType = true,
  showBudget = true,
  showTimeline = true,
  showFeatures = true,
  onSubmit
}) => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    company: '',
    projectType: '',
    budget: '',
    timeline: '',
    message: '',
    features: []
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const projectTypes = [
    'Website Design',
    'Web Development',
    'E-commerce Site',
    'Web Application',
    'Website Redesign',
    'Landing Page',
    'Software Engineering',
    'Code Project',
    'Other'
  ];

  const budgetRanges = [
    'Under $500',
    '$500 - $1,000',
    '$1,000 - $2,500',
    '$2,500 - $5,000',
    '$5,000 - $10,000',
    'Over $10,000'
  ];

  const timelineOptions = [
    'ASAP',
    '1-2 weeks',
    '1 month',
    '2-3 months',
    'Flexible'
  ];

  const availableFeatures = [
    'Responsive Design',
    'E-commerce',
    'Blog/CMS',
    'User Authentication',
    'Payment Integration',
    'API Integration',
    'Database',
    'Admin Panel',
    'SEO Optimization',
    'Analytics',
    'Social Media Integration',
    'Live Chat',
    'Multi-language',
    'Performance Optimization'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFeatureChange = (feature: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // If custom onSubmit handler is provided, use it
      if (onSubmit) {
        const result = onSubmit(formData);
        if (result instanceof Promise) {
          await result;
        }
      } else {
        // Default behavior - log to console and show success message
        console.log('Form submitted:', formData);

        // Here you would typically send to your backend API
        // await fetch('/api/contact', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(formData)
        // });
      }

      setIsSubmitted(true);

      // Reset form after 5 seconds
      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({
          name: '',
          email: '',
          phone: '',
          company: '',
          projectType: '',
          budget: '',
          timeline: '',
          message: '',
          features: []
        });
      }, 5000);

    } catch (error) {
      console.error('Form submission error:', error);
      alert('There was an error sending your message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contact-form-container">
      <div className="contact-form-header">
        <h2 className="contact-form-title">{title}</h2>
        <p className="contact-form-subtitle">{subtitle}</p>
      </div>

      {isSubmitted ? (
        <div className="success-message">
          <div className="success-icon">✅</div>
          <h3>Thank you for your inquiry!</h3>
          <p>I'll get back to you within 24 hours with a detailed response.</p>
          <div className="success-details">
            <p><strong>What happens next:</strong></p>
            <ul>
              <li>I'll review your project requirements</li>
              <li>Prepare a custom proposal for your needs</li>
              <li>Schedule a consultation call if needed</li>
              <li>Send you a detailed timeline and quote</li>
            </ul>
          </div>
        </div>
      ) : (
        <form className="contact-form" onSubmit={handleSubmit}>
          {/* Basic Information */}
          <div className="form-section">
            <h3 className="form-section-title">Contact Information</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">Full Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="Your full name"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="email">Email Address *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  placeholder="your@email.com"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="(555) 123-4567"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="company">Company/Organization</label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  placeholder="Your company name"
                />
              </div>
            </div>
          </div>

          {/* Project Details */}
          <div className="form-section">
            <h3 className="form-section-title">Project Details</h3>
            
            {showProjectType && (
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="projectType">Project Type *</label>
                  <select
                    id="projectType"
                    name="projectType"
                    value={formData.projectType}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select project type</option>
                    {projectTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                
                {showBudget && (
                  <div className="form-group">
                    <label htmlFor="budget">Budget Range</label>
                    <select
                      id="budget"
                      name="budget"
                      value={formData.budget}
                      onChange={handleInputChange}
                    >
                      <option value="">Select budget range</option>
                      {budgetRanges.map(range => (
                        <option key={range} value={range}>{range}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            )}

            {showTimeline && (
              <div className="form-group">
                <label htmlFor="timeline">Timeline</label>
                <select
                  id="timeline"
                  name="timeline"
                  value={formData.timeline}
                  onChange={handleInputChange}
                >
                  <option value="">Select timeline</option>
                  {timelineOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
            )}

            <div className="form-group">
              <label htmlFor="message">Project Description *</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                rows={5}
                required
                placeholder="Please describe your project requirements, goals, and any specific features you need..."
              />
            </div>
          </div>

          {/* Features */}
          {showFeatures && (
            <div className="form-section">
              <h3 className="form-section-title">Desired Features</h3>
              <p className="form-section-description">Select all features that apply to your project:</p>
              
              <div className="features-grid">
                {availableFeatures.map(feature => (
                  <label key={feature} className="feature-checkbox">
                    <input
                      type="checkbox"
                      checked={formData.features.includes(feature)}
                      onChange={() => handleFeatureChange(feature)}
                    />
                    <span className="checkmark"></span>
                    <span className="feature-label">{feature}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="form-submit">
            <button 
              type="submit" 
              className="submit-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner"></span>
                  Sending...
                </>
              ) : (
                'Send Project Inquiry'
              )}
            </button>
            
            <p className="form-note">
              * Required fields. I'll respond within 24 hours with a detailed proposal.
            </p>
          </div>
        </form>
      )}
    </div>
  );
};

export default ContactForm;