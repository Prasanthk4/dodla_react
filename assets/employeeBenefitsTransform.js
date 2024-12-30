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
      }

      .right_col {
        padding: 0 !important;
        background: #f8fafc !important;
      }

      /* Hide unnecessary elements */
      .nav_menu, .top_nav, .footer, .site_title {
        display: none !important;
      }

      /* Benefits Header */
      .benefits-header {
        background: linear-gradient(135deg, #0891b2, #22d3ee) !important;
        padding: 40px 20px !important;
        color: white !important;
        position: relative !important;
      }

      .benefits-header h1 {
        font-size: 24px !important;
        font-weight: 600 !important;
        margin: 0 !important;
        color: white !important;
        text-align: center !important;
      }

      /* Back button */
      .back-button {
        position: absolute !important;
        top: 20px !important;
        left: 20px !important;
        background: rgba(255, 255, 255, 0.2) !important;
        border: none !important;
        color: white !important;
        padding: 8px 16px !important;
        border-radius: 6px !important;
        display: flex !important;
        align-items: center !important;
        gap: 8px !important;
        cursor: pointer !important;
        font-size: 14px !important;
      }

      .back-button:hover {
        background: rgba(255, 255, 255, 0.3) !important;
      }

      /* Benefits Grid */
      .benefits-grid {
        display: grid !important;
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)) !important;
        gap: 20px !important;
        padding: 20px !important;
        max-width: 1200px !important;
        margin: 0 auto !important;
      }

      .benefit-card {
        background: white !important;
        border-radius: 12px !important;
        padding: 20px !important;
        display: flex !important;
        flex-direction: column !important;
        gap: 16px !important;
        cursor: pointer !important;
        transition: all 0.2s !important;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1) !important;
      }

      .benefit-header {
        display: flex !important;
        align-items: center !important;
        gap: 12px !important;
      }

      .icon-container {
        width: 48px !important;
        height: 48px !important;
        border-radius: 10px !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        font-size: 24px !important;
        color: white !important;
        flex-shrink: 0 !important;
      }

      .loan { background: linear-gradient(135deg, #0891b2, #22d3ee) !important; }
      .marriage { background: linear-gradient(135deg, #be185d, #f472b6) !important; }
      .relocation { background: linear-gradient(135deg, #059669, #34d399) !important; }

      .benefit-title {
        font-size: 18px !important;
        font-weight: 500 !important;
        color: #1f2937 !important;
        margin: 0 !important;
      }

      .sub-menu {
        display: flex !important;
        flex-direction: column !important;
        gap: 8px !important;
        padding-left: 60px !important;
      }

      .sub-menu-item {
        color: #4b5563 !important;
        text-decoration: none !important;
        padding: 8px 12px !important;
        border-radius: 6px !important;
        transition: all 0.2s !important;
        font-size: 14px !important;
      }

      .sub-menu-item:hover {
        background: #f3f4f6 !important;
        color: #1f2937 !important;
      }

      .form-page {
        display: none;
        padding: 20px;
        max-width: 1200px;
        margin: 0 auto;
      }

      .form-container {
        padding: 20px;
        background: white;
        border-radius: 12px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      }

      @media (max-width: 768px) {
        .benefits-grid {
          grid-template-columns: 1fr !important;
          padding: 16px !important;
        }

        .benefits-header {
          padding: 30px 16px !important;
        }

        .benefits-header h1 {
          font-size: 20px !important;
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
        <i class="fa fa-arrow-left"></i> Back
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
      },
      {
        title: 'Relocation Expenses',
        icon: 'fa-truck-moving',
        class: 'relocation',
        subMenu: [
          { title: 'Relocation Request', href: 'pgrelocationlist.aspx' }
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
              <i class="fa fa-arrow-left"></i> Back
            </button>
            <h1>\${item.title}</h1>
          \`;
          
          // Add back button functionality
          header.querySelector('.back-button').onclick = () => {
            // Reinitialize the benefits page
            initializeBenefitsPage();
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
                // Clean up the form content
                formContainer.innerHTML = formContent.innerHTML;
                
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
