export const employmentFormTransform = `
(function() {
  console.log('Employment form transform starting...');

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

    table {
      width: 100% !important;
      border-collapse: separate !important;
      border-spacing: 0 15px !important;
    }

    td {
      padding: 12px !important;
    }

    td[align="right"] strong {
      color: #475569 !important;
      font-size: 1.05rem !important;
      font-weight: 500 !important;
      letter-spacing: -0.3px !important;
    }

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

    /* Section titles */
    #ContentPlaceHolder1_lblad,
    #ContentPlaceHolder1_Label1 {
      font-size: 1.4rem !important;
      color: #334155 !important;
      font-weight: 600 !important;
      margin: 32px 0 20px !important;
      display: inline-block !important;
      position: relative !important;
      padding-bottom: 12px !important;
      letter-spacing: -0.5px !important;
    }

    #ContentPlaceHolder1_lblad::after,
    #ContentPlaceHolder1_Label1::after {
      content: '' !important;
      position: absolute !important;
      bottom: 0 !important;
      left: 0 !important;
      width: 100% !important;
      height: 3px !important;
      background: linear-gradient(to right, #6366f1, #8b5cf6) !important;
      border-radius: 3px !important;
    }

    /* Grid styling */
    .Grid {
      border: none !important;
      border-radius: 16px !important;
      overflow: hidden !important;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08) !important;
      background: white !important;
    }

    .Grid th {
      background: linear-gradient(135deg, #6366f1, #8b5cf6) !important;
      color: white !important;
      padding: 16px !important;
      font-weight: 600 !important;
      border: none !important;
      font-size: 1.15rem !important;
      letter-spacing: -0.3px !important;
      text-transform: capitalize !important;
    }

    .Grid td {
      padding: 14px !important;
      border: 1px solid #e2e8f0 !important;
      color: #334155 !important;
      font-size: 1rem !important;
      background: white !important;
    }

    .Grid tr:hover td {
      background: #f8fafc !important;
    }

    /* Footer note */
    div[align="center"] strong[style*="color:Red"] {
      display: inline-block !important;
      margin-top: 30px !important;
      padding: 16px 30px !important;
      background: #fef2f2 !important;
      color: #ef4444 !important;
      border-radius: 12px !important;
      font-size: 1rem !important;
      box-shadow: 0 4px 12px rgba(239, 68, 68, 0.08) !important;
    }

    /* Add animations */
    .x_panel, .form-control, .Grid {
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
  \`;
  document.head.appendChild(style);

  // Add icons to section titles
  const adminTitle = document.querySelector('#ContentPlaceHolder1_lblad');
  if (adminTitle) {
    adminTitle.innerHTML = '<i class="fas fa-users-cog" style="margin-right: 12px; color: #6366f1; font-size: 1.3rem;"></i>' + adminTitle.innerHTML;
  }

  const functionalTitle = document.querySelector('#ContentPlaceHolder1_Label1');
  if (functionalTitle) {
    functionalTitle.innerHTML = '<i class="fas fa-sitemap" style="margin-right: 12px; color: #6366f1; font-size: 1.3rem;"></i>' + functionalTitle.innerHTML;
  }

})();
`;
