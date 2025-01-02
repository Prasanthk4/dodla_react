// Sidebar Transform
export const sidebarTransform = `
(function() {
  // Create sidebar overlay
  const overlay = document.createElement('div');
  overlay.id = 'sidebarOverlay';
  overlay.style.cssText = 'display: none; position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); z-index: 999; transition: opacity 0.3s ease;';
  document.body.appendChild(overlay);

  // Create sidebar container
  const sidebar = document.createElement('div');
  sidebar.id = 'customSidebar';
  sidebar.style.cssText = 'position: fixed; top: 0; left: -280px; width: 280px; height: 100%; background: #fff; z-index: 1000; transition: left 0.3s ease; box-shadow: 2px 0 8px rgba(0,0,0,0.1); overflow-y: auto; -webkit-overflow-scrolling: touch;';
  
  // Add styles
  const style = document.createElement('style');
  style.textContent = \`
    #customSidebar {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    }

    .sidebar-header {
      padding: 20px;
      background: linear-gradient(135deg, #0066CC, #0052A3);
      color: white;
      position: relative;
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 16px;
    }

    .user-avatar {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background: rgba(255,255,255,0.2);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      color: white;
    }

    .user-name {
      font-size: 16px;
      font-weight: 600;
      margin: 0;
    }

    .user-role {
      font-size: 14px;
      opacity: 0.9;
      margin: 0;
    }

    .menu-section {
      padding: 12px 0;
    }

    .menu-item {
      padding: 12px 20px;
      display: flex;
      align-items: center;
      gap: 12px;
      color: #1a202c;
      text-decoration: none;
      transition: all 0.2s ease;
      cursor: pointer;
      user-select: none;
      -webkit-tap-highlight-color: transparent;
    }

    .menu-item i {
      font-size: 18px;
      width: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 6px;
      padding: 8px;
      transition: all 0.2s ease;
    }

    /* Icon colors */
    .menu-item i.fa-home { background: #E3F2FD; color: #1E88E5; }
    .menu-item i.fa-rupee { background: #E8F5E9; color: #43A047; }
    .menu-item i.fa-edit { background: #FFF3E0; color: #FB8C00; }
    .menu-item i.fa-plus { background: #F3E5F5; color: #8E24AA; }
    .menu-item i.fa-calculator { background: #E1F5FE; color: #039BE5; }
    .menu-item i.fa-file { background: #E8EAF6; color: #3949AB; }
    .menu-item i.fa-cutlery { background: #FCE4EC; color: #D81B60; }
    .menu-item i.fa-search { background: #F1F8E9; color: #7CB342; }
    .menu-item i.fa-cog { background: #FFEBEE; color: #E53935; }
    .menu-item i.fa-chevron-right { background: transparent; color: #94A3B8; }

    .menu-item:active {
      background: #f7fafc;
    }

    .menu-item:active i {
      transform: scale(0.95);
    }

    .submenu {
      max-height: 0;
      overflow: hidden;
      transition: max-height 0.3s ease;
      background: #f8fafc;
    }

    .submenu.open {
      max-height: 500px;
    }

    .submenu-item {
      padding: 10px 20px 10px 56px;
      color: #4a5568;
      text-decoration: none;
      display: block;
      font-size: 14px;
      transition: all 0.2s ease;
    }

    .submenu-item:active {
      background: #edf2f7;
    }

    .divider {
      height: 1px;
      background: #e2e8f0;
      margin: 8px 0;
    }
  \`;
  document.head.appendChild(style);

  // Create sidebar content
  sidebar.innerHTML = \`
    <div class="sidebar-header">
      <div class="user-info">
        <div class="user-avatar">
          <i class="fa fa-user"></i>
        </div>
        <div>
          <p class="user-name" id="sidebarUserName">Loading...</p>
        </div>
      </div>
    </div>
    <nav class="menu-section">
      <a href="Home.aspx" class="menu-item">
        <i class="fa fa-home"></i>
        <span>Home</span>
      </a>
      <a href="pgpayslips.aspx" class="menu-item">
        <i class="fa fa-rupee"></i>
        <span>Payslips</span>
      </a>
      <div class="menu-item" data-submenu="dataChange">
        <i class="fa fa-edit"></i>
        <span>Data Change</span>
        <i class="fa fa-chevron-right chevron"></i>
      </div>
      <div class="submenu" id="dataChangeSubmenu">
        <a href="pgsupervisorchange.aspx" class="submenu-item">Supervisor Change</a>
        <a href="pgrolechangerequest.aspx" class="submenu-item">Role Change</a>
        <a href="pgmydatachangerequests.aspx" class="submenu-item">My Requests</a>
        <a href="pgdatachangereport.aspx" class="submenu-item">Data Change Report</a>
      </div>
      <div class="divider"></div>
      <a href="pginsurancecard.aspx" class="menu-item">
        <i class="fa fa-plus"></i>
        <span>Insurance Card</span>
      </a>
      <a href="pguploadpolicies.aspx" class="menu-item">
        <i class="fa fa-calculator"></i>
        <span>Upload Policies</span>
      </a>
      <a href="pgpolicies.aspx" class="menu-item">
        <i class="fa fa-file"></i>
        <span>Policies</span>
      </a>
      <div class="divider"></div>
      <a href="pgcanteenreport.aspx" class="menu-item">
        <i class="fa fa-cutlery"></i>
        <span>Canteen Report</span>
      </a>
      <a href="pgemployeesearch.aspx" class="menu-item">
        <i class="fa fa-search"></i>
        <span>Employee Search</span>
      </a>
      <div class="menu-item" data-submenu="masters">
        <i class="fa fa-cog"></i>
        <span>Masters</span>
        <i class="fa fa-chevron-right chevron"></i>
      </div>
      <div class="submenu" id="mastersSubmenu">
        <a href="pgpersonalwiseregions.aspx" class="submenu-item">Pers Area Wise Regions</a>
        <a href="pgregionwiselocations.aspx" class="submenu-item">Region Wise Locations</a>
        <a href="pglocationwisedepartments.aspx" class="submenu-item">Location Wise Dept</a>
        <a href="pgnoticationmaster.aspx" class="submenu-item">Notification Master</a>
        <a href="pglocationroutemaping.aspx" class="submenu-item">Route Mapping</a>
        <a href="pgemproutemapping.aspx" class="submenu-item">Employee Mapping</a>
      </div>
    </nav>
  \`;
  document.body.appendChild(sidebar);

  // Handle submenu toggles
  const submenus = document.querySelectorAll('[data-submenu]');
  submenus.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const submenuId = item.getAttribute('data-submenu') + 'Submenu';
      const submenu = document.getElementById(submenuId);
      const chevron = item.querySelector('.chevron');
      
      if (submenu.classList.contains('open')) {
        submenu.classList.remove('open');
        chevron.style.transform = 'rotate(0)';
      } else {
        // Close other open submenus
        document.querySelectorAll('.submenu.open').forEach(menu => {
          if (menu.id !== submenuId) {
            menu.classList.remove('open');
            const otherChevron = document.querySelector(\`[data-submenu="\${menu.id.replace('Submenu', '')}"]\`).querySelector('.chevron');
            otherChevron.style.transform = 'rotate(0)';
          }
        });
        
        submenu.classList.add('open');
        chevron.style.transform = 'rotate(90deg)';
      }
    });
  });

  // Handle sidebar toggle
  let isOpen = false;
  window.toggleSidebar = function() {
    isOpen = !isOpen;
    sidebar.style.left = isOpen ? '0' : '-280px';
    overlay.style.display = isOpen ? 'block' : 'none';
    overlay.style.opacity = isOpen ? '1' : '0';
    
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  };

  // Close sidebar when clicking overlay
  overlay.addEventListener('click', () => {
    window.toggleSidebar();
  });

  // Handle touch gestures
  let touchStartX = 0;
  let touchStartY = 0;
  let touchMoveX = 0;
  let touchMoveY = 0;

  sidebar.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  });

  sidebar.addEventListener('touchmove', (e) => {
    touchMoveX = e.touches[0].clientX;
    touchMoveY = e.touches[0].clientY;
    
    const deltaX = touchStartX - touchMoveX;
    const deltaY = Math.abs(touchStartY - touchMoveY);
    
    // Only handle horizontal swipes
    if (deltaY < Math.abs(deltaX)) {
      e.preventDefault();
      if (deltaX > 0 && isOpen) {
        sidebar.style.left = \`-\${deltaX}px\`;
      }
    }
  });

  sidebar.addEventListener('touchend', () => {
    const deltaX = touchStartX - touchMoveX;
    if (deltaX > 70) { // If swiped left more than 70px
      window.toggleSidebar();
    } else {
      sidebar.style.left = '0';
    }
  });

  // Employee name API using localStorage
  const EmployeeAPI = {
    storageKey: 'dodla_employee_name',
    
    // Get employee name
    getName: function() {
      return localStorage.getItem(this.storageKey) || '';
    },
    
    // Check if name exists
    hasName: function() {
      return !!this.getName();
    },
    
    // Try to find and save name from DOM
    findAndSaveName: function() {
      const selectors = [
        '#ctl00_lblemployeename',
        '#ContentPlaceHolder1_txtfirstname',
        '#ContentPlaceHolder1_txtfullname',
        '.user-profile span[id*="lblemployeename"]'
      ];
      
      for (const selector of selectors) {
        const element = document.querySelector(selector);
        if (element) {
          const name = element.value || element.textContent;
          if (name) {
            const fullName = name.trim();
            if (fullName) {
              localStorage.setItem(this.storageKey, fullName);
              return true;
            }
          }
        }
      }
      return false;
    }
  };

  // Update user name from localStorage or find it in DOM
  const updateUserName = () => {
    const nameElement = document.getElementById('sidebarUserName');
    if (nameElement) {
      if (EmployeeAPI.hasName()) {
        nameElement.textContent = EmployeeAPI.getName();
      } else if (EmployeeAPI.findAndSaveName()) {
        nameElement.textContent = EmployeeAPI.getName();
      }
    }
  };

  // Initial update
  updateUserName();

  // Set up observer to watch for name changes
  const observer = new MutationObserver((mutations, obs) => {
    if (!EmployeeAPI.hasName()) {
      if (EmployeeAPI.findAndSaveName()) {
        updateUserName();
      }
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

  // Update periodically in case localStorage gets updated
  setInterval(updateUserName, 1000);

  // Handle link clicks to prevent postbacks
  sidebar.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const href = link.getAttribute('href');
      if (href) {
        window.location.href = href;
      }
    });
  });
})();
`;
