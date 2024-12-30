// Employee Benefits page transformation script
export const employeeBenefitsTransform = `
(function() {
  function initializeBenefitsPage() {
    // Create and inject styles
    const styleElement = document.createElement('style');
    styleElement.textContent = \`
      body {
        background: #f8fafc !important;
        min-height: 100vh !important;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif !important;
        position: relative !important;
        margin-bottom: 0 !important;
        padding-bottom: 0 !important;
      }

      /* Cover footer with background */
      body::after {
        content: '' !important;
        position: fixed !important;
        bottom: 0 !important;
        left: 0 !important;
        right: 0 !important;
        height: 60px !important;
        background: #f8fafc !important;
        z-index: 9999 !important;
      }

      /* Additional footer hiding */
      div[style*="background-color: rgb(35, 107, 134)"],
      div[style*="background-color: #236B86"],
      div[style*="236, 107, 134"],
      div[style*="position: fixed"][style*="bottom"],
      div[style*="position:fixed"][style*="bottom"],
      body > div:last-child {
        opacity: 0 !important;
        visibility: hidden !important;
        display: none !important;
        height: 0 !important;
        margin: 0 !important;
        padding: 0 !important;
        overflow: hidden !important;
      }

      .right_col {
        padding: 0 !important;
        background: #f8fafc !important;
        min-height: 100vh !important;
        padding-bottom: 0 !important;
        margin-bottom: 0 !important;
        position: relative !important;
        z-index: 1 !important;
      }

      /* Add extra padding to container to prevent content being covered */
      .form-container {
        padding: 20px !important;
        padding-bottom: 80px !important;
        background: transparent !important;
        max-width: 600px !important;
        margin: 0 auto !important;
        position: relative !important;
        z-index: 1 !important;
      }

      .benefits-grid {
        padding-bottom: 80px !important;
      }

      /* Hide unnecessary elements */
      .nav_menu, .top_nav, .footer {
        display: none !important;
      }

      /* Benefits Header */
      .benefits-header {
        background: linear-gradient(135deg, #0EA5E9, #2563EB) !important;
        padding: 40px 20px !important;
        color: white !important;
        position: relative !important;
        margin-bottom: 40px !important;
        overflow: hidden !important;
        z-index: 10 !important;
        border-radius: 0 0 30px 30px !important;
        box-shadow: 
          0 10px 30px -10px rgba(14, 165, 233, 0.3),
          inset 0 -1px 0 rgba(255, 255, 255, 0.1) !important;
      }

      .benefits-header::before {
        content: '' !important;
        position: absolute !important;
        top: -50% !important;
        left: -50% !important;
        width: 200% !important;
        height: 200% !important;
        background: 
          radial-gradient(circle at 30% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 70% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 50%) !important;
        transform: rotate(-3deg) !important;
        opacity: 0.8 !important;
        z-index: 0 !important;
      }

      .benefits-header::after {
        content: '' !important;
        position: absolute !important;
        bottom: 0 !important;
        left: 0 !important;
        right: 0 !important;
        height: 40% !important;
        background: linear-gradient(to top, rgba(255, 255, 255, 0.1), transparent) !important;
        z-index: 1 !important;
      }

      .benefits-header h1 {
        font-size: 28px !important;
        font-weight: 700 !important;
        margin: 0 !important;
        color: white !important;
        text-align: center !important;
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1) !important;
        letter-spacing: 0.5px !important;
        position: relative !important;
        z-index: 2 !important;
        transform: translateY(10px) !important;
      }

      .back-button {
        position: absolute !important;
        top: 20px !important;
        left: 20px !important;
        width: 40px !important;
        height: 40px !important;
        background: rgba(255, 255, 255, 0.1) !important;
        border: none !important;
        color: white !important;
        border-radius: 12px !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        cursor: pointer !important;
        transition: all 0.3s ease-in-out !important;
        backdrop-filter: blur(8px) !important;
        -webkit-backdrop-filter: blur(8px) !important;
        z-index: 2 !important;
        box-shadow: 
          0 4px 12px rgba(0, 0, 0, 0.1),
          inset 0 1px 1px rgba(255, 255, 255, 0.2) !important;
      }

      .back-button:hover {
        background: rgba(255, 255, 255, 0.15) !important;
        transform: translateY(-2px) !important;
        box-shadow: 
          0 6px 16px rgba(0, 0, 0, 0.15),
          inset 0 1px 1px rgba(255, 255, 255, 0.2) !important;
      }

      .back-button span {
        font-size: 24px !important;
        line-height: 1 !important;
      }

      /* Benefits Grid */
      .benefits-grid {
        display: grid !important;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)) !important;
        gap: 30px !important;
        padding: 20px 30px 80px !important;
        max-width: 1200px !important;
        margin: 0 auto !important;
        position: relative !important;
        z-index: 1 !important;
      }

      .benefit-card {
        background: white !important;
        border-radius: 24px !important;
        padding: 30px !important;
        display: flex !important;
        flex-direction: column !important;
        gap: 20px !important;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05) !important;
      }

      .benefit-card::before {
        content: '' !important;
        position: absolute !important;
        top: 0 !important;
        left: 0 !important;
        right: 0 !important;
        height: 6px !important;
        background: linear-gradient(90deg, #0EA5E9, #2563EB) !important;
        opacity: 0 !important;
        transition: opacity 0.3s ease-in-out !important;
      }

      .benefit-card:hover {
        transform: translateY(-6px) !important;
        box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1),
                    0 20px 40px rgba(0, 0, 0, 0.06) !important;
      }

      .benefit-card:hover::before {
        opacity: 1 !important;
      }

      .benefit-header {
        display: flex !important;
        align-items: center !important;
        gap: 20px !important;
      }

      .icon-container {
        width: 64px !important;
        height: 64px !important;
        border-radius: 20px !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        font-size: 32px !important;
        color: white !important;
        flex-shrink: 0 !important;
        position: relative !important;
        overflow: hidden !important;
        transition: transform 0.3s ease-in-out !important;
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1) !important;
      }

      .icon-container::after {
        content: '' !important;
        position: absolute !important;
        top: 0 !important;
        left: 0 !important;
        right: 0 !important;
        bottom: 0 !important;
        background: linear-gradient(135deg, rgba(255,255,255,0.4), rgba(255,255,255,0)) !important;
        border-radius: inherit !important;
      }

      .loan {
        background: linear-gradient(135deg, #0EA5E9, #2563EB) !important;
        box-shadow: 0 8px 20px rgba(14, 165, 233, 0.2) !important;
      }

      .marriage {
        background: linear-gradient(135deg, #F43F5E, #E11D48) !important;
        box-shadow: 0 8px 20px rgba(244, 63, 94, 0.2) !important;
      }

      .benefit-title {
        font-size: 22px !important;
        font-weight: 700 !important;
        color: #0F172A !important;
        margin: 0 !important;
        line-height: 1.4 !important;
      }

      .sub-menu {
        display: flex !important;
        flex-direction: column !important;
        gap: 12px !important;
        padding-left: 76px !important;
      }

      .sub-menu-item {
        display: inline-block !important;
        padding: 12px 20px !important;
        background: #f8fafc !important;
        border-radius: 12px !important;
        color: #475569 !important;
        text-decoration: none !important;
        font-size: 16px !important;
        font-weight: 500 !important;
        transition: all 0.2s ease-in-out !important;
      }

      .sub-menu-item:hover {
        background: #f1f5f9 !important;
        transform: translateX(5px) !important;
      }

      /* Form Styles */
      .form-page {
        padding: 0 !important;
        max-width: 100% !important;
        margin: 0 !important;
        background: #f8fafc !important;
      }

      .form-container {
        padding: 20px !important;
        padding-bottom: 80px !important;
        background: transparent !important;
        max-width: 600px !important;
        margin: 0 auto !important;
      }

      /* Table Styles */
      table {
        width: 100% !important;
        border-collapse: separate !important;
        border-spacing: 0 !important;
        margin-bottom: 0 !important;
        background: transparent !important;
        border: none !important;
      }

      tr {
        margin-bottom: 24px !important;
      }

      td {
        padding: 0 0 16px 0 !important;
        border: none !important;
        background: transparent !important;
      }

      /* Form Group Styles */
      .form-group {
        background: white !important;
        border-radius: 16px !important;
        padding: 32px !important;
        margin-bottom: 24px !important;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05) !important;
      }

      .form-group h3 {
        font-size: 20px !important;
        font-weight: 600 !important;
        color: #0891b2 !important;
        margin: 0 0 24px 0 !important;
        padding-bottom: 16px !important;
        border-bottom: 2px solid #e5e7eb !important;
      }

      /* Label Styles */
      label, td:first-child {
        display: block !important;
        font-size: 15px !important;
        font-weight: 500 !important;
        color: #4b5563 !important;
        margin-bottom: 12px !important;
      }

      /* Input Styles */
      input[type="text"],
      input[type="number"],
      input[type="date"],
      input[type="email"],
      input[type="tel"],
      select,
      textarea {
        width: 100% !important;
        padding: 14px 16px !important;
        border: 2px solid #e5e7eb !important;
        border-radius: 8px !important;
        font-size: 16px !important;
        color: #1f2937 !important;
        background: white !important;
        transition: all 0.2s !important;
        margin-bottom: 24px !important;
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05) !important;
        min-height: 48px !important;
      }

      input[type="text"]:focus,
      input[type="number"]:focus,
      input[type="date"]:focus,
      input[type="email"]:focus,
      input[type="tel"]:focus,
      select:focus,
      textarea:focus {
        outline: none !important;
        border-color: #0891b2 !important;
        box-shadow: 0 0 0 3px rgba(8, 145, 178, 0.1) !important;
      }

      /* Button Styles */
      button[type="submit"],
      input[type="submit"] {
        background: linear-gradient(135deg, #0891b2, #22d3ee) !important;
        color: white !important;
        border: none !important;
        padding: 16px 24px !important;
        border-radius: 8px !important;
        font-size: 16px !important;
        font-weight: 600 !important;
        cursor: pointer !important;
        transition: all 0.2s !important;
        width: 100% !important;
        margin-top: 24px !important;
        box-shadow: 0 4px 6px rgba(8, 145, 178, 0.1) !important;
      }

      button[type="submit"]:hover,
      input[type="submit"]:hover {
        transform: translateY(-2px) !important;
        box-shadow: 0 6px 8px rgba(8, 145, 178, 0.2) !important;
      }

      /* Radio and Checkbox Styles */
      input[type="radio"],
      input[type="checkbox"] {
        width: 18px !important;
        height: 18px !important;
        margin-right: 8px !important;
        accent-color: #0891b2 !important;
      }

      /* Hide original table styles */
      .table, .table-striped {
        background: transparent !important;
        margin: 0 !important;
        border: none !important;
      }

      .table > tbody > tr > td {
        border: none !important;
        padding: 0 !important;
        background: transparent !important;
      }

      /* Responsive Styles */
      @media (max-width: 768px) {
        .form-container {
          padding: 16px !important;
        }

        .form-group {
          padding: 20px !important;
          border-radius: 12px !important;
        }

        /* Make tables responsive */
        table, thead, tbody, th, td, tr {
          display: block !important;
          width: 100% !important;
        }

        td {
          position: relative !important;
          padding-left: 0 !important;
          margin-bottom: 16px !important;
        }

        td:first-child {
          font-weight: 600 !important;
          color: #1f2937 !important;
          margin-bottom: 8px !important;
        }

        input[type="text"],
        input[type="number"],
        input[type="date"],
        input[type="email"],
        input[type="tel"],
        select,
        textarea {
          margin-bottom: 24px !important;
        }
      }

      @media (max-width: 768px) {
        .benefits-grid {
          grid-template-columns: 1fr !important;
          padding: 16px !important;
        }

        .benefits-header {
          padding: 30px 20px !important;
          border-radius: 0 0 25px 25px !important;
        }

        .benefits-header h1 {
          font-size: 24px !important;
          transform: translateY(5px) !important;
        }

        .back-button {
          width: 36px !important;
          height: 36px !important;
          top: 15px !important;
          left: 15px !important;
        }
      }
    \`;
    document.head.appendChild(styleElement);

    // Create benefits page structure
    const container = document.querySelector('.right_col');
    if (!container) return;

    // Clear existing content
    container.innerHTML = '';

    // Create header
    const header = document.createElement('div');
    header.className = 'benefits-header';
    header.innerHTML = \`
      <button class="back-button" onclick="window.history.back()">
        <i class="fa fa-arrow-left"></i>
      </button>
      <h1>Employee Benefits</h1>
    \`;
    container.appendChild(header);

    // Create benefits grid
    const grid = document.createElement('div');
    grid.className = 'benefits-grid';

    // Define benefits with sub-menu items
    const benefits = [
      {
        title: 'Loan Management',
        icon: 'fa-money-bill-wave',
        class: 'loan',
        subMenu: [
          { title: 'Loan Request', href: 'pgloanentry.aspx' },
          { title: 'My Loan Requests', href: 'pgmyloanrequests.aspx' }
        ]
      },
      {
        title: 'Marriage Gift',
        icon: 'fa-gift',
        class: 'marriage',
        subMenu: [
          { title: 'Marriage Gift Request', href: 'pgmarriagegiftrequest.aspx' },
          { title: 'My Requests', href: 'pgmymarriagerequests.aspx' }
        ]
      }
    ];

    // Add benefit cards
    benefits.forEach(benefit => {
      const card = document.createElement('div');
      card.className = 'benefit-card';
      
      // Create card header
      const header = document.createElement('div');
      header.className = 'benefit-header';
      header.innerHTML = \`
        <div class="icon-container \${benefit.class}">
          <i class="fas \${benefit.icon}"></i>
        </div>
        <h3 class="benefit-title">\${benefit.title}</h3>
      \`;
      
      // Create sub-menu
      const subMenu = document.createElement('div');
      subMenu.className = 'sub-menu';
      
      benefit.subMenu.forEach(item => {
        const li = document.createElement('li');
        const link = document.createElement('a');
        link.href = item.href;
        link.className = 'sub-menu-item';
        link.textContent = item.title;
        
        // Use the same approach as profile page
        link.addEventListener('click', (e) => {
          e.preventDefault();
          
          // Clear the container first
          const container = document.querySelector('.right_col');
          container.innerHTML = '';
          
          // Create form page container
          const formPage = document.createElement('div');
          formPage.className = 'form-page';
          formPage.style.display = 'block';
          
          // Add back button and header
          const header = document.createElement('div');
          header.className = 'benefits-header';
          header.innerHTML = \`
            <button class="back-button">
              <i class="fa fa-arrow-left"></i>
            </button>
            <h1>\${item.title}</h1>
          \`;
          
          // Add back button functionality
          header.querySelector('.back-button').onclick = () => {
            // Remove the current form page
            formPage.remove();
            // Reinitialize the benefits page
            initializeBenefitsPage();
            // Scroll to top
            window.scrollTo(0, 0);
          };
          
          // Create form container
          const formContainer = document.createElement('div');
          formContainer.className = 'form-container';
          
          // Add elements to form page
          formPage.appendChild(header);
          formPage.appendChild(formContainer);
          
          // Add form page to main content
          container.appendChild(formPage);
          
          // Use fetch to load content like profile page
          fetch(item.href)
            .then(response => response.text())
            .then(html => {
              const parser = new DOMParser();
              const doc = parser.parseFromString(html, 'text/html');
              
              // Try to find the main content area
              let formContent = doc.querySelector('.right_col');
              
              if (formContent) {
                // Log the form structure
                console.log('Form Structure:', formContent.innerHTML);
                
                // Clean up the form content
                formContainer.innerHTML = formContent.innerHTML;
                
                // Enhance form elements
                const enhanceFormElements = () => {
                  // Remove Employee Particulars section
                  const employeeParticularsTables = formContainer.querySelectorAll('table');
                  employeeParticularsTables.forEach(table => {
                    const firstCell = table.querySelector('tr:first-child td:first-child');
                    if (firstCell && firstCell.textContent.trim().includes('Employee Particulars')) {
                      table.remove();
                    }
                  });

                  // Group remaining form fields
                  const tables = formContainer.querySelectorAll('table');
                  tables.forEach(table => {
                    const firstCell = table.querySelector('tr:first-child td:first-child');
                    if (firstCell) {
                      const title = firstCell.textContent.trim();
                      // Skip if it's an empty table or contains 'Employee Particulars'
                      if (!title || title.includes('Employee Particulars')) {
                        return;
                      }

                      const formGroup = document.createElement('div');
                      formGroup.className = 'form-group';
                      formGroup.innerHTML = \`<h3>\${title}</h3>\`;
                      
                      // Move table into form group
                      table.parentNode.insertBefore(formGroup, table);
                      formGroup.appendChild(table);
                    }
                  });

                  // Add required indicator to required fields
                  const requiredFields = formContainer.querySelectorAll('input[required], select[required]');
                  requiredFields.forEach(field => {
                    const label = field.previousElementSibling;
                    if (label && label.tagName === 'LABEL') {
                      label.innerHTML += ' <span style="color: #ef4444;">*</span>';
                    }
                  });

                  // Enhance select elements
                  const selects = formContainer.querySelectorAll('select');
                  selects.forEach(select => {
                    select.style.appearance = 'none';
                    const wrapper = document.createElement('div');
                    wrapper.style.position = 'relative';
                    select.parentNode.insertBefore(wrapper, select);
                    wrapper.appendChild(select);
                    
                    // Add custom arrow
                    const arrow = document.createElement('div');
                    arrow.innerHTML = '<i class="fas fa-chevron-down"></i>';
                    arrow.style.cssText = \`
                      position: absolute !important;
                      right: 12px !important;
                      top: 50% !important;
                      transform: translateY(-50%) !important;
                      pointer-events: none !important;
                      color: #6b7280 !important;
                    \`;
                    wrapper.appendChild(arrow);
                  });

                  // Log the form structure after cleanup
                  console.log('Form Structure after cleanup:', formContainer.innerHTML);
                };

                // Apply enhancements
                enhanceFormElements();
                
                // Get all forms
                const forms = formContainer.querySelectorAll('form');
                forms.forEach(form => {
                  // Keep original form submission
                  const originalAction = form.action;
                  form.onsubmit = (e) => {
                    e.preventDefault();
                    window.location.href = originalAction;
                    return false;
                  };
                });
              } else {
                // Fallback to direct navigation
                window.location.href = item.href;
              }
            })
            .catch(error => {
              console.error('Error loading form:', error);
              // Fallback to direct navigation
              window.location.href = item.href;
            });
        });
        
        li.appendChild(link);
        subMenu.appendChild(li);
      });

      card.appendChild(header);
      card.appendChild(subMenu);
      grid.appendChild(card);
    });

    container.appendChild(grid);

    // Add Font Awesome if not already present
    if (!document.querySelector('link[href*="font-awesome"]')) {
      const fontAwesome = document.createElement('link');
      fontAwesome.rel = 'stylesheet';
      fontAwesome.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css';
      document.head.appendChild(fontAwesome);
    }
  }

  // Initialize when ready
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    initializeBenefitsPage();
  } else {
    document.addEventListener('DOMContentLoaded', initializeBenefitsPage);
  }
})();
`;
