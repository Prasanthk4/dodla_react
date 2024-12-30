// Profile page transformation script
export const profilePageTransform = `
(function() {
  function initializeProfilePage() {
    let cleanupFunctions = [];

    // Optimize performance by creating styles once
    const createStyles = () => {
      const existingStyle = document.getElementById('profile-custom-styles');
      if (existingStyle) return; // Don't create styles if they already exist

      const styleElement = document.createElement('style');
      styleElement.id = 'profile-custom-styles';
      styleElement.textContent = \`
        body {
          background: #f8fafc !important;
          min-height: 100vh !important;
          position: relative !important;
        }

        .right_col {
          padding: 0 !important;
          background: #f8fafc !important;
          min-height: 100vh !important;
          padding-bottom: 0 !important;
          margin-bottom: 0 !important;
        }

        .custom-header {
          background: white !important;
          padding: 0 !important;
          margin: 0 !important;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1) !important;
          position: relative !important;
        }

        .profile-banner {
          background: linear-gradient(135deg, #4f46e5, #818cf8) !important;
          padding: 30px 20px 50px !important;
          color: white !important;
          display: flex !important;
          align-items: center !important;
          gap: 16px !important;
          position: relative !important;
          margin-bottom: -30px !important;
          border-radius: 0 0 25px 25px !important;
          box-shadow: 0 10px 30px -10px rgba(79, 70, 229, 0.3) !important;
          overflow: hidden !important;
        }

        .profile-banner::before {
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

        .profile-avatar {
          width: 60px !important;
          height: 60px !important;
          background: rgba(255, 255, 255, 0.2) !important;
          border-radius: 50% !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          font-size: 30px !important;
          position: relative !important;
          z-index: 1 !important;
          box-shadow: 
            0 4px 12px rgba(0, 0, 0, 0.1),
            inset 0 2px 4px rgba(255, 255, 255, 0.2) !important;
          backdrop-filter: blur(8px) !important;
          -webkit-backdrop-filter: blur(8px) !important;
        }

        .profile-info {
          position: relative !important;
          z-index: 1 !important;
        }

        .profile-info h1 {
          font-size: 24px !important;
          font-weight: 600 !important;
          margin: 0 0 2px 0 !important;
          color: white !important;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1) !important;
        }

        .profile-info p {
          font-size: 14px !important;
          margin: 0 !important;
          opacity: 0.9 !important;
          color: rgba(255, 255, 255, 0.9) !important;
        }

        .content-wrapper {
          background: #f8fafc !important;
          border-radius: 25px 25px 0 0 !important;
          margin-top: -25px !important;
          padding: 30px 20px !important;
          position: relative !important;
          z-index: 2 !important;
        }

        .section-title {
          font-size: 24px !important;
          font-weight: 600 !important;
          color: #1f2937 !important;
          margin-bottom: 24px !important;
          padding-left: 4px !important;
        }

        .buttons-grid {
          display: grid !important;
          grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)) !important;
          gap: 16px !important;
        }

        .profile-action-tile {
          background: white !important;
          border-radius: 12px !important;
          padding: 16px !important;
          display: flex !important;
          flex-direction: column !important;
          align-items: center !important;
          gap: 12px !important;
          cursor: pointer !important;
          transition: all 0.2s !important;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1) !important;
        }

        .profile-action-tile:hover {
          transform: translateY(-2px) !important;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1) !important;
        }

        .icon-wrapper {
          width: 40px !important;
          height: 40px !important;
          border-radius: 10px !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          font-size: 18px !important;
          color: white !important;
          transition: all 0.2s !important;
        }

        .icon-wrapper.employment { background: linear-gradient(135deg, #0891b2, #22d3ee) !important; }
        .icon-wrapper.personal { background: linear-gradient(135deg, #4f46e5, #818cf8) !important; }
        .icon-wrapper.national { background: linear-gradient(135deg, #059669, #34d399) !important; }
        .icon-wrapper.education { background: linear-gradient(135deg, #7c3aed, #a78bfa) !important; }
        .icon-wrapper.experience { background: linear-gradient(135deg, #ea580c, #fb923c) !important; }
        .icon-wrapper.family { background: linear-gradient(135deg, #be185d, #f472b6) !important; }
        .icon-wrapper.default { background: linear-gradient(135deg, #6b7280, #9ca3af) !important; }

        .title-wrapper {
          font-size: 13px !important;
          font-weight: 500 !important;
          color: #1f2937 !important;
          text-align: center !important;
          line-height: 1.2 !important;
        }

        /* Hidden Buttons */
        .profile-action-tile.hidden {
          background-color: #f8fafc !important;
          box-shadow: none !important;
          pointer-events: none !important;
          opacity: 0 !important;
          margin: 0 !important;
          padding: 0 !important;
          height: 0 !important;
          min-height: 0 !important;
          overflow: hidden !important;
        }

        .profile-action-tile.hidden .icon-wrapper,
        .profile-action-tile.hidden .title-wrapper {
          display: none !important;
        }

        /* Hide original elements */
        .nav_menu, .top_nav, .footer, .site_title {
          display: none !important;
        }

        /* Cover the footer area */
        .main_container {
          padding-bottom: 0 !important;
          margin-bottom: 0 !important;
        }

        /* Add a white container that extends to bottom */
        .profile-action-buttons {
          background: white !important;
          min-height: calc(100vh - 200px) !important;
          margin-bottom: 0 !important;
          padding-bottom: 40px !important;
          position: relative !important;
          z-index: 2 !important;
        }

        /* Cover any remaining footer */
        body:after {
          content: '' !important;
          position: fixed !important;
          bottom: 0 !important;
          left: 0 !important;
          right: 0 !important;
          height: 60px !important;
          background: #f8fafc !important;
          z-index: 1 !important;
        }

        /* Responsive adjustments */
        @media (max-width: 768px) {
          .profile-banner {
            padding: 25px 20px 40px !important;
            margin-bottom: -25px !important;
          }

          .profile-avatar {
            width: 50px !important;
            height: 50px !important;
            font-size: 25px !important;
          }

          .profile-info h1 {
            font-size: 20px !important;
          }

          .profile-info p {
            font-size: 13px !important;
          }

          .content-wrapper {
            padding: 25px 16px !important;
          }

          .section-title {
            font-size: 20px !important;
            margin-bottom: 20px !important;
          }

          .buttons-grid {
            grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)) !important;
            gap: 12px !important;
          }
        }

        /* Modern page layout */
        .form-page {
          background: white !important;
          padding: 20px !important;
        }

        .page-title {
          font-size: 24px !important;
          font-weight: 600 !important;
          color: #1f2937 !important;
          margin: 16px 24px !important;
          padding: 0 !important;
        }

        /* Info card style */
        .form-container td {
          background: none !important;
          box-shadow: none !important;
          border: none !important;
          border-radius: 0 !important;
          padding: 12px 0 !important;
        }

        /* Label and input container */
        .form-container td > div {
          display: flex !important;
          flex-direction: column !important;
          gap: 4px !important;
        }

        /* Label styling */
        .form-container label {
          color: #6b7280 !important;
          font-size: 13px !important;
          text-transform: uppercase !important;
          letter-spacing: 0.5px !important;
          margin: 0 !important;
        }

        /* Input styling */
        .form-container input {
          border: none !important;
          background: none !important;
          padding: 4px 0 !important;
          font-size: 15px !important;
          color: #1f2937 !important;
        }

        /* Back button styling */
        .back-button {
          margin: 0 !important;
          padding: 16px 24px !important;
          background: white !important;
          border: none !important;
          color: #4f46e5 !important;
          font-size: 15px !important;
          font-weight: 500 !important;
          display: flex !important;
          align-items: center !important;
          gap: 8px !important;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05) !important;
        }

        /* Remove extra spacing */
        .x_panel, .x_title, .x_content {
          background: none !important;
          box-shadow: none !important;
          border: none !important;
          padding: 0 !important;
          margin: 0 !important;
        }

        .clearfix, br {
          display: none !important;
        }

        /* Responsive design */
        @media (max-width: 768px) {
          .form-container td {
            flex: 1 1 100% !important;
            min-width: 100% !important;
          }

          .form-container tr {
            gap: 16px !important;
          }

          .page-title {
            font-size: 24px !important;
            padding: 0 16px !important;
          }

          .form-container table {
            padding: 0 16px !important;
          }
        }

        /* Remove any fixed positioning */
        #wrapper {
          position: static !important;
        }

        .main_container {
          position: static !important;
        }

        /* Hide scrollbars but keep functionality */
        ::-webkit-scrollbar {
          width: 0px !important;
          background: transparent !important;
        }

        /* Employment Information Form */
        .employment-info-form td {
          padding: 12px 8px !important;
          border-bottom: 1px solid #f3f4f6 !important;
        }

        .employment-info-form tr:last-child td {
          border-bottom: none !important;
        }

        .employment-info-form label,
        .employment-info-form td:first-child {
          font-size: 13px !important;
          text-transform: uppercase !important;
          letter-spacing: 0.5px !important;
          color: #4f46e5 !important;
        }

        /* Input field styling */
        .employment-info-form input[type="text"] {
          border: none !important;
          background: transparent !important;
          font-size: 15px !important;
          color: #1f2937 !important;
          padding: 4px 0 !important;
          width: 100% !important;
        }

        /* Section headers */
        .x_title {
          padding: 15px !important;
          margin-bottom: 20px !important;
          background-color: #f8fafc !important;
          border-bottom: 2px solid #4f46e5 !important;
        }

        .x_title h2 {
          color: #1f2937 !important;
          font-size: 18px !important;
          font-weight: 600 !important;
          margin: 0 !important;
        }

        /* Table styling */
        .employment-info-form table {
          width: 100% !important;
          border-collapse: collapse !important;
        }

        /* Remove extra elements */
        .x_panel, .x_content {
          padding: 0 !important;
          margin: 0 !important;
          border: none !important;
          box-shadow: none !important;
          background: white !important;
        }

        .clearfix, br {
          display: none !important;
        }

        /* Modern Card Design */
        .form-page {
          background: #f8fafc !important;
          padding: 16px !important;
        }

        /* Form Container */
        .employment-info-form {
          background: white !important;
          border-radius: 12px !important;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06) !important;
          padding: 20px !important;
          margin: 10px !important;
        }

        /* Field Container */
        .employment-info-form td {
          padding: 16px !important;
          margin: 8px 0 !important;
          border-radius: 8px !important;
          background: linear-gradient(145deg, #ffffff, #f8fafc) !important;
          box-shadow: 3px 3px 6px #e5e7eb, -3px -3px 6px #ffffff !important;
          transition: all 0.3s ease !important;
        }

        /* Label Styling */
        .employment-info-form td:first-child {
          font-size: 14px !important;
          font-weight: 600 !important;
          color: #4f46e5 !important;
          text-transform: uppercase !important;
          letter-spacing: 0.5px !important;
          padding-left: 35px !important;
          position: relative !important;
        }

        /* Input Styling */
        .employment-info-form input[type="text"] {
          border: none !important;
          background: transparent !important;
          font-size: 16px !important;
          color: #1f2937 !important;
          padding: 8px 12px !important;
          width: 100% !important;
          font-weight: 500 !important;
        }

        /* Section Title */
        .x_title {
          background: linear-gradient(135deg, #4f46e5, #6366f1) !important;
          padding: 20px !important;
          border-radius: 12px !important;
          margin-bottom: 24px !important;
          box-shadow: 0 4px 6px -1px rgba(79, 70, 229, 0.2) !important;
        }

        .x_title h2 {
          color: white !important;
          font-size: 20px !important;
          font-weight: 600 !important;
          margin: 0 !important;
          text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1) !important;
        }

        /* CSS-based Icons */
        .employment-info-form td:first-child::before {
          content: '' !important;
          position: absolute !important;
          left: 12px !important;
          top: 50% !important;
          transform: translateY(-50%) !important;
          width: 16px !important;
          height: 16px !important;
          background-color: #4f46e5 !important;
          mask-size: cover !important;
          -webkit-mask-size: cover !important;
        }

        /* Icon for Employee Code */
        .employment-info-form tr:nth-child(1) td:first-child::before {
          mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2z'/%3E%3C/svg%3E") !important;
          -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2z'/%3E%3C/svg%3E") !important;
        }

        /* Hover Effects */
        .employment-info-form td:hover {
          transform: translateY(-2px) !important;
          box-shadow: 4px 4px 8px #e5e7eb, -4px -4px 8px #ffffff !important;
        }

        /* Remove unwanted styles */
        .clearfix, br {
          display: none !important;
        }

        /* Table Layout */
        .employment-info-form table {
          width: 100% !important;
          border-collapse: separate !important;
          border-spacing: 0 12px !important;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .employment-info-form td {
            padding: 12px !important;
          }
          .employment-info-form td:first-child {
            padding-left: 30px !important;
          }
        }

        /* Additional Field Icons */
        .employment-info-form tr:nth-child(2) td:first-child::before {
          mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z'/%3E%3C/svg%3E") !important;
          -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z'/%3E%3C/svg%3E") !important;
        }

        .employment-info-form tr:nth-child(3) td:first-child::before {
          mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v-2h-2v-2h2v-2h-2V9h8v10z'/%3E%3C/svg%3E") !important;
          -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v-2h-2v-2h2v-2h-2V9h8v10z'/%3E%3C/svg%3E") !important;
        }

        .employment-info-form tr:nth-child(4) td:first-child::before {
          mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V8l8 5 8-5v10zm-8-7L4 6h16l-8 5z'/%3E%3C/svg%3E") !important;
          -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V8l8 5 8-5v10zm-8-7L4 6h16l-8 5z'/%3E%3C/svg%3E") !important;
        }

        /* Enhanced Field Styling */
        .employment-info-form td:nth-child(2) {
          background: linear-gradient(145deg, #ffffff, #f8fafc) !important;
          border-left: 4px solid #4f46e5 !important;
        }

        /* Active State */
        .employment-info-form td:active {
          transform: scale(0.98) !important;
          box-shadow: 2px 2px 4px #e5e7eb, -2px -2px 4px #ffffff !important;
        }

        /* Title Enhancement */
        .x_title {
          position: relative !important;
          overflow: hidden !important;
        }

        .x_title::after {
          content: '' !important;
          position: absolute !important;
          top: 0 !important;
          left: 0 !important;
          width: 100% !important;
          height: 100% !important;
          background: linear-gradient(45deg, transparent 0%, rgba(255, 255, 255, 0.1) 50%, transparent 100%) !important;
          animation: shine 2s infinite !important;
        }

        @keyframes shine {
          0% {
            transform: translateX(-100%) !important;
          }
          100% {
            transform: translateX(100%) !important;
          }
        }

        /* Form Styles */
        .form-control, select, input {
          height: 48px !important;
          padding: 12px 16px !important;
          font-size: 16px !important;
          border-radius: 12px !important;
          border: 1px solid #e2e8f0 !important;
          background-color: white !important;
          width: 100% !important;
          color: #1f2937 !important;
          appearance: none !important;
          -webkit-appearance: none !important;
          -moz-appearance: none !important;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E") !important;
          background-repeat: no-repeat !important;
          background-position: right 12px center !important;
          background-size: 20px !important;
          transition: all 0.2s ease-in-out !important;
        }

        select {
          padding-right: 40px !important;
        }

        .form-control:focus, select:focus, input:focus {
          outline: none !important;
          border-color: #4f46e5 !important;
          box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1) !important;
        }

        /* Form Labels */
        label, td:first-child {
          font-size: 16px !important;
          font-weight: 500 !important;
          color: #4b5563 !important;
          margin-bottom: 8px !important;
          display: block !important;
        }

        /* Form Groups */
        .form-group, tr {
          margin-bottom: 24px !important;
          display: block !important;
        }

        td {
          display: block !important;
          width: 100% !important;
          padding: 0 !important;
          margin-bottom: 8px !important;
        }

        /* Mobile Optimizations */
        @media (max-width: 768px) {
          .form-control, select, input {
            height: 52px !important;
            font-size: 16px !important;
          }

          label, td:first-child {
            font-size: 15px !important;
          }

          .form-group, tr {
            margin-bottom: 20px !important;
          }
        }

        /* Form Page Styles */
        .form-page {
          background: #f8fafc !important;
          min-height: 100vh !important;
          padding: 20px !important;
        }

        .form-container {
          background: white !important;
          border-radius: 24px !important;
          padding: 24px !important;
          max-width: 800px !important;
          margin: 0 auto !important;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05) !important;
        }

        /* Section Titles */
        .x_title {
          border: none !important;
          padding: 0 0 20px 0 !important;
          margin-bottom: 24px !important;
          border-bottom: 2px solid #e2e8f0 !important;
          display: flex !important;
          align-items: center !important;
          gap: 12px !important;
        }

        .x_title h2 {
          font-size: 20px !important;
          font-weight: 600 !important;
          color: #1f2937 !important;
          margin: 0 !important;
          padding: 0 !important;
        }

        /* Form Groups */
        .form-group {
          background: #f8fafc !important;
          border-radius: 16px !important;
          padding: 20px !important;
          margin-bottom: 20px !important;
          border: 1px solid #e2e8f0 !important;
          transition: all 0.2s ease-in-out !important;
        }

        .form-group:hover {
          border-color: #cbd5e1 !important;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03) !important;
        }

        /* Labels */
        label, td:first-child {
          font-size: 15px !important;
          font-weight: 500 !important;
          color: #64748b !important;
          margin-bottom: 8px !important;
          display: block !important;
          letter-spacing: 0.3px !important;
        }

        /* Required Fields */
        .required::after {
          content: '*' !important;
          color: #ef4444 !important;
          margin-left: 4px !important;
        }

        /* Form Controls */
        .form-control, select, input:not([type="checkbox"]):not([type="radio"]) {
          height: 48px !important;
          padding: 12px 16px !important;
          font-size: 15px !important;
          border-radius: 12px !important;
          border: 1px solid #e2e8f0 !important;
          background-color: white !important;
          width: 100% !important;
          color: #1f2937 !important;
          transition: all 0.2s ease-in-out !important;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05) !important;
        }

        /* Checkboxes and Radios */
        input[type="checkbox"], input[type="radio"] {
          width: 20px !important;
          height: 20px !important;
          margin-right: 8px !important;
          accent-color: #4f46e5 !important;
        }

        /* Focus States */
        .form-control:focus, select:focus, input:focus {
          outline: none !important;
          border-color: #4f46e5 !important;
          box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1) !important;
        }

        /* Buttons */
        .btn-primary, .btn-success {
          height: 48px !important;
          padding: 0 24px !important;
          font-size: 16px !important;
          font-weight: 500 !important;
          border-radius: 12px !important;
          background: #4f46e5 !important;
          color: white !important;
          border: none !important;
          cursor: pointer !important;
          transition: all 0.2s ease-in-out !important;
          box-shadow: 0 2px 4px rgba(79, 70, 229, 0.1) !important;
        }

        .btn-primary:hover, .btn-success:hover {
          background: #4338ca !important;
          transform: translateY(-1px) !important;
          box-shadow: 0 4px 8px rgba(79, 70, 229, 0.2) !important;
        }

        /* Table Layout */
        table {
          width: 100% !important;
          border-collapse: separate !important;
          border-spacing: 0 16px !important;
        }

        tr {
          margin-bottom: 0 !important;
        }

        td {
          padding: 0 12px !important;
        }

        /* Mobile Optimizations */
        @media (max-width: 768px) {
          .form-container {
            padding: 20px !important;
            border-radius: 20px !important;
          }

          .form-group {
            padding: 16px !important;
            border-radius: 12px !important;
          }

          .x_title {
            padding-bottom: 16px !important;
            margin-bottom: 20px !important;
          }

          .x_title h2 {
            font-size: 18px !important;
          }
        }

        /* Form Styles */
        .form-control, select, input {
          height: 48px !important;
          padding: 12px 16px !important;
          font-size: 16px !important;
          border-radius: 12px !important;
          border: 1px solid #e2e8f0 !important;
          background-color: white !important;
          width: 100% !important;
          color: #1f2937 !important;
          appearance: none !important;
          -webkit-appearance: none !important;
          -moz-appearance: none !important;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E") !important;
          background-repeat: no-repeat !important;
          background-position: right 12px center !important;
          background-size: 20px !important;
          transition: all 0.2s ease-in-out !important;
        }

        select {
          padding-right: 40px !important;
        }

        .form-control:focus, select:focus, input:focus {
          outline: none !important;
          border-color: #4f46e5 !important;
          box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1) !important;
        }

        /* Form Labels */
        label, td:first-child {
          font-size: 16px !important;
          font-weight: 500 !important;
          color: #4b5563 !important;
          margin-bottom: 8px !important;
          display: block !important;
        }

        /* Form Groups */
        .form-group, tr {
          margin-bottom: 24px !important;
          display: block !important;
        }

        td {
          display: block !important;
          width: 100% !important;
          padding: 0 !important;
          margin-bottom: 8px !important;
        }

        /* Mobile Optimizations */
        @media (max-width: 768px) {
          .form-control, select, input {
            height: 52px !important;
            font-size: 16px !important;
          }

          label, td:first-child {
            font-size: 15px !important;
          }

          .form-group, tr {
            margin-bottom: 20px !important;
          }
        }
      \`;
      document.head.appendChild(styleElement);
    };

    // Optimize DOM operations
    const transformPage = () => {
      // Create styles only once
      createStyles();

      // Cache DOM queries
      const container = document.querySelector('.right_col');
      if (!container) return;

      // Remove unnecessary elements immediately
      const elementsToRemove = container.querySelectorAll('.nav_menu, .top_nav, .footer, .site_title, .clearfix');
      elementsToRemove.forEach(el => el.remove());

      // Add classes in batch
      container.classList.add('form-page');
      
      // Use more efficient selectors
      const tables = container.getElementsByTagName('table');
      Array.from(tables).forEach(table => {
        table.closest('.form-container')?.classList.add('modern-form');
      });

      // Auto-click all close buttons when page loads
      function closeAllPanels() {
        const closeButtons = document.querySelectorAll('.close-link, .fa-close');
        closeButtons.forEach(button => {
          button.click();
        });
      }

      // Initial close attempt
      closeAllPanels();

      // Keep trying in case content loads dynamically
      let closeAttempts = 0;
      const closeInterval = setInterval(() => {
        closeAllPanels();
        closeAttempts++;
        if (closeAttempts >= 5) {  // Try 5 times over 2.5 seconds
          clearInterval(closeInterval);
        }
      }, 500);
      
      // Find the sidebar menu items
      const sidebarMenu = document.querySelector('.nav.side-menu');
      
      if (!sidebarMenu) {
        console.log('Menu not found, retrying...');
        setTimeout(transformPage, 500);
        return;
      }

      // Create and insert header
      const mainContent = document.querySelector('.right_col');
      if (mainContent) {
        // Remove existing header if any
        const existingHeader = document.querySelector('.custom-header');
        if (existingHeader) {
          existingHeader.remove();
        }

        // Create new header
        const header = document.createElement('div');
        header.className = 'custom-header';
        
        // Get username from the page
        const usernameElement = document.querySelector('.profile_info span');
        const username = usernameElement ? usernameElement.textContent.trim() : '';
        
        header.innerHTML = \`
          <div class="profile-banner">
            <div class="profile-avatar">
              <i class="fa fa-user-circle"></i>
            </div>
            <div class="profile-info">
              <h1>\${username}</h1>
              <p>My Profile</p>
            </div>
          </div>
        \`;

        mainContent.insertBefore(header, mainContent.firstChild);
      }

      // Create container for buttons
      let buttonContainer = document.querySelector('.profile-action-buttons');
      if (!buttonContainer) {
        buttonContainer = document.createElement('div');
        buttonContainer.className = 'profile-action-buttons';
        
        // Create a wrapper for better layout
        const contentWrapper = document.createElement('div');
        contentWrapper.className = 'content-wrapper';
        contentWrapper.innerHTML = \`
          <div class="section-title">Profile Settings</div>
          <div class="buttons-grid"></div>
        \`;
        
        buttonContainer.appendChild(contentWrapper);

        // Insert after the header
        const header = document.querySelector('.custom-header');
        if (header) {
          header.parentNode.insertBefore(buttonContainer, header.nextSibling);
        }
      }

      // Clear existing buttons
      const buttonsGrid = buttonContainer.querySelector('.buttons-grid');
      if (buttonsGrid) {
        buttonsGrid.innerHTML = '';
      }

      // Function to create button
      function createButton(link) {
        const button = document.createElement('div');
        button.className = 'profile-action-tile';
        
        const href = link.getAttribute('href');
        const text = link.textContent.trim();
        
        let iconClass = 'fa-solid fa-user';
        let colorClass = 'default';

        if (text.toLowerCase().includes('employment')) {
          iconClass = 'fa-solid fa-briefcase';
          colorClass = 'employment';
        } else if (text.toLowerCase().includes('personal')) {
          iconClass = 'fa-solid fa-address-card';
          colorClass = 'personal';
        } else if (text.toLowerCase().includes('national')) {
          iconClass = 'fa-solid fa-id-card';
          colorClass = 'national';
        } else if (text.toLowerCase().includes('education')) {
          iconClass = 'fa-solid fa-graduation-cap';
          colorClass = 'education';
        } else if (text.toLowerCase().includes('experience')) {
          iconClass = 'fa-solid fa-business-time';
          colorClass = 'experience';
        } else if (text.toLowerCase().includes('family')) {
          iconClass = 'fa-solid fa-users';
          colorClass = 'family';
        }

        button.innerHTML = \`
          <div class="icon-wrapper \${colorClass}">
            <i class="\${iconClass}"></i>
          </div>
          <div class="title-wrapper">\${text}</div>
        \`;

        button.addEventListener('click', (e) => {
          e.preventDefault();
          if (href && href !== '#') {
            // Create new page container
            const formPage = document.createElement('div');
            formPage.className = 'form-page';
            
            // Add back button
            const backButton = document.createElement('button');
            backButton.className = 'back-button';
            backButton.innerHTML = '<i class="fa fa-arrow-left"></i>';
            backButton.onclick = () => {
              formPage.remove();
              document.querySelector('.profile-action-buttons').style.display = 'block';
            };
            
            // Add page title
            const pageTitle = document.createElement('h2');
            pageTitle.className = 'page-title';
            pageTitle.textContent = text;
            
            // Create form container
            const formContainer = document.createElement('div');
            formContainer.className = 'form-container';
            
            // Add elements to form page
            formPage.appendChild(backButton);
            formPage.appendChild(pageTitle);
            formPage.appendChild(formContainer);
            
            // Hide buttons container
            document.querySelector('.profile-action-buttons').style.display = 'none';
            
            // Add form page to main content
            const mainContent = document.querySelector('.right_col');
            mainContent.appendChild(formPage);
            
            // Navigate to the form URL
            fetch(href)
              .then(response => response.text())
              .then(html => {
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');
                
                // Try to find the main content area
                let formContent = doc.querySelector('.right_col');
                
                if (formContent) {
                  // Remove x_title sections
                  const titleSections = formContent.querySelectorAll('.x_title');
                  titleSections.forEach(section => section.remove());

                  // Clean up the form content
                  formContainer.innerHTML = formContent.innerHTML;
                  
                  // Remove specified fields from National ID Information form
                  if (text.toLowerCase().includes('national id')) {
                    const fieldsToRemove = [
                      'Document Type',
                      'Document Number',
                      'Name As Per Document',
                      'Expiry Date'
                    ];
                    
                    // Find and remove the specified fields
                    const allRows = formContainer.querySelectorAll('tr');
                    allRows.forEach(row => {
                      const label = row.querySelector('label, td');
                      if (label && fieldsToRemove.some(field => 
                        label.textContent.trim().toLowerCase() === field.toLowerCase()
                      )) {
                        row.remove();
                      }
                    });
                  }

                  // Enhance form elements
                  const enhanceFormElements = () => {
                    // Remove any remaining x_title sections that might be dynamically added
                    const dynamicTitles = formContainer.querySelectorAll('.x_title');
                    dynamicTitles.forEach(title => title.remove());

                    // Group remaining form fields
                    const tables = formContainer.querySelectorAll('table');
                    tables.forEach(table => {
                      const formGroup = document.createElement('div');
                      formGroup.className = 'form-group';
                      
                      // Move table into form group
                      table.parentNode.insertBefore(formGroup, table);
                      formGroup.appendChild(table);
                    });

                    // Add required indicator to required fields
                    const requiredFields = formContainer.querySelectorAll('input[required], select[required]');
                    requiredFields.forEach(field => {
                      const label = field.previousElementSibling;
                      if (label && label.tagName === 'LABEL') {
                        label.innerHTML += ' <span class="required">*</span>';
                      }
                    });
                  };

                  enhanceFormElements();

                  // Prevent default form submissions
                  const forms = formContainer.querySelectorAll('form');
                  forms.forEach(form => {
                    form.onsubmit = (e) => {
                      e.preventDefault();
                      return false;
                    };
                  });
                } else {
                  // If no specific form found, try to get the main content area
                  const mainContent = doc.querySelector('.right_col') || 
                                    doc.querySelector('#main-content') ||
                                    doc.querySelector('.content-wrapper');
                  if (mainContent) {
                    formContainer.innerHTML = mainContent.innerHTML;
                  } else {
                    formContainer.innerHTML = '<p>Loading content...</p>';
                    // Fallback to direct navigation
                    window.location.href = href;
                  }
                }
              })
              .catch(error => {
                console.error('Error loading form:', error);
                window.location.href = href;
              });
          }
        });

        return button;
      }

      // Add profile menu buttons
      const menuLinks = sidebarMenu.querySelectorAll('a');
      menuLinks.forEach(link => {
        const text = link.textContent.trim();
        // Skip portal home button
        if (link.id.includes('lnkbtnportalhome')) {
          return;
        }
        // Hide Education and Family Information buttons
        if (text.toLowerCase().includes('education') || text.toLowerCase().includes('family')) {
          const button = createButton(link);
          button.classList.add('hidden');
          buttonsGrid.appendChild(button);
        } else {
          buttonsGrid.appendChild(createButton(link));
        }
      });
    };

    // Use requestAnimationFrame for smooth rendering
    requestAnimationFrame(() => {
      transformPage();
    });

    // Clean up function to prevent memory leaks
    const cleanup = () => {
      const styleElement = document.getElementById('profile-custom-styles');
      if (styleElement) {
        styleElement.remove();
      }
    };

    cleanupFunctions.push(cleanup);

    // Watch for URL changes
    let lastUrl = location.href;
    new MutationObserver(() => {
      const url = location.href;
      if (url !== lastUrl) {
        lastUrl = url;
        transformPage();
      }
    }).observe(document, {subtree: true, childList: true});

    function applyFormStyles() {
      // Add Font Awesome CSS
      const fontAwesomeLink = document.createElement('link');
      fontAwesomeLink.rel = 'stylesheet';
      fontAwesomeLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css';
      document.head.appendChild(fontAwesomeLink);

      // Apply styles to all containers
      const containers = document.querySelectorAll('.right_col, .row, .col-md-12, .x_panel, .x_content');
      containers.forEach(container => {
        container.style.minWidth = '95vw';
        container.style.width = 'auto';
        container.style.marginLeft = '-20px';
        container.style.padding = '0';
      });

      // Add icons to labels
      const labels = document.querySelectorAll('td:first-child');
      labels.forEach(label => {
        const text = label.textContent.trim().toLowerCase();
        let iconClass = '';
        
        // Map labels to Font Awesome icons
        switch(text) {
          case 'employee code :':
            iconClass = 'fas fa-id-card';
            break;
          case 'employee name :':
            iconClass = 'fas fa-user';
            break;
          case 'group name :':
            iconClass = 'fas fa-users';
            break;
          case 'designation :':
            iconClass = 'fas fa-briefcase';
            break;
          case 'role :':
            iconClass = 'fas fa-user-tag';
            break;
          case 'employee group:':
            iconClass = 'fas fa-user-friends';
            break;
          case 'employee sub group :':
            iconClass = 'fas fa-user-cog';
            break;
          case 'admin manager:':
            iconClass = 'fas fa-user-shield';
            break;
          case 'functional manager :':
            iconClass = 'fas fa-user-tie';
            break;
          default:
            iconClass = 'fas fa-info-circle';
        }
        
        // Create and add icon
        const icon = document.createElement('i');
        icon.className = iconClass;
        icon.style.marginRight = '10px';
        icon.style.color = '#4f46e5';
        icon.style.width = '20px';
        icon.style.fontSize = '16px';
        label.insertBefore(icon, label.firstChild);
      });

      const styleElement = document.createElement('style');
      styleElement.textContent = \`
        /* Container widths */
        .right_col, .row, .col-md-12, .x_panel, .x_content {
          min-width: 95vw !important;
          width: auto !important;
          margin-left: -20px !important;
          padding: 0 !important;
        }

        /* Form Panel */
        .x_panel {
          background: white !important;
          border: 1px solid #e5e7eb !important;
          border-radius: 8px !important;
          margin: 20px 0 20px -20px !important;
        }

        /* Title Section */
        .x_title {
          background: #4f46e5 !important;
          color: white !important;
          padding: 15px 20px !important;
          border-radius: 8px 8px 0 0 !important;
          margin: 0 !important;
          display: flex !important;
          align-items: center !important;
        }

        .x_title h2 {
          margin: 0 !important;
          font-size: 18px !important;
          font-weight: 600 !important;
          color: white !important;
          display: flex !important;
          align-items: center !important;
        }

        /* Content Section */
        .x_content {
          padding: 20px !important;
        }

        /* Table Styling */
        table {
          width: 100% !important;
          border-collapse: collapse !important;
        }

        /* Row Styling */
        tr {
          border-bottom: 1px solid #f3f4f6 !important;
        }

        tr:last-child {
          border-bottom: none !important;
        }

        /* Cell Styling */
        td {
          padding: 15px !important;
          vertical-align: middle !important;
        }

        /* Label Column */
        td:first-child {
          width: 35% !important;
          font-weight: 600 !important;
          color: #4f46e5 !important;
          display: flex !important;
          align-items: center !important;
        }

        /* Value Column */
        td:nth-child(2) {
          width: 65% !important;
        }

        /* Input Styling */
        input[type="text"] {
          width: 100% !important;
          padding: 8px 12px !important;
          border: 1px solid #e5e7eb !important;
          border-radius: 4px !important;
          font-size: 14px !important;
        }

        input[type="text"]:focus {
          outline: none !important;
          border-color: #4f46e5 !important;
          box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.1) !important;
        }

        /* Remove Extra Elements */
        .clearfix {
          display: none !important;
        }

        /* Icon Styling */
        .fas {
          display: inline-block !important;
          width: 20px !important;
          text-align: center !important;
        }
      \`;
      document.head.appendChild(styleElement);
    }

    // Call the function after the page loads
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', applyFormStyles);
    } else {
      applyFormStyles();
    }

    return () => {
      cleanupFunctions.forEach(cleanup => cleanup());
    };
  }

  // Initialize when ready
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    initializeProfilePage();
  } else {
    document.addEventListener('DOMContentLoaded', initializeProfilePage);
  }
})();

`;
