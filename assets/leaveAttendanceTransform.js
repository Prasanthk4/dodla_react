// Leave Attendance page transformation script
export const leaveAttendanceTransform = `
(function() {
  // Remove default elements
  document.querySelector('.nav_menu')?.remove();
  document.querySelector('.footer')?.remove();
  document.querySelector('.sidebar-footer')?.remove();
  document.querySelector('.left_col')?.remove();

  // Remove existing styles that might conflict
  document.querySelectorAll('style').forEach(style => {
    if (style.textContent.includes('x_panel') || style.textContent.includes('x_title')) {
      style.remove();
    }
  });

  // Create and inject custom styles
  const style = document.createElement('style');
  style.textContent = \`
    body {
      background: #F5F7FA !important;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
    }

    .right_col {
      margin: 0 !important;
      padding: 16px !important;
      background: #F5F7FA !important;
    }

    /* Header Styling */
    .page-title {
      position: relative;
      text-align: left;
      padding: 24px 32px;
      margin-bottom: 32px;
      background: white !important;
      border-radius: 12px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
      border-left: 4px solid #2C5282;
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .page-title::before {
      content: '';
      position: absolute;
      top: 0;
      right: 0;
      width: 120px;
      height: 100%;
      background: linear-gradient(135deg, transparent, rgba(44, 82, 130, 0.05));
      border-radius: 0 12px 12px 0;
    }

    .page-title i {
      font-size: 24px;
      color: #2C5282;
    }

    .page-title h2 {
      color: #2D3748 !important;
      font-size: 22px !important;
      font-weight: 600 !important;
      margin: 0 !important;
      letter-spacing: 0.3px !important;
      position: relative;
      z-index: 1;
    }

    /* Section Containers */
    .section-container {
      background: white;
      border-radius: 12px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
      padding: 24px;
      margin-bottom: 24px;
      border: 1px solid #E2E8F0;
    }

    .section-title {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 20px;
      padding-bottom: 12px;
      border-bottom: 2px solid #E2E8F0;
    }

    .section-title h3 {
      color: #2D3748;
      font-size: 18px;
      font-weight: 600;
      margin: 0;
    }

    /* Menu Items Grid */
    .menu-items {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 16px;
      padding: 8px;
    }

    /* Menu Item Card */
    .menu-item {
      background: white;
      border-radius: 8px;
      padding: 16px;
      transition: all 0.2s ease;
      border: 1px solid #E2E8F0;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .menu-item:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
      border-color: #2C5282;
      background: #F8FAFC;
    }

    /* Icons for menu items */
    .icon-container {
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 8px;
      background: #2C5282;
      margin-right: 12px;
      transition: all 0.2s ease;
    }

    .menu-item:hover .icon-container {
      background: #1A365D;
    }

    .icon-container i {
      color: white;
      font-size: 16px;
    }

    .menu-item span {
      color: #2D3748;
      font-weight: 500;
      font-size: 14px;
    }

    /* Form Styles */
    .x_title {
      display: none !important;
    }

    .x_panel {
      background: white !important;
      border-radius: 12px !important;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05) !important;
      padding: 28px !important;
      margin: 16px !important;
      border: 1px solid #E2E8F0 !important;
    }

    .x_content {
      padding: 0 !important;
      margin: 0 !important;
    }

    /* Form Fields */
    .x_panel input[type="text"],
    .x_panel input[type="password"],
    .x_panel input[type="email"],
    .x_panel input[type="number"],
    .x_panel input[type="date"],
    .x_panel input[type="time"],
    .x_panel select,
    .x_panel textarea {
      width: 100% !important;
      padding: 10px 16px !important;
      margin: 6px 0 16px 0 !important;
      border: 1px solid #E2E8F0 !important;
      border-radius: 8px !important;
      font-size: 14px !important;
      color: #2D3748 !important;
      background-color: white !important;
      transition: all 0.2s ease !important;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05) !important;
    }

    .x_panel input:focus,
    .x_panel select:focus,
    .x_panel textarea:focus {
      outline: none !important;
      border-color: #2C5282 !important;
      box-shadow: 0 0 0 3px rgba(44, 82, 130, 0.1) !important;
    }

    /* Form Labels */
    .x_panel label {
      display: block !important;
      margin: 0 0 6px 0 !important;
      color: #4A5568 !important;
      font-size: 14px !important;
      font-weight: 500 !important;
      letter-spacing: 0.3px !important;
    }

    /* Form Groups */
    .x_panel .form-group {
      margin-bottom: 20px !important;
    }

    /* Buttons */
    .x_panel .btn,
    .x_panel button,
    .x_panel input[type="submit"],
    .x_panel input[type="button"] {
      display: inline-flex !important;
      align-items: center !important;
      justify-content: center !important;
      padding: 10px 20px !important;
      border-radius: 8px !important;
      font-size: 14px !important;
      font-weight: 500 !important;
      cursor: pointer !important;
      transition: all 0.2s ease !important;
      border: none !important;
      gap: 8px !important;
      min-width: 120px !important;
    }

    /* Primary Button */
    .x_panel .btn-primary,
    .x_panel input[type="submit"] {
      background: #2C5282 !important;
      color: white !important;
    }

    .x_panel .btn-primary:hover,
    .x_panel input[type="submit"]:hover {
      background: #1A365D !important;
      transform: translateY(-1px) !important;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1) !important;
    }

    /* Secondary Button */
    .x_panel .btn-secondary,
    .x_panel input[type="button"] {
      background: #EDF2F7 !important;
      color: #2D3748 !important;
    }

    .x_panel .btn-secondary:hover,
    .x_panel input[type="button"]:hover {
      background: #E2E8F0 !important;
      transform: translateY(-1px) !important;
    }

    /* Tables in Forms */
    .x_panel table {
      width: 100% !important;
      border-collapse: separate !important;
      border-spacing: 0 !important;
      margin: 16px 0 !important;
      border-radius: 8px !important;
      overflow: hidden !important;
    }

    .x_panel th {
      background: #F8FAFC !important;
      color: #2D3748 !important;
      font-weight: 600 !important;
      padding: 12px 16px !important;
      text-align: left !important;
      border-bottom: 2px solid #E2E8F0 !important;
      font-size: 14px !important;
    }

    .x_panel td {
      padding: 12px 16px !important;
      border-bottom: 1px solid #E2E8F0 !important;
      color: #4A5568 !important;
      font-size: 14px !important;
    }

    .x_panel tr:last-child td {
      border-bottom: none !important;
    }

    .x_panel tr:hover td {
      background: #F8FAFC !important;
    }

    /* Checkboxes and Radios */
    .x_panel input[type="checkbox"],
    .x_panel input[type="radio"] {
      width: 16px !important;
      height: 16px !important;
      margin-right: 8px !important;
      vertical-align: middle !important;
    }

    /* Form Grid */
    .x_panel .row {
      display: flex !important;
      flex-wrap: wrap !important;
      margin: 0 -12px !important;
    }

    .x_panel .col,
    .x_panel [class*="col-"] {
      padding: 0 12px !important;
    }

    /* Required Fields */
    .x_panel .required:after {
      content: "*" !important;
      color: #E53E3E !important;
      margin-left: 4px !important;
    }

    /* Help Text */
    .x_panel .help-block {
      font-size: 12px !important;
      color: #718096 !important;
      margin-top: 4px !important;
    }

    /* Validation States */
    .x_panel .has-error input,
    .x_panel .has-error select,
    .x_panel .has-error textarea {
      border-color: #E53E3E !important;
    }

    .x_panel .error-message {
      color: #E53E3E !important;
      font-size: 12px !important;
      margin-top: 4px !important;
    }

    /* Success States */
    .x_panel .has-success input,
    .x_panel .has-success select,
    .x_panel .has-success textarea {
      border-color: #38A169 !important;
    }

    @media (max-width: 768px) {
      .x_panel {
        padding: 20px !important;
        margin: 12px !important;
      }

      .x_panel input,
      .x_panel select,
      .x_panel textarea {
        font-size: 16px !important;
        padding: 12px !important;
      }

      .x_panel .btn,
      .x_panel button,
      .x_panel input[type="submit"],
      .x_panel input[type="button"] {
        width: 100% !important;
        margin-bottom: 8px !important;
      }

      .x_panel .row {
        margin: 0 -8px !important;
      }

      .x_panel .col,
      .x_panel [class*="col-"] {
        padding: 0 8px !important;
      }
    }

    @media (max-width: 768px) {
      .page-title {
        margin: 0 8px 24px 8px;
      }

      .page-title h2 {
        font-size: 20px !important;
      }

      .section-container {
        margin: 0 8px 24px 8px;
      }

      .menu-item {
        padding: 14px;
      }

      .icon-container {
        width: 36px;
        height: 36px;
      }

      .menu-item span {
        font-size: 13px;
      }

      .x_panel {
        margin: 8px !important;
        padding: 16px !important;
      }
    }
  \`;

  // Add our styles
  document.head.appendChild(style);

  // Create main container
  const mainContent = document.createElement('div');
  mainContent.innerHTML = \`
    <div class="page-title">
      <i class="fas fa-clipboard-list"></i>
      <h2>Leave & Attendance Management</h2>
    </div>

    <div class="section-container">
      <div class="section-title">
        <div class="icon-container">
          <i class="fas fa-file-alt"></i>
        </div>
        <h3>Requisitions</h3>
      </div>
      <div class="menu-items">
        <div class="menu-item" onclick="window.location.href='AttendanceRequest.aspx'">
          <div class="icon-container">
            <i class="fas fa-clock"></i>
          </div>
          <span>Attendance Regularisation</span>
        </div>
        <div class="menu-item" onclick="window.location.href='pgpreapproval.aspx'">
          <div class="icon-container">
            <i class="fas fa-calendar-check"></i>
          </div>
          <span>Request C-Off/ROH</span>
        </div>
        <div class="menu-item" onclick="window.location.href='pgleaveapplicationnew.aspx'">
          <div class="icon-container">
            <i class="fas fa-plane-departure"></i>
          </div>
          <span>Leave/On Duty</span>
        </div>
        <div class="menu-item" onclick="window.location.href='HourbasedPermission.aspx'">
          <div class="icon-container">
            <i class="fas fa-hourglass-half"></i>
          </div>
          <span>Hour Based OnDuty</span>
        </div>
      </div>
    </div>

    <div class="section-container">
      <div class="section-title">
        <div class="icon-container">
          <i class="fas fa-chart-bar"></i>
        </div>
        <h3>Reports</h3>
      </div>
      <div class="menu-items">
        <div class="menu-item" onclick="window.location.href='pgtimecardreporttotalemp.aspx'">
          <div class="icon-container">
            <i class="fas fa-id-card"></i>
          </div>
          <span>My Time Card</span>
        </div>
        <div class="menu-item" onclick="window.location.href='pgTimeCardReport.aspx'">
          <div class="icon-container">
            <i class="fas fa-file-alt"></i>
          </div>
          <span>My Reports</span>
        </div>
      </div>
    </div>
  \`;

  // Replace the existing content
  const rightCol = document.querySelector('.right_col');
  if (rightCol) {
    rightCol.innerHTML = '';
    rightCol.appendChild(mainContent);
  }

  // Add Font Awesome for icons
  const fontAwesome = document.createElement('link');
  fontAwesome.rel = 'stylesheet';
  fontAwesome.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css';
  document.head.appendChild(fontAwesome);

  // Function to remove x_title elements
  function removeXTitles() {
    document.querySelectorAll('.x_title').forEach(el => el.remove());
  }

  // Initial cleanup and setup observers
  removeXTitles();
  const observer = new MutationObserver(removeXTitles);
  observer.observe(document.body, { childList: true, subtree: true });
  setTimeout(removeXTitles, 500);
})();
true;
`;
