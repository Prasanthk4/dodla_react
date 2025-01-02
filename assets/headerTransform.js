export const headerTransform = `
(function() {
  // Remove existing nav menu
  document.querySelector('.nav_menu')?.remove();
  document.querySelector('.top_nav')?.remove();

  // Add viewport meta tag for proper mobile scaling
  const viewportMeta = document.querySelector('meta[name="viewport"]');
  if (viewportMeta) {
    viewportMeta.content = 'width=device-width, initial-scale=0.86, maximum-scale=0.86, user-scalable=no';
  } else {
    const meta = document.createElement('meta');
    meta.name = 'viewport';
    meta.content = 'width=device-width, initial-scale=0.86, maximum-scale=0.86, user-scalable=no';
    document.head.appendChild(meta);
  }

  // Check if we're on the home page
  const isHomePage = window.location.pathname.toLowerCase().includes('home') || 
                    window.location.pathname === '/' || 
                    window.location.pathname.endsWith('default.aspx');

  // Create and inject custom styles
  const style = document.createElement('style');
  
  // Get greeting based on time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'Good Morning';
    if (hour >= 12 && hour < 17) return 'Good Afternoon';
    if (hour >= 17 && hour < 22) return 'Good Evening';
    return 'Good Night';
  };

  // Function to get festival greeting
  const getFestivalGreeting = () => {
    const date = new Date();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    
    // Indian festival dates (simplified for example)
    const festivals = {
      // January
      '1-1': 'Happy New Year',
      '1-13': 'Happy Bhogi',
      '1-14': 'Happy Sankranti',
      '1-15': 'Happy Kanuma',
      // Other major festivals
      '3-8': 'Happy Holi',
      '8-15': 'Happy Independence Day',
      '8-19': 'Happy Raksha Bandhan',
      '9-19': 'Happy Ganesh Chaturthi',
      '10-15': 'Happy Dussehra',
      '11-12': 'Happy Diwali',
      '12-25': 'Merry Christmas'
    };
    
    const festivalKey = \`\${month}-\${day}\`;
    return festivals[festivalKey] || '';
  };

  // Employee name API using localStorage
  const EmployeeAPI = {
    storageKey: 'dodla_employee_name',
    
    // Save employee name
    saveName: function(name) {
      if (name && name.trim()) {
        localStorage.setItem(this.storageKey, name.trim());
        return true;
      }
      return false;
    },
    
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
            // Get first name from full name
            const firstName = name.trim().split(' ').find(n => n.length > 1) || name;
            if (this.saveName(firstName)) {
              console.log('Found and saved name:', firstName);
              return firstName;
            }
          }
        }
      }
      return '';
    }
  };

  // Leave Balance API using XPath
  const LeaveBalanceAPI = {
    storageKey: 'dodla_leave_balance',
    
    // Get leave balance from table
    getLeaveBalance: function() {
      const balances = {
        CL: '0.00',
        EL: '0.00',
        SL: '0.00'
      };

      try {
        // Method 1: Try to get from leave-attendance page iframe
        const leaveFrame = document.querySelector('iframe[src*="LeaveApplicationNew.aspx"]') || 
                          document.querySelector('iframe[src*="pgleaveapplicationnew.aspx"]');
        
        if (leaveFrame) {
          try {
            const frameDoc = leaveFrame.contentDocument || leaveFrame.contentWindow.document;
            
            // Try ASP.NET specific controls first (most reliable)
            const controls = {
              CL: ['ctl00_ContentPlaceHolder1_lblCLBal', 'ContentPlaceHolder1_lblCLBal', 'lblCLBal'],
              EL: ['ctl00_ContentPlaceHolder1_lblELBal', 'ContentPlaceHolder1_lblELBal', 'lblELBal'],
              SL: ['ctl00_ContentPlaceHolder1_lblSLBal', 'ContentPlaceHolder1_lblSLBal', 'lblSLBal']
            };

            for (const [type, ids] of Object.entries(controls)) {
              for (const id of ids) {
                const element = frameDoc.getElementById(id);
                if (element) {
                  const value = element.textContent.trim();
                  if (value && !isNaN(parseFloat(value))) {
                    balances[type] = value;
                  }
                }
              }
            }

            // If controls didn't work, try table search
            if (balances.CL === '0.00' && balances.EL === '0.00' && balances.SL === '0.00') {
              const tables = frameDoc.getElementsByTagName('table');
              for (const table of tables) {
                if (table.textContent.includes('Current Year Leave Balance')) {
                  const rows = table.getElementsByTagName('tr');
                  for (const row of rows) {
                    const cells = row.getElementsByTagName('td');
                    if (cells.length >= 4) {
                      const leaveType = cells[0].textContent.trim();
                      const balance = cells[3].textContent.trim();
                      if (leaveType === 'CL') balances.CL = balance;
                      if (leaveType === 'EL') balances.EL = balance;
                      if (leaveType === 'SL') balances.SL = balance;
                    }
                  }
                  break;
                }
              }
            }
          } catch (frameError) {
            console.log('Error accessing leave frame:', frameError);
          }
        }

        // Method 2: Try main document if iframe method failed
        if (balances.CL === '0.00' && balances.EL === '0.00' && balances.SL === '0.00') {
          const tables = document.getElementsByTagName('table');
          for (const table of tables) {
            if (table.textContent.includes('Current Year Leave Balance')) {
              const rows = table.getElementsByTagName('tr');
              for (const row of rows) {
                const cells = row.getElementsByTagName('td');
                if (cells.length >= 4) {
                  const leaveType = cells[0].textContent.trim();
                  const balance = cells[3].textContent.trim();
                  if (leaveType === 'CL') balances.CL = balance;
                  if (leaveType === 'EL') balances.EL = balance;
                  if (leaveType === 'SL') balances.SL = balance;
                }
              }
              break;
            }
          }
        }

        // Store the balances if we found any non-zero values
        if (balances.CL !== '0.00' || balances.EL !== '0.00' || balances.SL !== '0.00') {
          localStorage.setItem(this.storageKey, JSON.stringify(balances));
        } else {
          // Try to get from storage as fallback
          const stored = localStorage.getItem(this.storageKey);
          if (stored) {
            const storedBalances = JSON.parse(stored);
            balances.CL = storedBalances.CL;
            balances.EL = storedBalances.EL;
            balances.SL = storedBalances.SL;
          }
        }
        
        // Update UI elements
        this.updateUI(balances);
        
        return balances;
      } catch (error) {
        console.error('Error getting leave balance:', error);
        // Try to get from storage as fallback
        const stored = localStorage.getItem(this.storageKey);
        return stored ? JSON.parse(stored) : balances;
      }
    },

    // Update UI with leave balances
    updateUI: function(balances) {
      const updateElement = (id, value) => {
        const element = document.getElementById(id);
        if (element) {
          element.textContent = value;
          element.style.color = value === '0.00' ? '#ff4444' : '#2196F3';
        }
      };

      updateElement('clBalance', balances.CL);
      updateElement('elBalance', balances.EL);
      updateElement('slBalance', balances.SL);
    },

    // Initialize the balance checking
    init: function() {
      // Initial check
      this.getLeaveBalance();

      // Check if we're on the leave application page
      const isLeavePage = window.location.href.includes('LeaveApplicationNew.aspx') || 
                         window.location.href.includes('pgleaveapplicationnew.aspx');

      // Set up periodic checks with different intervals based on page
      const interval = isLeavePage ? 1000 : 2000;
      setInterval(() => this.getLeaveBalance(), interval);

      // Listen for ASP.NET postbacks
      if (typeof Sys !== 'undefined' && Sys.WebForms) {
        Sys.WebForms.PageRequestManager.getInstance().add_endRequest(() => {
          setTimeout(() => this.getLeaveBalance(), 500);
        });
      }
    }
  };

  // Initialize the greeting system
  const initializeGreeting = () => {
    const updateGreeting = () => {
      // Try to get name from storage or find it
      let name = EmployeeAPI.getName();
      if (!name) {
        name = EmployeeAPI.findAndSaveName();
      }
      
      // Update greeting with name
      const greetingElement = document.querySelector('.greeting');
      if (greetingElement) {
        greetingElement.textContent = \`\${getGreeting()}, \${name || 'User'}\`;
      }
    };

    // Set up name finder
    const setupNameFinder = () => {
      // Check for name changes every second
      setInterval(() => {
        if (!EmployeeAPI.hasName()) {
          const name = EmployeeAPI.findAndSaveName();
          if (name) {
            updateGreeting();
          }
        }
      }, 1000);
      
      // Also try to find name when page content changes
      const observer = new MutationObserver(() => {
        if (!EmployeeAPI.hasName()) {
          const name = EmployeeAPI.findAndSaveName();
          if (name) {
            updateGreeting();
            observer.disconnect();
          }
        }
      });
      
      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
    };

    // Start the system
    updateGreeting();
    setupNameFinder();
  };

  // Initialize the leave balance system
  const initializeLeaveBalance = () => {
    LeaveBalanceAPI.init();
  };

  // Start when document is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initializeGreeting();
      initializeLeaveBalance();
    });
  } else {
    initializeGreeting();
    initializeLeaveBalance();
  }

  style.textContent = \`
    /* Mobile Header Styles */
    .custom-header {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      height: 68px;
      background: linear-gradient(135deg, #007aff 0%, #0055b3 100%);
      box-shadow: 0 4px 15px rgba(0, 122, 255, 0.2);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 12px;
      z-index: 1000;
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
    }

    .custom-header::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 1px;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    }

    .header-left {
      display: flex;
      align-items: center;
      flex: 1;
      min-width: 48px;
    }

    .header-logo {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      padding: 4px 0;
      transition: transform 0.3s ease;
    }

    .header-logo:hover {
      transform: translate(-50%, -50%) scale(1.05);
    }

    .header-logo img {
      height: 28px;
      width: auto;
      object-fit: contain;
      transition: all 0.3s ease;
      display: block;
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 16px;
      flex: 1;
      justify-content: flex-end;
      min-width: 96px;
    }

    .header-btn {
      background: none;
      border: none;
      padding: 8px;
      cursor: pointer;
      position: relative;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
      border-radius: 50%;
    }

    .header-btn:hover {
      background: rgba(255, 255, 255, 0.1);
      transform: translateY(-1px);
    }

    .header-btn:active {
      transform: translateY(1px);
    }

    .menu-btn {
      padding: 8px;
      margin-left: -8px;
    }

    .menu-btn i {
      font-size: 24px;
      color: white;
    }

    .notification-btn {
      position: relative;
      width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .notification-btn i {
      font-size: 20px;
    }

    .notification-btn::after {
      content: '';
      position: absolute;
      top: 0;
      right: 0;
      width: 8px;
      height: 8px;
      background: #FF3B30;
      border-radius: 50%;
      border: 2px solid #007aff;
    }

    .notification-badge {
      position: absolute;
      top: -4px;
      right: -4px;
      background: #FF3B30;
      color: white;
      border-radius: 12px;
      min-width: 18px;
      height: 18px;
      font-size: 11px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      padding: 0 5px;
      border: 2px solid #007aff;
      transform: translate(25%, -25%);
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    }

    .profile-btn {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.15);
      color: white;
      margin-right: -8px;
      border: 2px solid rgba(255, 255, 255, 0.2);
      transition: all 0.3s ease;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .profile-btn:hover {
      background: rgba(255, 255, 255, 0.25);
      border-color: rgba(255, 255, 255, 0.3);
    }

    .profile-btn i {
      font-size: 20px;
    }

    .profile-menu {
      position: absolute;
      top: 100%;
      right: 0;
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      padding: 8px 0;
      margin-top: 8px;
      display: none;
      z-index: 1001;
      min-width: 160px;
    }

    .profile-menu.show {
      display: block;
    }

    .profile-menu-item {
      padding: 12px 16px;
      display: flex;
      align-items: center;
      gap: 12px;
      color: #333;
      cursor: pointer;
      transition: background 0.2s;
      font-size: 14px;
    }

    .profile-menu-item:hover {
      background: #f5f5f5;
    }

    .profile-menu-item i {
      font-size: 18px;
      color: #666;
      width: 20px;
      text-align: center;
    }

    /* Card Slider Styles */
    .card-slider {
      margin-top: 68px;
      padding: 8px;
      padding-bottom: 32px;
      overflow-x: auto;
      white-space: nowrap;
      -webkit-overflow-scrolling: touch;
      scrollbar-width: none;
      -ms-overflow-style: none;
      position: relative;
      z-index: 1;
      margin-bottom: -80px;
      display: \${isHomePage ? 'block' : 'none'};
    }

    .slider-card {
      display: inline-block;
      width: calc(100% - 20px);
      margin-right: 12px;
      padding: 28px;
      min-height: 160px;
      background: linear-gradient(135deg, #ffffff 0%, #f8f9ff 100%);
      border-radius: 24px;
      box-shadow: 0 8px 24px rgba(149, 157, 165, 0.15);
      white-space: normal;
      vertical-align: top;
      margin-bottom: 40px;
      position: relative;
      z-index: 2;
    }

    .slider-card::before {
      content: '';
      position: absolute;
      top: 0;
      right: 0;
      width: 150px;
      height: 150px;
      background: linear-gradient(135deg, rgba(0, 102, 255, 0.05), rgba(0, 102, 255, 0.1));
      border-radius: 50%;
      transform: translate(40%, -40%);
      z-index: 0;
    }

    .card-header {
      position: relative;
      z-index: 1;
      display: grid;
      grid-template-columns: 1fr auto;
      gap: 20px;
    }

    .date-time {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .greeting {
      font-size: 28px;
      font-weight: 600;
      color: #2d3748;
      margin-bottom: 4px;
      letter-spacing: -0.5px;
      line-height: 1.2;
    }

    .current-date {
      font-size: 16px;
      color: #718096;
      font-weight: 500;
      margin-bottom: 12px;
    }

    .current-time {
      font-size: 42px;
      font-weight: 700;
      background: linear-gradient(45deg, #0066ff, #3399ff);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      letter-spacing: -1px;
    }

    .weather-info {
      text-align: right;
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 4px;
      padding-top: 8px;
    }

    .temperature {
      font-size: 38px;
      font-weight: 700;
      color: #2d3748;
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .temperature::before {
      content: '';
      display: inline-block;
      width: 32px;
      height: 32px;
      background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23FF9500"><path d="M12 3a9 9 0 1 1 0 18 9 9 0 0 1 0-18zm0 2a7 7 0 1 0 0 14 7 7 0 0 0 0-14zm0 3v4.585l3.243 3.243-1.415 1.415L10 13.415V8h2z"/></svg>') no-repeat center center;
      margin-right: 4px;
    }

    .weather-condition {
      font-size: 16px;
      color: #718096;
      font-weight: 500;
      margin-bottom: 8px;
    }

    .festival-greeting-container {
      position: relative;
      margin-top: 8px;
      padding: 2px;
      animation: float 3s ease-in-out infinite;
    }

    .festival-greeting {
      position: relative;
      font-size: 16px;
      font-weight: 600;
      padding: 8px 16px;
      border-radius: 20px;
      background: linear-gradient(45deg, #ff6b6b, #ffd93d);
      color: white;
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
      box-shadow: 
        0 4px 12px rgba(255, 107, 107, 0.2),
        inset 0 2px 4px rgba(255, 255, 255, 0.3);
      animation: glow 2s ease-in-out infinite;
      z-index: 1;
    }

    .festival-greeting[data-festival="new-year"] {
      background: linear-gradient(45deg, #ff6b6b, #ffd93d, #6bf178);
    }

    .festival-greeting[data-festival="sankranti"] {
      background: linear-gradient(45deg, #ff9933, #ff6b6b);
    }

    .festival-greeting[data-festival="holi"] {
      background: linear-gradient(45deg, #ff1493, #9400d3, #4b0082);
    }

    .festival-greeting[data-festival="diwali"] {
      background: linear-gradient(45deg, #ffd700, #ff4500);
    }

    .festival-greeting::before,
    .festival-greeting::after {
      content: '✨';
      position: absolute;
      font-size: 14px;
      animation: sparkle 2s ease-in-out infinite;
    }

    .festival-greeting::before {
      left: -15px;
      top: 50%;
      transform: translateY(-50%);
      animation-delay: 0.5s;
    }

    .festival-greeting::after {
      right: -15px;
      top: 50%;
      transform: translateY(-50%);
      animation-delay: 1s;
    }

    @keyframes sparkle {
      0%, 100% { opacity: 0.4; transform: translateY(-50%) scale(0.8); }
      50% { opacity: 1; transform: translateY(-50%) scale(1.1); }
    }

    @keyframes float {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-5px); }
    }

    @keyframes glow {
      0%, 100% { filter: brightness(1); }
      50% { filter: brightness(1.2); }
    }

    /* Notification styles for second card */
    .notifications {
      text-align: left;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      background: transparent;
    }

    .notification-title {
      font-size: 28px;
      color: #333;
      font-weight: bold;
      margin-bottom: 16px;
    }

    .notification-count {
      font-size: 36px;
      color: #007aff;
      font-weight: bold;
      margin-bottom: 12px;
    }

    .notification-text {
      font-size: 18px;
      color: #666;
    }

    /* Dots indicator styles */
    .slider-dots {
      position: absolute;
      bottom: -40px;
      left: 0;
      right: 0;
      display: flex;
      justify-content: center;
      gap: 8px;
      z-index: 2;
    }

    .dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: rgba(0, 0, 0, 0.2);
      cursor: pointer;
      transition: background-color 0.3s ease;
    }

    .dot.active {
      background: #007aff;
      width: 24px;
      border-radius: 4px;
    }

    /* Adjust content padding based on page */
    .right_col {
      padding-top: \${isHomePage ? '120px' : '68px'} !important;
    }

    /* Leave Balance Card Styles */
    .leave-balance-card {
      background: white;
      border-radius: 16px;
      padding: 20px;
      margin: 15px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    }

    .leave-balance-title {
      font-size: 18px;
      font-weight: 600;
      color: #333;
      margin-bottom: 15px;
    }

    .leave-balance-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 12px;
    }

    .leave-type-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 12px;
      background: #f8f9ff;
      border-radius: 12px;
      transition: all 0.3s ease;
    }

    .leave-type-item:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }

    .leave-type {
      font-size: 14px;
      font-weight: 500;
      color: #666;
      margin-bottom: 4px;
    }

    .leave-count {
      font-size: 20px;
      font-weight: 600;
      color: #2196f3;
    }

    .leave-label {
      font-size: 12px;
      color: #888;
      margin-top: 2px;
    }
  \`;
  document.head.appendChild(style);

  // Create header HTML
  const header = document.createElement('header');
  header.className = 'custom-header';
  header.innerHTML = \`
    <div class="header-left">
      <button class="header-btn menu-btn" onclick="window.toggleSidebar()">
        <i class="fas fa-bars"></i>
      </button>
    </div>
    <div class="header-logo">
      <img src="https://cdn.brandfetch.io/idDexxOuUE/w/500/h/156/theme/dark/logo.png?c=1dxbfHSJFAPEGdCLU4o5B" 
           alt="Dodla Dairy" />
    </div>
    <div class="header-actions">
      <button class="header-btn notification-btn" onclick="window.location.href='pgviewnotifications.aspx'">
        <i class="fas fa-bell"></i>
        <span class="notification-badge">3</span>
      </button>
      <button class="header-btn profile-btn" id="profileBtn">
        <i class="fas fa-user"></i>
      </button>
      <div class="profile-menu" id="profileMenu">
        <div class="profile-menu-item" onclick="window.ReactNativeWebView.postMessage(JSON.stringify({type: 'OPEN_CAMERA'}))">
          <i class="fas fa-camera"></i>
          Take Photo
        </div>
        <div class="profile-menu-item" onclick="window.ReactNativeWebView.postMessage(JSON.stringify({type: 'OPEN_GALLERY'}))">
          <i class="fas fa-image"></i>
          Choose Image
        </div>
      </div>
    </div>
  \`;

  // Add the header to the page
  document.body.insertBefore(header, document.body.firstChild);

  // Only create and show slider on home page
  if (isHomePage) {
    // First, remove any existing card sliders
    const existingSliders = document.querySelectorAll('.card-slider');
    existingSliders.forEach(slider => slider.remove());

    const cardSlider = document.createElement('div');
    cardSlider.className = 'card-slider';

    function updateDateTime() {
      const now = new Date();
      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      
      const dayName = days[now.getDay()];
      const monthName = months[now.getMonth()];
      const date = now.getDate();
      const year = now.getFullYear();
      
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const formattedHours = hours % 12 || 12;
      const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;

      return {
        date: dayName + ', ' + monthName + ' ' + date + ', ' + year,
        time: formattedHours + ':' + formattedMinutes + ' ' + ampm
      };
    }

    // Create card content
    function createCards() {
      const dateTime = updateDateTime();
      const name = EmployeeAPI.getName() || EmployeeAPI.findAndSaveName() || 'User';
      const festivalGreeting = getFestivalGreeting();
      
      // Determine festival type for styling
      const getFestivalType = () => {
        const date = new Date();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        
        if (month === 1 && day === 1) return 'new-year';
        if (month === 1 && day === 14) return 'sankranti';
        if (month === 3 && day === 8) return 'holi';
        if (month === 11 && day === 12) return 'diwali';
        return 'default';
      };

      return [
        \`
          <div class="slider-card">
            <div class="card-header">
              <div class="date-time">
                <div class="greeting">\${getGreeting()}, \${name}</div>
                <div class="current-date">\${dateTime.date}</div>
                <div class="current-time">\${dateTime.time}</div>
              </div>
              <div class="weather-info">
                <div class="temperature">28°C</div>
                <div class="weather-condition">Sunny</div>
                \${festivalGreeting ? \`
                  <div class="festival-greeting-container">
                    <div class="new-year-decor"></div>
                    <div class="festival-greeting" data-festival="\${getFestivalType()}">\${festivalGreeting}</div>
                  </div>
                \` : ''}
              </div>
            </div>
          </div>
        \`,
        \`
          <div class="slider-card">
            <div class="leave-balance-card">
              <div class="leave-balance-title">Leave Balance</div>
              <div class="leave-balance-grid">
                <div class="leave-type-item" data-type="CL">
                  <div class="leave-type">CL</div>
                  <div class="leave-count" id="clBalance">0.00</div>
                  <div class="leave-label">Balance</div>
                </div>
                <div class="leave-type-item" data-type="EL">
                  <div class="leave-type">EL</div>
                  <div class="leave-count" id="elBalance">0.00</div>
                  <div class="leave-label">Balance</div>
                </div>
                <div class="leave-type-item" data-type="SL">
                  <div class="leave-type">SL</div>
                  <div class="leave-count" id="slBalance">0.00</div>
                  <div class="leave-label">Balance</div>
                </div>
              </div>
            </div>
          </div>
        \`
      ];
    }

    function renderCardSlider() {
      const cards = createCards();
      cardSlider.innerHTML = cards.join('') + \`
        <div class="slider-dots">
          <div class="dot active"></div>
          <div class="dot"></div>
          <div class="dot"></div>
        </div>
      \`;
    }

    // Initial render
    renderCardSlider();

    // Insert slider after header
    document.body.insertBefore(cardSlider, document.body.firstChild.nextSibling);

    // Add auto-sliding functionality
    let currentCard = 0;
    const totalCards = 2;

    function slideToCard(index) {
      const cardWidth = cardSlider.querySelector('.slider-card').offsetWidth + 12; // card width + margin
      cardSlider.scrollTo({
        left: cardWidth * index,
        behavior: 'smooth'
      });

      // Update dots
      const dots = cardSlider.querySelectorAll('.dot');
      dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
      });
    }

    // Auto slide every 3 seconds
    setInterval(() => {
      currentCard = (currentCard + 1) % totalCards;
      slideToCard(currentCard);
    }, 3000);

    // Manual sliding with dots
    const dots = cardSlider.querySelectorAll('.dot');
    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        currentCard = index;
        slideToCard(currentCard);
      });
    });

    // Update time every minute
    setInterval(() => {
      renderCardSlider();
    }, 60000);
  }

  // Add observer to watch for employee name element
  const observer = new MutationObserver((mutations, obs) => {
    const employeeNameElement = document.querySelector('.user-profile span[id*="lblemployeename"]');
    if (employeeNameElement) {
      const greetingElement = document.querySelector('.greeting');
      if (greetingElement) {
        greetingElement.textContent = \`\${getGreeting()}, \${EmployeeAPI.getName() || 'User'}\`;
      }
      obs.disconnect();
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

  // Update greeting periodically
  setInterval(() => {
    const greetingElement = document.querySelector('.greeting');
    if (greetingElement) {
      greetingElement.textContent = \`\${getGreeting()}, \${EmployeeAPI.getName() || 'User'}\`;
    }
  }, 1000);

  // Add Font Awesome if not already present
  if (!document.querySelector('link[href*="font-awesome"]')) {
    const fontAwesome = document.createElement('link');
    fontAwesome.rel = 'stylesheet';
    fontAwesome.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css';
    document.head.appendChild(fontAwesome);
  }

  // Add profile menu toggle functionality
  const profileBtn = document.getElementById('profileBtn');
  const profileMenu = document.getElementById('profileMenu');

  profileBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    profileMenu.classList.toggle('show');
  });

  document.addEventListener('click', (e) => {
    if (!profileMenu.contains(e.target)) {
      profileMenu.classList.remove('show');
    }
  });
})();
`;
