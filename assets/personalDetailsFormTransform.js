export const personalDetailsFormTransform = `
(function() {
  console.log('Personal details form transform starting...');

  // Add Font Awesome if not already present
  if (!document.querySelector('link[href*="font-awesome"]')) {
    const fontAwesome = document.createElement('link');
    fontAwesome.rel = 'stylesheet';
    fontAwesome.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css';
    document.head.appendChild(fontAwesome);
  }

  // Add custom styles
  const style = document.createElement('style');
  style.textContent = \`
    .right_col {
      background: #f8fafc !important;
      padding: 20px !important;
    }

    .x_panel {
      background: white !important;
      border-radius: 20px !important;
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12) !important;
      border: none !important;
      position: relative !important;
      overflow: hidden !important;
      margin-bottom: 30px !important;
    }

    .x_panel::before {
      content: '' !important;
      position: absolute !important;
      top: 0 !important;
      left: 0 !important;
      right: 0 !important;
      height: 6px !important;
      background: linear-gradient(135deg, #6366f1, #8b5cf6, #ec4899) !important;
    }

    .x_title {
      border-bottom: none !important;
      padding: 25px 30px !important;
      font-size: 1.75rem !important;
      color: #1e293b !important;
      font-weight: 600 !important;
      display: flex !important;
      align-items: center !important;
      gap: 15px !important;
      letter-spacing: -0.5px !important;
    }

    .x_title::before {
      content: '\\f007' !important;
      font-family: 'Font Awesome 5 Free' !important;
      font-weight: 900 !important;
      font-size: 24px !important;
      color: #6366f1 !important;
      background: #f0f1ff !important;
      padding: 12px !important;
      border-radius: 12px !important;
    }

    .x_content {
      padding: 0 30px 30px !important;
    }

    /* Section titles */
    .label.label-primary {
      background: linear-gradient(135deg, #6366f1, #8b5cf6) !important;
      padding: 12px 20px !important;
      font-size: 1.1rem !important;
      font-weight: 500 !important;
      border-radius: 8px !important;
      margin: 25px 0 15px !important;
      display: inline-block !important;
      letter-spacing: -0.3px !important;
    }

    /* Form fields */
    .form-control {
      border: 2px solid #e2e8f0 !important;
      border-radius: 12px !important;
      padding: 14px !important;
      font-size: 1rem !important;
      color: #1e293b !important;
      background: #f8fafc !important;
      transition: all 0.3s ease !important;
      height: auto !important;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04) !important;
    }

    .form-control:focus {
      border-color: #6366f1 !important;
      box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1) !important;
      background: white !important;
    }

    .form-control:disabled {
      background: #f1f5f9 !important;
      color: #334155 !important;
      border-color: #e2e8f0 !important;
      opacity: 0.8 !important;
    }

    /* Labels */
    span[style*="font-weight:bold"] {
      color: #475569 !important;
      font-size: 1.05rem !important;
      font-weight: 500 !important;
      letter-spacing: -0.3px !important;
    }

    /* Tables */
    table {
      width: 100% !important;
      border-collapse: separate !important;
      border-spacing: 0 15px !important;
    }

    td {
      padding: 8px 12px !important;
    }

    /* Dropdowns */
    select.form-control {
      appearance: none !important;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%236366f1'%3E%3Cpath d='M7 10l5 5 5-5z'/%3E%3C/svg%3E") !important;
      background-repeat: no-repeat !important;
      background-position: right 12px center !important;
      background-size: 20px !important;
      padding-right: 40px !important;
    }

    /* Checkboxes */
    input[type="checkbox"] {
      width: 18px !important;
      height: 18px !important;
      border: 2px solid #6366f1 !important;
      border-radius: 4px !important;
      margin-right: 8px !important;
    }

    /* Textareas */
    textarea.form-control {
      min-height: 80px !important;
      resize: vertical !important;
    }

    /* Add animations */
    .x_panel, .form-control {
      animation: fadeIn 0.5s ease-out !important;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    /* Column titles */
    td[align="right"] span {
      font-size: 1.1rem !important;
      color: #334155 !important;
      font-weight: 500 !important;
    }

    /* Mobile responsiveness */
    @media (max-width: 768px) {
      .x_panel {
        margin: 10px !important;
        padding: 15px !important;
      }
      
      td {
        display: block !important;
        width: 100% !important;
        padding: 5px 0 !important;
      }

      td[align="right"] {
        text-align: left !important;
      }
    }
  \`;
  document.head.appendChild(style);

})();
`;
