import React, { useState, useEffect, useRef } from 'react';
import '../styles/WebDesignServices.css';

interface FormData {
  name: string;
  email: string;
  phone: string;
  projectType: string;
  budget: string;
  timeline: string;
  description: string;
  features: string[];
}

const WebDesignServices: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    projectType: '',
    budget: '',
    timeline: '',
    description: '',
    features: []
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [scrollPhysics, setScrollPhysics] = useState({ x: 0, y: 0 });
  const lastScrollY = useRef(0);
  const scrollVelocity = useRef(0);
  const animationFrame = useRef<number>();

  const modernFeatures = [
    { icon: '🚀', title: 'Lightning Fast', description: 'Optimized for speed and performance' },
    { icon: '📱', title: 'Mobile First', description: 'Perfect on all devices and screen sizes' },
    { icon: '🎨', title: 'Modern Design', description: 'Clean, professional, and eye-catching' },
    { icon: '🔍', title: 'SEO Optimized', description: 'Built to rank high in search results' },
    { icon: '🛡️', title: 'Secure & Reliable', description: 'Protected against threats and downtime' },
    { icon: '⚡', title: 'Easy to Update', description: 'Simple content management system' }
  ];

  const trendingTechnologies = [
    'React.js', 'TypeScript', 'Node.js', 'Next.js', 'Tailwind CSS', 
    'MongoDB', 'PostgreSQL', 'AWS', 'Vercel', 'Stripe', 'Firebase'
  ];

  const servicePackages = [
    {
      name: 'Starter Website',
      price: '$299',
      popular: false,
      features: ['Up to 5 pages', 'Responsive design', 'Basic SEO setup', 'Contact form', '30 days support']
    },
    {
      name: 'Professional Website',
      price: '$599',
      popular: false,
      features: ['Up to 10 pages', 'Custom design', 'Advanced SEO', 'CMS integration', 'E-commerce ready', '60 days support']
    },
    {
      name: 'Enterprise Solution',
      price: '$1299',
      popular: false,
      features: ['Unlimited pages', 'Custom functionality', 'Database integration', 'API development', 'Performance optimization', '90 days support']
    }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
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

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const deltaY = currentScrollY - lastScrollY.current;

      scrollVelocity.current = deltaY * 1.2;
      lastScrollY.current = currentScrollY;

      const maxDisplacement = 60;
      const targetY = Math.max(-maxDisplacement, Math.min(maxDisplacement, -scrollVelocity.current));
      const targetX = Math.max(-maxDisplacement, Math.min(maxDisplacement, scrollVelocity.current * 0.3));

      setScrollPhysics({ x: targetX, y: targetY });
    };

    const smoothReturn = () => {
      setScrollPhysics(prev => ({
        x: prev.x * 0.92,
        y: prev.y * 0.92
      }));

      scrollVelocity.current *= 0.85;

      if (Math.abs(scrollPhysics.x) > 0.1 || Math.abs(scrollPhysics.y) > 0.1) {
        animationFrame.current = requestAnimationFrame(smoothReturn);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    animationFrame.current = requestAnimationFrame(smoothReturn);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
      }
    };
  }, [scrollPhysics.x, scrollPhysics.y]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Create form data for submission to Perl script
      const formDataToSubmit = new FormData();
      formDataToSubmit.append('recipient', 'padams247@gmail.com');
      formDataToSubmit.append('subject', `Website Design Inquiry from ${formData.name}`);
      formDataToSubmit.append('realname', formData.name);
      formDataToSubmit.append('email', formData.email);
      formDataToSubmit.append('phone', formData.phone);
      formDataToSubmit.append('project_type', formData.projectType);
      formDataToSubmit.append('budget', formData.budget);
      formDataToSubmit.append('timeline', formData.timeline);
      formDataToSubmit.append('message', formData.description);
      formDataToSubmit.append('features', formData.features.join(', '));

      // Submit to your Perl script (you'll need to upload it to your server)
      const response = await fetch('/cgi-bin/formmail.pl', {
        method: 'POST',
        body: formDataToSubmit,
      });

      if (response.ok) {
        setIsSubmitted(true);
        
        // Reset form after 5 seconds
        setTimeout(() => {
          setIsSubmitted(false);
          setFormData({
            name: '',
            email: '',
            phone: '',
            projectType: '',
            budget: '',
            timeline: '',
            description: '',
            features: []
          });
        }, 5000);
      } else {
        throw new Error('Failed to send message');
      }

    } catch (error) {
      console.error('Form submission error:', error);
      alert('There was an error sending your message. Please try again or contact me directly at padams247@gmail.com');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="services-container">
        <div className="success-message">
          <h2>Thank You!</h2>
          <p>Your message has been sent successfully. I'll get back to you within 24 hours with a detailed proposal.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="services-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          {/* Floating Programming Language Icons */}
          <div className="floating-tech-icons" style={{
            transform: `translate(${scrollPhysics.x}px, ${scrollPhysics.y}px)`,
            transition: 'transform 0.1s ease-out'
          }}>
            <div className="tech-icon html-icon">
              <div className="vscode-icon html-file">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <rect width="24" height="24" rx="2" fill="#E34F26"/>
                  <path d="M5.5 7L6.5 17L12 19L17.5 17L18.5 7H5.5Z" fill="white"/>
                  <path d="M12 8V18L16.5 16.5L17.2 8H12Z" fill="#EBEBEB"/>
                  <path d="M12 11H9.5L9.3 9H12V11Z" fill="#EBEBEB"/>
                  <path d="M12 14H10L10.2 16L12 16.5V14Z" fill="#EBEBEB"/>
                </svg>
              </div>
              <span className="icon-label">HTML</span>
            </div>
            <div className="tech-icon css-icon">
              <div className="vscode-icon css-file">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <rect width="24" height="24" rx="2" fill="#1572B6"/>
                  <path d="M5.5 7L6.5 17L12 19L17.5 17L18.5 7H5.5Z" fill="white"/>
                  <path d="M12 8V18L16.5 16.5L17.2 8H12Z" fill="#EBEBEB"/>
                  <path d="M12 11H14.5L14.3 13H12V15L14 15.5L14.2 13.5H15.5L15 17L12 18V16L10 15.5L9.8 13.5H11V11H9.5L9.3 9H12V8Z" fill="#EBEBEB"/>
                </svg>
              </div>
              <span className="icon-label">CSS</span>
            </div>
            <div className="tech-icon js-icon">
              <div className="vscode-icon js-file">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <rect width="24" height="24" rx="2" fill="#F7DF1E"/>
                  <path d="M16 14C16 15.1 15.1 16 14 16C12.9 16 12 15.1 12 14V10H14V14Z" fill="black"/>
                  <path d="M10 16C8.9 16 8 15.1 8 14H10C10 14.6 10.4 15 11 15C11.6 15 12 14.6 12 14C12 13.4 11.6 13 11 13H9C7.9 13 7 12.1 7 11C7 9.9 7.9 9 9 9H11C12.1 9 13 9.9 13 11H11C11 10.4 10.6 10 10 10C9.4 10 9 10.4 9 11C9 11.6 9.4 12 10 12H12C13.1 12 14 12.9 14 14C14 15.1 13.1 16 12 16H10Z" fill="black"/>
                </svg>
              </div>
              <span className="icon-label">JavaScript</span>
            </div>
            <div className="tech-icon react-icon">
              <div className="vscode-icon react-file">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <rect width="24" height="24" rx="2" fill="#61DAFB"/>
                  <circle cx="12" cy="12" r="2" fill="#282C34"/>
                  <path d="M12 8C16 8 19 10 19 12C19 14 16 16 12 16C8 16 5 14 5 12C5 10 8 8 12 8Z" stroke="#282C34" strokeWidth="1" fill="none"/>
                  <path d="M8.5 10C10.5 6 13.5 4 15.5 6C17.5 8 16.5 12 14.5 16C12.5 20 9.5 22 7.5 20C5.5 18 6.5 14 8.5 10Z" stroke="#282C34" strokeWidth="1" fill="none"/>
                  <path d="M8.5 14C6.5 10 5.5 6 7.5 4C9.5 2 12.5 4 14.5 8C16.5 12 17.5 16 15.5 18C13.5 20 10.5 18 8.5 14Z" stroke="#282C34" strokeWidth="1" fill="none"/>
                </svg>
              </div>
              <span className="icon-label">React</span>
            </div>
            <div className="tech-icon node-icon">
              <div className="vscode-icon node-file">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <rect width="24" height="24" rx="2" fill="#339933"/>
                  <path d="M12 4L18 8V16L12 20L6 16V8L12 4Z" fill="white"/>
                  <path d="M12 4V20L18 16V8L12 4Z" fill="#CCCCCC"/>
                </svg>
              </div>
              <span className="icon-label">Node.js</span>
            </div>
            <div className="tech-icon python-icon">
              <div className="vscode-icon python-file">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <rect width="24" height="24" rx="2" fill="#3776AB"/>
                  <path d="M8 6C8 4.9 8.9 4 10 4H14C15.1 4 16 4.9 16 6V8H8V6Z" fill="#FFD43B"/>
                  <path d="M8 16V18C8 19.1 8.9 20 10 20H14C15.1 20 16 19.1 16 18V16H8Z" fill="#3776AB"/>
                  <circle cx="10" cy="6" r="1" fill="#3776AB"/>
                  <circle cx="14" cy="18" r="1" fill="#FFD43B"/>
                </svg>
              </div>
              <span className="icon-label">Python</span>
            </div>
            <div className="tech-icon ts-icon">
              <div className="vscode-icon ts-file">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <rect width="24" height="24" rx="2" fill="#3178C6"/>
                  <text x="12" y="16" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">TS</text>
                </svg>
              </div>
              <span className="icon-label">TypeScript</span>
            </div>
          </div>
          
          <h1>Professional Website Design Services</h1>
          <p>Transform your business with a stunning, modern website that converts visitors into customers</p>
          <div className="hero-stats">
            <div className="stat">
              <span className="stat-number">5+</span>
              <span className="stat-label">Websites Built</span>
            </div>
            <div className="stat">
              <span className="stat-number">4.9★</span>
              <span className="stat-label">Client Rating</span>
            </div>
            <div className="stat">
              <span className="stat-number">24hr</span>
              <span className="stat-label">Response Time</span>
            </div>
          </div>
        </div>
      </section>

      {/* Modern Features */}
      <section className="features-section">
        <h2>Why Choose My Web Design Services?</h2>
        <div className="features-grid">
          {modernFeatures.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Trending Technologies */}
      <section className="tech-section">
        <h2>Built with Modern Technologies</h2>
        <div className="tech-grid">
          {trendingTechnologies.map((tech, index) => (
            <div key={index} className="tech-badge">
              {tech}
            </div>
          ))}
        </div>
      </section>

      {/* Service Packages */}
      <section className="packages-section">
        <h2>Service Packages</h2>
        <div className="packages-grid">
          {servicePackages.map((pkg, index) => (
            <div key={index} className={`package-card ${pkg.popular ? 'popular' : ''}`}>
              {pkg.popular && <div className="popular-badge">Most Popular</div>}
              <h3>{pkg.name}</h3>
              <div className="package-price">{pkg.price}</div>
              <ul className="package-features">
                {pkg.features.map((feature, fIndex) => (
                  <li key={fIndex}>{feature}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Form */}
      <section className="contact-section">
        <div className="contact-content">
          <div className="contact-info">
            <h2>Let's Discuss Your Project</h2>
            <div className="contact-details">
              <h3>Ready to Get Started?</h3>
              <p>Fill out the form and I'll get back to you within 24 hours with a detailed proposal.</p>
              <div className="contact-benefits">
                <div className="benefit">✅ Free consultation</div>
                <div className="benefit">✅ Custom proposal</div>
                <div className="benefit">✅ No obligation</div>
              </div>
            </div>
          </div>

          <form className="contact-form" onSubmit={handleSubmit}>
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
                />
              </div>
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
                  <option value="business-website">Business Website</option>
                  <option value="e-commerce">E-commerce Store</option>
                  <option value="portfolio">Portfolio Website</option>
                  <option value="blog">Blog/Content Site</option>
                  <option value="web-app">Web Application</option>
                  <option value="redesign">Website Redesign</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="budget">Budget Range</label>
                <select
                  id="budget"
                  name="budget"
                  value={formData.budget}
                  onChange={handleInputChange}
                >
                  <option value="">Select budget range</option>
                  <option value="under-500">Under $500</option>
                  <option value="500-1000">$500 - $1,000</option>
                  <option value="1000-2500">$1,000 - $2,500</option>
                  <option value="2500-5000">$2,500 - $5,000</option>
                  <option value="5000-plus">$5,000+</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="timeline">Timeline</label>
                <select
                  id="timeline"
                  name="timeline"
                  value={formData.timeline}
                  onChange={handleInputChange}
                >
                  <option value="">Select timeline</option>
                  <option value="asap">ASAP</option>
                  <option value="1-2-weeks">1-2 weeks</option>
                  <option value="1-month">1 month</option>
                  <option value="2-3-months">2-3 months</option>
                  <option value="flexible">Flexible</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="description">Project Description *</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Please describe your project requirements, goals, and any specific features you need..."
                rows={4}
                required
              ></textarea>
            </div>

            <div className="form-group">
              <label>Desired Features (select all that apply)</label>
              <div className="features-checkboxes">
                {['Responsive Design', 'E-commerce', 'Blog/CMS', 'Contact Forms', 'Social Media Integration', 'SEO Optimization', 'Analytics Setup', 'Payment Processing'].map((feature) => (
                  <label key={feature} className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={formData.features.includes(feature)}
                      onChange={() => handleFeatureChange(feature)}
                    />
                    {feature}
                  </label>
                ))}
              </div>
            </div>

            <button type="submit" className="submit-button" disabled={isSubmitting}>
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default WebDesignServices;