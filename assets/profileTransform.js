export const profileTransform = `
(function() {
  // Add custom styles
  const style = document.createElement('style');
  style.textContent = \`
    /* Profile Page Styles */
    body {
      background: #f8f9ff !important;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    }

    /* Profile Card Styles */
    .card {
      background: white !important;
      border-radius: 16px !important;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05) !important;
      padding: 24px !important;
      margin: 16px !important;
      border: none !important;
    }

    /* Profile Section Headers */
    h4, .section-title {
      color: #1a237e !important;
      font-size: 24px !important;
      font-weight: 600 !important;
      margin-bottom: 24px !important;
      position: relative !important;
    }

    h4:after, .section-title:after {
      content: '' !important;
      position: absolute !important;
      bottom: -8px !important;
      left: 0 !important;
      width: 40px !important;
      height: 3px !important;
      background: #1a237e !important;
      border-radius: 2px !important;
    }

    /* Profile Grid Items */
    .profile-grid {
      display: grid !important;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)) !important;
      gap: 20px !important;
      margin-top: 20px !important;
    }

    /* Profile Buttons */
    .profile-btn {
      background: white !important;
      border: none !important;
      border-radius: 12px !important;
      padding: 20px !important;
      width: 100% !important;
      text-align: left !important;
      display: flex !important;
      align-items: center !important;
      gap: 16px !important;
      transition: all 0.3s ease !important;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05) !important;
      position: relative !important;
      overflow: hidden !important;
    }

    .profile-btn:before {
      content: '' !important;
      position: absolute !important;
      left: 0 !important;
      top: 0 !important;
      height: 100% !important;
      width: 4px !important;
      background: #1a237e !important;
      border-radius: 0 2px 2px 0 !important;
    }

    .profile-btn:hover {
      transform: translateY(-2px) !important;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1) !important;
    }

    .profile-btn:active {
      transform: translateY(0) !important;
    }

    /* Profile Button Icons */
    .profile-btn i {
      font-size: 24px !important;
      width: 48px !important;
      height: 48px !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      border-radius: 12px !important;
      background: #f8f9ff !important;
      color: #1a237e !important;
    }

    /* Profile Button Text */
    .profile-btn span {
      font-size: 16px !important;
      font-weight: 500 !important;
      color: #333 !important;
    }

    /* Profile Info Fields */
    .info-field {
      background: #f8f9ff !important;
      border-radius: 12px !important;
      padding: 16px !important;
      margin-bottom: 16px !important;
    }

    .info-field label {
      color: #666 !important;
      font-size: 14px !important;
      margin-bottom: 8px !important;
      display: block !important;
    }

    .info-field .value {
      color: #333 !important;
      font-size: 16px !important;
      font-weight: 500 !important;
    }

    /* Apply styles to existing elements */
    window.addEventListener('load', function() {
      // Style profile buttons
      document.querySelectorAll('a[href*="profile"], button[onclick*="profile"]').forEach(btn => {
        if (!btn.classList.contains('profile-btn')) {
          btn.className = 'profile-btn';
          // Add icons based on text content
          const text = btn.textContent.toLowerCase();
          let icon = 'user';
          if (text.includes('employment')) icon = 'briefcase';
          if (text.includes('personal')) icon = 'address-card';
          if (text.includes('national')) icon = 'id-card';
          if (text.includes('experience')) icon = 'history';
          if (text.includes('contact')) icon = 'phone';
          
          btn.innerHTML = \`
            <i class="fas fa-\${icon}"></i>
            <span>\${btn.textContent}</span>
          \`;
        }
      });

      // Style info fields
      document.querySelectorAll('input[type="text"], input[type="number"], select').forEach(field => {
        const wrapper = document.createElement('div');
        wrapper.className = 'info-field';
        const label = document.createElement('label');
        label.textContent = field.previousElementSibling?.textContent || field.getAttribute('placeholder') || 'Information';
        wrapper.appendChild(label);
        field.parentNode.insertBefore(wrapper, field);
        wrapper.appendChild(field);
      });
    });
  \`;
  document.head.appendChild(style);

  // Add Font Awesome if not already present
  if (!document.querySelector('link[href*="font-awesome"]')) {
    const fontAwesome = document.createElement('link');
    fontAwesome.rel = 'stylesheet';
    fontAwesome.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css';
    document.head.appendChild(fontAwesome);
  }
})();
`;
