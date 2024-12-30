import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, ActivityIndicator, Text, TouchableOpacity, TextInput, Platform, Alert, BackHandler } from 'react-native';
import { WebView } from 'react-native-webview';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors, loginStyles } from './assets/styles';
import { profilePageTransform } from './assets/profilePageTransform';
import { employeeBenefitsTransform } from './assets/employeeBenefitsTransform';

const BASE_URL = 'https://portal.dodladairy.com/pace/pglogin.aspx';

const styles = StyleSheet.create({
  sidebarContainer: {
    flex: 1,
    backgroundColor: '#2C3E50',
  },
  webView: {
    flex: 1,
  },
  gradientBackground: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: '100%',
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.primary,
    zIndex: 1000,
    justifyContent: 'center',
    alignItems: 'center'
  },
  errorContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.primary,
    zIndex: 1000,
    justifyContent: 'center',
    alignItems: 'center'
  },
  errorText: {
    color: colors.secondary,
    fontSize: 18,
    marginBottom: 20
  },
  retryButton: {
    backgroundColor: colors.secondary,
    padding: 10,
    borderRadius: 5
  },
  retryText: {
    color: colors.primary,
    fontSize: 16
  },
  formModal: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'white',
    zIndex: 1000,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 10,
    zIndex: 1001,
  },
  closeText: {
    fontSize: 24,
    color: '#666',
  },
  button: {
    backgroundColor: '#ea580c',
    padding: 10,
    borderRadius: 5,
    margin: 10
  },
  buttonText: {
    color: 'white',
    fontSize: 16
  }
});

export default function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showWebView, setShowWebView] = useState(false);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isReportVisible, setIsReportVisible] = useState(false);
  const [currentFormUrl, setCurrentFormUrl] = useState('');
  const [reportUrl, setReportUrl] = useState('');
  const webViewRef = useRef(null);

  useEffect(() => {
    loadSavedCredentials();
  }, []);

  const loadSavedCredentials = async () => {
    try {
      const savedUsername = await AsyncStorage.getItem('username');
      const savedPassword = await AsyncStorage.getItem('password');
      if (savedUsername && savedPassword) {
        setUsername(savedUsername);
        setPassword(savedPassword);
        setRememberMe(true);
      }
    } catch (error) {
      console.log('Error loading credentials:', error);
    }
  };

  const saveCredentials = async () => {
    try {
      await AsyncStorage.setItem('username', username);
      await AsyncStorage.setItem('password', password);
    } catch (error) {
      console.log('Error saving credentials:', error);
    }
  };

  const clearCredentials = async () => {
    try {
      await AsyncStorage.removeItem('username');
      await AsyncStorage.removeItem('password');
      setRememberMe(false);
    } catch (error) {
      console.log('Error clearing credentials:', error);
    }
  };

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('Error', 'Please enter both username and password');
      return;
    }
    setIsLoading(true);

    // Create the login form data
    const formData = {
      username: username,
      password: password,
    };

    // Show WebView after setting credentials
    setIsLoggedIn(true);
    setShowWebView(true);

    // Handle remember me after successful login
    if (!rememberMe) {
      setTimeout(() => {
        Alert.alert(
          'Save Login Details',
          'Would you like to save your login details for next time?',
          [
            {
              text: 'Not Now',
              style: 'cancel',
              onPress: () => setRememberMe(false)
            },
            {
              text: 'Save',
              onPress: async () => {
                setRememberMe(true);
                await saveCredentials();
              }
            }
          ]
        );
      }, 1500);
    }
  };

  const handleWebViewNavigationStateChange = (newNavState) => {
    const { url } = newNavState;

    // Check if this is a form URL (excluding reports)
    if (url && (
      url.includes('AttendanceRequest.aspx') ||
      url.includes('pgpreapproval.aspx') ||
      url.includes('pgleaveapplicationnew.aspx') ||
      url.includes('HourbasedPermission.aspx')
    )) {
      setCurrentFormUrl(url);
      setIsFormVisible(true);
      return false; // Prevent default navigation
    }

    // Check if this is a report URL
    if (url && (
      url.includes('pgtimecardreporttotalemp.aspx') ||
      url.includes('pgTimeCardReport.aspx')
    )) {
      setReportUrl(url);
      setIsReportVisible(true);
      return false; // Prevent default navigation
    }

    // Let other URLs navigate normally
    return true;
  };

  const handleError = (syntheticEvent) => {
    const { nativeEvent } = syntheticEvent;
    console.warn('WebView error: ', nativeEvent);
    setHasError(true);
    setIsLoading(false);
  };

  const retry = () => {
    setHasError(false);
    setIsLoading(true);
    if (webViewRef.current) {
      webViewRef.current.reload();
    }
  };

  useEffect(() => {
    if (rememberMe) {
      saveCredentials();
    } else {
      clearCredentials();
    }
  }, [rememberMe]);

  useEffect(() => {
    const backAction = () => {
      if (isFormVisible) {
        setIsFormVisible(false);
        setCurrentFormUrl('');
        webViewRef.current?.goBack();
        return true; // Prevents default back action
      } else if (isReportVisible) {
        setIsReportVisible(false);
        setReportUrl('');
        return true; // Prevents default back action
      }
      return false; // Allows default back action
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );

    return () => backHandler.remove(); // Cleanup on unmount
  }, [isFormVisible, isReportVisible]);

  const customStyles = `
    @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css');

    body {
      background: #f1f5f9 !important;
      padding: 16px !important;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
    }

    .icon-wrapper {
      position: relative !important;
      z-index: 2 !important;
      margin-bottom: 12px !important;
      width: 48px !important;
      height: 48px !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      border-radius: 50% !important;
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0.1)) !important;
      box-shadow: 
        4px 4px 8px rgba(0, 0, 0, 0.2),
        -2px -2px 6px rgba(255, 255, 255, 0.1),
        inset 2px 2px 4px rgba(255, 255, 255, 0.2),
        inset -2px -2px 4px rgba(0, 0, 0, 0.1) !important;
      backdrop-filter: blur(8px) !important;
      border: 1px solid rgba(255, 255, 255, 0.3) !important;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
      overflow: hidden !important;
    }

    .icon-wrapper::before {
      content: '' !important;
      position: absolute !important;
      inset: 4px !important;
      border-radius: 50% !important;
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0.1)) !important;
      filter: blur(2px) !important;
      z-index: -1 !important;
    }

    .icon-wrapper::after {
      content: '' !important;
      position: absolute !important;
      width: 100% !important;
      height: 100% !important;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent) !important;
      transform: translateX(-100%) !important;
      animation: shimmer 2s infinite !important;
    }

    @keyframes shimmer {
      100% {
        transform: translateX(100%) !important;
      }
    }

    .icon-wrapper span {
      font-size: 24px !important;
      background: linear-gradient(135deg, rgba(255, 255, 255, 1), rgba(255, 255, 255, 0.8)) !important;
      -webkit-background-clip: text !important;
      -webkit-text-fill-color: transparent !important;
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1) !important;
      filter: drop-shadow(0px 2px 2px rgba(0, 0, 0, 0.1)) !important;
      transition: all 0.3s ease !important;
    }

    .icon-wrapper:hover {
      transform: translateY(-2px) scale(1.05) !important;
      box-shadow: 
        6px 6px 12px rgba(0, 0, 0, 0.25),
        -3px -3px 8px rgba(255, 255, 255, 0.15),
        inset 2px 2px 4px rgba(255, 255, 255, 0.2),
        inset -2px -2px 4px rgba(0, 0, 0, 0.1) !important;
    }

    .icon-wrapper:hover span {
      transform: scale(1.1) !important;
      filter: drop-shadow(0px 3px 3px rgba(0, 0, 0, 0.2)) !important;
    }

    .Hometile:active .icon-wrapper {
      transform: scale(0.95) !important;
      box-shadow: 
        2px 2px 4px rgba(0, 0, 0, 0.2),
        -1px -1px 3px rgba(255, 255, 255, 0.1),
        inset 3px 3px 6px rgba(0, 0, 0, 0.1),
        inset -2px -2px 4px rgba(255, 255, 255, 0.05) !important;
    }

    .Hometile:active .icon-wrapper span {
      transform: scale(0.95) !important;
    }

    /* Add subtle pulse animation for notification badges */
    .Hometile .badge {
      animation: pulse 2s infinite !important;
    }

    @keyframes pulse {
      0% {
        transform: scale(1) !important;
        box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.4) !important;
      }
      70% {
        transform: scale(1.05) !important;
        box-shadow: 0 0 0 6px rgba(255, 255, 255, 0) !important;
      }
      100% {
        transform: scale(1) !important;
        box-shadow: 0 0 0 0 rgba(255, 255, 255, 0) !important;
      }
    }

    .Hometile-container {
      display: grid !important;
      grid-template-columns: repeat(3, 1fr) !important;
      gap: 16px !important;
      padding: 4px !important;
      width: 100% !important;
      max-width: 100% !important;
    }

    .Hometile {
      position: relative !important;
      aspect-ratio: 1 !important;
      border-radius: 20px !important;
      padding: 20px 16px !important;
      display: flex !important;
      flex-direction: column !important;
      align-items: center !important;
      justify-content: center !important;
      text-decoration: none !important;
      font-size: 13px !important;
      font-weight: 600 !important;
      line-height: 1.4 !important;
      text-align: center !important;
      color: white !important;
      background: linear-gradient(135deg, var(--primary-color), var(--secondary-color)) !important;
      box-shadow: 0 8px 0 var(--shadow-color),
                 0 15px 20px rgba(0, 0, 0, 0.1) !important;
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1) !important;
      overflow: hidden !important;
      -webkit-tap-highlight-color: transparent !important;
      transform: translateY(-4px) !important;
    }

    .Hometile:active {
      transform: translateY(0) !important;
      box-shadow: 0 4px 0 var(--shadow-color),
                 0 8px 10px rgba(0, 0, 0, 0.1) !important;
    }

    .Hometile::before {
      content: '' !important;
      position: absolute !important;
      top: 0 !important;
      left: 0 !important;
      right: 0 !important;
      bottom: 0 !important;
      background: linear-gradient(180deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 100%) !important;
      border-radius: 20px !important;
    }

    .title-wrapper {
      position: relative !important;
      z-index: 2 !important;
      color: white !important;
      font-weight: 600 !important;
      width: 100% !important;
      padding: 0 4px !important;
      margin-top: 8px !important;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2) !important;
    }

    .badge {
      position: absolute !important;
      top: 12px !important;
      right: 12px !important;
      background: white !important;
      color: var(--primary-color) !important;
      font-size: 11px !important;
      font-weight: bold !important;
      min-width: 22px !important;
      height: 22px !important;
      border-radius: 11px !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      padding: 0 8px !important;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2) !important;
      z-index: 3 !important;
    }

    /* Vibrant Color Schemes */
    .profile { 
      --primary-color: #4f46e5;
      --secondary-color: #818cf8;
      --shadow-color: #3730a3;
    }
    .help-desk { 
      --primary-color: #059669;
      --secondary-color: #34d399;
      --shadow-color: #047857;
    }
    .leave-attendance { 
      --primary-color: #ea580c;
      --secondary-color: #fb923c;
      --shadow-color: #c2410c;
    }
    .travel-expenses { 
      --primary-color: #0284c7;
      --secondary-color: #38bdf8;
      --shadow-color: #0369a1;
    }
    .performance { 
      --primary-color: #7c3aed;
      --secondary-color: #a78bfa;
      --shadow-color: #6d28d9;
    }
    .benefits { 
      --primary-color: #e11d48;
      --secondary-color: #fb7185;
      --shadow-color: #be123c;
    }
    .workforce { 
      --primary-color: #0891b2;
      --secondary-color: #22d3ee;
      --shadow-color: #0e7490;
    }
    .exit { 
      --primary-color: #dc2626;
      --secondary-color: #f87171;
      --shadow-color: #b91c1c;
    }
    .manpower-budget { 
      --primary-color: #6366f1;
      --secondary-color: #818cf8;
      --shadow-color: #4f46e5;
    }
    .employee-documents { 
      --primary-color: #9333ea;
      --secondary-color: #c084fc;
      --shadow-color: #7e22ce;
    }
    .canteen-management { 
      --primary-color: #be185d;
      --secondary-color: #f472b6;
      --shadow-color: #9d174d;
    }
    .asset-management { 
      --primary-color: #0d9488;
      --secondary-color: #2dd4bf;
      --shadow-color: #0f766e;
    }
    .sales-information { 
      --primary-color: #d97706;
      --secondary-color: #fbbf24;
      --shadow-color: #b45309;
    }
    .approval-documents { 
      --primary-color: #7e22ce;
      --secondary-color: #a855f7;
      --shadow-color: #6b21a8;
    }
    .approvals { 
      --primary-color: #dc2626;
      --secondary-color: #f87171;
      --shadow-color: #991b1b;
    }
    .todo { 
      --primary-color: #be185d;
      --secondary-color: #f472b6;
      --shadow-color: #9d174d;
    }

    /* Marquee styles */
    marquee {
      margin: 20px 0 !important;
      padding: 16px !important;
      background: white !important;
      border-radius: 16px !important;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05) !important;
    }

    marquee span {
      color: #dc2626 !important;
      font-size: 14px !important;
      font-weight: 600 !important;
      line-height: 1.5 !important;
    }

    /* Quick action buttons for Leave & Attendance */
    .action-buttons-container {
      display: flex !important;
      gap: 16px !important;
      margin: 20px !important;
      flex-wrap: wrap !important;
      width: calc(100% - 40px) !important;
    }

    .sidebar-action-button {
      flex: 1 !important;
      min-width: 150px !important;
      padding: 16px !important;
      border-radius: 12px !important;
      background: linear-gradient(135deg, #2c5282, #2b6cb0) !important;
      color: white !important;
      font-weight: 500 !important;
      font-size: 15px !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      gap: 8px !important;
      cursor: pointer !important;
      transition: all 0.3s ease !important;
      border: none !important;
      box-shadow: 0 4px 6px rgba(44,82,130,0.2) !important;
      text-decoration: none !important;
    }

    .sidebar-action-button:hover {
      transform: translateY(-2px) !important;
      box-shadow: 0 6px 12px rgba(44, 82, 130, 0.3) !important;
    }

    .sidebar-action-button:active {
      transform: scale(0.98) !important;
    }

    .sidebar-action-button i {
      font-size: 20px !important;
    }
  `;

  const injectedJavaScript = `
  (function() {
    // Check if we're on the profile page
        if (window.location.href.includes('pgemployementInformation.aspx') ||
        window.location.href.includes('pgtalentacquisitionform.aspx') ||
        window.location.href.includes('pgnationalidinformation.aspx') ||
        window.location.href.includes('pgeducationdetails.aspx') ||
        window.location.href.includes('pgexperiancedetails.aspx') ||
        window.location.href.includes('pgfamilydetails.aspx')) {
      ${profilePageTransform}
    }

    // Check if we're on any benefits pages (this should be OUTSIDE the profile check)
    const currentUrl = window.location.href.toLowerCase();
    if (currentUrl.includes('/loan/home.aspx') || 
        currentUrl.includes('/loan/pgloanentry.aspx') || 
        currentUrl.includes('/pace/pgmarriagegiftrequest.aspx') || 
        currentUrl.includes('/pace/pgrelocationlist.aspx')) {
      ${employeeBenefitsTransform}
    }

    function initializePage() {
      
    }

      function initializePage() {
        // Add Font Awesome if not already added
        if (!document.querySelector('link[href*="font-awesome"]')) {
          const link = document.createElement('link');
          link.rel = 'stylesheet';
          link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css';
          document.head.appendChild(link);
        }

        function transformLeaveAttendancePage() {
          console.log('Checking page...');
          
          // Find the sidebar menu items - using the correct selectors from the ASP.NET page
          const requisitionsMenu = document.querySelector('#ctl00_requisitions .nav.child_menu');
          const reportsMenu = document.querySelector('#ctl00_Reports .nav.child_menu');
          
          if (!requisitionsMenu && !reportsMenu) {
            console.log('Menus not found, retrying...');
            setTimeout(transformLeaveAttendancePage, 500);
            return;
          }

          // Create and insert header first
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
            const username = usernameElement ? usernameElement.textContent.trim() : 'Welcome';
            
            header.innerHTML = \`
              <div class="header-content">
                <div class="header-title">
                  <i class="fa fa-calendar-check-o header-icon"></i>
                  Leave & Attendance
                </div>
              </div>
            \`;

            // Insert header at the top
            mainContent.insertBefore(header, mainContent.firstChild);
          }

          // Add styles with higher z-index and !important rules
          const headerStyles = document.createElement('style');
          headerStyles.textContent = \`
            .custom-header {
              background: linear-gradient(135deg, #ea580c, #fb923c) !important;
              padding: 15px !important;
              margin: -10px -15px 20px -15px !important;
              color: white !important;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1) !important;
              position: relative !important;
              overflow: hidden !important;
              z-index: 1000 !important;
              display: block !important;
              width: calc(100% + 30px) !important;
            }

            .custom-header::before {
              content: '' !important;
              position: absolute !important;
              top: 0 !important;
              left: 0 !important;
              right: 0 !important;
              bottom: 0 !important;
              background: linear-gradient(45deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 100%) !important;
              pointer-events: none !important;
            }

            .header-content {
              position: relative !important;
              z-index: 1001 !important;
              display: flex !important;
              align-items: center !important;
              padding-left: 15px !important;
            }

            .header-title {
              font-size: 24px !important;
              font-weight: 600 !important;
              color: white !important;
              display: flex !important;
              align-items: center !important;
              gap: 10px !important;
            }

            .header-icon {
              font-size: 20px !important;
            }

            .right_col {
              padding-top: 0 !important;
              margin-top: 0 !important;
            }
          \`;
          document.head.appendChild(headerStyles);

          // Rest of your existing styles
          const styleElement = document.createElement('style');
          styleElement.textContent = \`
            body.nav-md .container.body .right_col {
              margin: 0 !important;
              padding: 0 !important;
              min-height: 100vh !important;
              max-height: 100vh !important;
              overflow-y: auto !important;
              position: fixed !important;
              width: 100% !important;
              top: 0 !important;
              left: 0 !important;
            }
            .nav_menu, .top_nav {
              position: fixed !important;
              top: 0 !important;
              left: 0 !important;
              right: 0 !important;
              height: 0 !important;
              min-height: 0 !important;
              overflow: hidden !important;
              opacity: 0 !important;
              z-index: -1 !important;
              background: white !important;
              border: none !important;
              margin: 0 !important;
              padding: 0 !important;
            }
            .right_col {
              background: white !important;
              margin-top: 0 !important;
              padding-top: 10px !important;
            }
            .page-title, .title_left h3 {
              display: none !important;
            }
            html, body {
              touch-action: none !important;
              -ms-touch-action: none !important;
              user-zoom: fixed !important;
              -ms-user-zoom: fixed !important;
              -webkit-user-zoom: fixed !important;
              zoom: 100% !important;
              max-width: 100% !important;
              overflow-x: hidden !important;
            }
            footer, .footer {
              display: none !important;
            }
            .container.body {
              height: 100vh !important;
              overflow: hidden !important;
            }
            .leave-action-buttons {
              margin-bottom: 20px !important;
              position: relative !important;
              z-index: 2 !important;
            }
            /* Hide the blue header bar */
            .x_panel, .x_title, .x_content {
              display: none !important;
            }
            /* Create a white overlay below buttons */
            .leave-action-buttons::after {
              content: '';
              position: fixed !important;
              top: 0 !important;
              left: 0 !important;
              right: 0 !important;
              bottom: 0 !important;
              background: white !important;
              z-index: 1 !important;
            }
            /* Ensure buttons stay above the overlay */
            .leave-action-tile {
              position: relative !important;
              z-index: 3 !important;
            }
          \`;
          document.head.appendChild(styleElement);

          // Create container for buttons
          let buttonContainer = document.querySelector('.leave-action-buttons');
          if (!buttonContainer) {
            buttonContainer = document.createElement('div');
            buttonContainer.className = 'leave-action-buttons';
            buttonContainer.style.cssText = \`
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
              gap: 12px;
              padding: 12px;
              margin: 15px auto;
              max-width: 800px;
              width: calc(100% - 24px);
              background: #f8fafc;
              border-radius: 12px;
            \`;

            // Insert after the page title
            const titleArea = document.querySelector('.page-title');
            if (titleArea) {
              titleArea.parentNode.insertBefore(buttonContainer, titleArea.nextSibling);
            }
          }

          // Clear existing buttons
          buttonContainer.innerHTML = '';

          // Function to create button
          function createButton(link, type) {
            const button = document.createElement('div');
            button.className = 'leave-action-tile';
            
            // Get href and text
            const href = link.getAttribute('href');
            const text = link.textContent.trim();
            
            // Determine icon based on text
            let iconClass = 'fa-solid fa-calendar-check'; // default icon

            // Assign specific icons based on link text
            if (text.toLowerCase().includes('attendance')) {
              iconClass = 'fa-solid fa-clock';
            } else if (text.toLowerCase().includes('c-off')) {
              iconClass = 'fa-solid fa-calendar-plus';
            } else if (text.toLowerCase().includes('leave')) {
              iconClass = 'fa-solid fa-calendar-minus';
            } else if (text.toLowerCase().includes('report')) {
              iconClass = 'fa-solid fa-chart-column';
            } else if (text.toLowerCase().includes('time card')) {
              iconClass = 'fa-solid fa-id-card';
            }

            button.innerHTML = \`
              <div class="icon-wrapper">
                <i class="\${iconClass}"></i>
              </div>
              <div class="title-wrapper">\${text}</div>
            \`;

            // Style the button
            button.style.cssText = \`
              position: relative;
              aspect-ratio: 1.2;
              border-radius: 16px;
              padding: 12px;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              text-decoration: none;
              font-size: 13px;
              font-weight: 500;
              text-align: center;
              color: white;
              background: linear-gradient(135deg, #ea580c, #fb923c);
              box-shadow: 0 4px 0 #c2410c,
                         0 8px 12px rgba(0, 0, 0, 0.1);
              transform: translateY(-2px);
              transition: all 0.2s;
              cursor: pointer;
              -webkit-tap-highlight-color: transparent;
            \`;

            // Style icon wrapper
            const iconWrapper = button.querySelector('.icon-wrapper');
            if (iconWrapper) {
              iconWrapper.style.cssText = \`
                width: 36px;
                height: 36px;
                margin-bottom: 8px;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.2);
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 18px;
              \`;
            }

            // Style title wrapper
            const titleWrapper = button.querySelector('.title-wrapper');
            if (titleWrapper) {
              titleWrapper.style.cssText = \`
                font-size: 12px;
                line-height: 1.2;
                margin-top: 4px;
                max-width: 100%;
                overflow-wrap: break-word;
                word-wrap: break-word;
              \`;
            }

            // Handle click
            button.addEventListener('click', (e) => {
              e.preventDefault();
              if (href && href !== '#') {
                if (href.includes('.aspx')) {
                  window.location.href = href;
                } else {
                  // Handle ASP.NET postback
                  __doPostBack(href.replace('javascript:__doPostBack(\\'', '').replace('\\',\\'\\')', ''), '');
                }
              }
            });

            // Add press effect
            button.addEventListener('mousedown', () => {
              button.style.transform = 'translateY(0)';
              button.style.boxShadow = '0 2px 0 #c2410c, 0 4px 6px rgba(0, 0, 0, 0.1)';
            });

            button.addEventListener('mouseup', () => {
              button.style.transform = 'translateY(-2px)';
              button.style.boxShadow = '0 4px 0 #c2410c, 0 8px 12px rgba(0, 0, 0, 0.1)';
            });

            return button;
          }

          // Add requisition buttons
          if (requisitionsMenu) {
            const links = requisitionsMenu.querySelectorAll('a');
            links.forEach(link => {
              buttonContainer.appendChild(createButton(link, 'requisition'));
            });
          }

          // Add report buttons
          if (reportsMenu) {
            const links = reportsMenu.querySelectorAll('a');
            links.forEach(link => {
              buttonContainer.appendChild(createButton(link, 'report'));
            });
          }

          // Hide original sidebar on mobile
          const sidebar = document.querySelector('.left_col');
          if (sidebar && window.innerWidth <= 768) {
            sidebar.style.display = 'none';
          }
        }

        // Initial transform
        transformLeaveAttendancePage();

        // Watch for URL changes
        let lastUrl = location.href;
        new MutationObserver(() => {
          const url = location.href;
          if (url !== lastUrl) {
            lastUrl = url;
            transformLeaveAttendancePage();
          }
        }).observe(document, {subtree: true, childList: true});
      }

      // Initialize when ready
      if (document.readyState === 'complete' || document.readyState === 'interactive') {
        initializePage();
      } else {
        document.addEventListener('DOMContentLoaded', initializePage);
      }
    })();
    true;
  `;

  const injectedJavaScriptBeforeContentLoaded = `
    window.onload = () => {
      if(window.location.href.includes('pglogin.aspx')) {
        document.getElementById('txtUserName').value = '${username}';
        document.getElementById('txtPassword').value = '${password}';
        document.getElementById('btnLogin').click();
      } else {
        // Function to add buttons
        function addButtons() {
          // Only proceed if we're on the leave-attendance page
          if (window.location.href.toLowerCase().includes('leave')) {
            // Find all sidebar links
            const sidebarLinks = document.querySelectorAll('.nav.side-menu > li > a');
            
            // Create container for buttons
            let buttonContainer = document.querySelector('.leave-action-buttons');
            if (!buttonContainer) {
              buttonContainer = document.createElement('div');
              buttonContainer.className = 'leave-action-buttons';
              buttonContainer.style.cssText = \`
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
                gap: 12px;
                padding: 12px;
                margin-top: 20px;
                width: 100%;
              \`;

              // Insert after the page title
              const titleArea = document.querySelector('.page-title');
              if (titleArea) {
                titleArea.parentNode.insertBefore(buttonContainer, titleArea.nextSibling);
              }
            }

            // Create buttons from sidebar links
            sidebarLinks.forEach(link => {
              // Skip if button already exists
              const existingButton = buttonContainer.querySelector(\`[data-href="\${link.href}"]\`);
              if (existingButton) return;

              const button = document.createElement('div');
              button.className = 'leave-action-tile';
              button.dataset.href = link.href;

              // Clean up the link text and get icon
              const titleText = link.textContent.trim().toLowerCase();
              let iconClass = 'fa-solid fa-calendar-check'; // default icon

              // Assign specific icons based on link text
              if (titleText.includes('attendance')) {
                iconClass = 'fa-solid fa-clock';
              } else if (titleText.includes('c-off')) {
                iconClass = 'fa-solid fa-calendar-plus';
              } else if (titleText.includes('leave')) {
                iconClass = 'fa-solid fa-calendar-minus';
              } else if (titleText.includes('report')) {
                iconClass = 'fa-solid fa-chart-column';
              } else if (titleText.includes('time card')) {
                iconClass = 'fa-solid fa-id-card';
              }

              button.innerHTML = \`
                <div class="icon-wrapper">
                  <i class="\${iconClass}"></i>
                </div>
                <div class="title-wrapper">\${link.textContent.trim()}</div>
              \`;

              // Style the button similar to home page tiles
              button.style.cssText = \`
                position: relative;
                aspect-ratio: 1.2;
                border-radius: 16px;
                padding: 12px;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                text-decoration: none;
                font-size: 13px;
                font-weight: 500;
                line-height: 1.4;
                text-align: center;
                color: white;
                background: linear-gradient(135deg, #ea580c, #fb923c);
                box-shadow: 0 4px 0 #c2410c,
                           0 8px 12px rgba(0, 0, 0, 0.1);
                transform: translateY(-2px);
                transition: all 0.2s;
                cursor: pointer;
                -webkit-tap-highlight-color: transparent;
              \`;

              // Style icon wrapper
              const iconWrapper = button.querySelector('.icon-wrapper');
              if (iconWrapper) {
                iconWrapper.style.cssText = \`
                  width: 36px;
                  height: 36px;
                  margin-bottom: 8px;
                  border-radius: 50%;
                  background: rgba(255, 255, 255, 0.2);
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  font-size: 18px;
                \`;
              }

              // Style title wrapper
              const titleWrapper = button.querySelector('.title-wrapper');
              if (titleWrapper) {
                titleWrapper.style.cssText = \`
                  font-size: 12px;
                  line-height: 1.2;
                  margin-top: 4px;
                  max-width: 100%;
                  overflow-wrap: break-word;
                  word-wrap: break-word;
                \`;
              }

              // Handle click with ASP.NET postback
              button.addEventListener('click', (e) => {
                e.preventDefault();
                const href = button.dataset.href;
                if (href) {
                  const match = href.match(/__doPostBack\('([^']+)','([^']+)'\)/);
                  if (match) {
                    __doPostBack(match[1], match[2]);
                  } else {
                    window.location.href = href;
                  }
                }
              });

              // Add active state styles
              button.addEventListener('mousedown', () => {
                button.style.transform = 'translateY(0)';
                button.style.boxShadow = '0 2px 0 #c2410c, 0 4px 6px rgba(0, 0, 0, 0.1)';
              });

              button.addEventListener('mouseup', () => {
                button.style.transform = 'translateY(-2px)';
                button.style.boxShadow = '0 4px 0 #c2410c, 0 8px 12px rgba(0, 0, 0, 0.1)';
              });

              buttonContainer.appendChild(button);
            });

            // Hide original sidebar on mobile
            const sidebar = document.querySelector('#sidebar');
            if (sidebar) {
              sidebar.style.display = 'none';
            }
          }
        }
        
        // Run when page loads
        addButtons();

        // Run when URL changes
        let lastUrl = location.href;
        new MutationObserver(() => {
          const url = location.href;
          if (url !== lastUrl) {
            lastUrl = url;
            addButtons();
          }
        }).observe(document, {subtree: true, childList: true});

        // Add styles for cards
        const style = document.createElement('style');
        style.textContent = ${JSON.stringify(customStyles)};
        document.head.appendChild(style);

        // Handle card icons
        document.querySelectorAll('.Hometile').forEach(card => {
          const content = document.createElement('div');
          content.className = 'Hometile-content';
          
          const iconContainer = document.createElement('div');
          iconContainer.className = 'icon-wrapper';
          
          const icon = document.createElement('i');
          
          // Set modern Font Awesome icons
          const titleText = card.querySelector('.Hometile-title')?.textContent.toLowerCase().trim();
          
          if(titleText === 'my profile') {
            icon.className = 'fa-solid fa-user-circle';
            card.className = 'Hometile profile';
          } else if(titleText === 'hr help desk') {
            icon.className = 'fa-solid fa-headset';
            card.className = 'Hometile help-desk';
          } else if(titleText === 'leave & attendance') {
            icon.className = 'fa-solid fa-calendar-check';
            card.className = 'Hometile leave-attendance';
          } else if(titleText === 'travel & expenses') {
            icon.className = 'fa-solid fa-plane-departure';
            card.className = 'Hometile travel-expenses';
          } else if(titleText === 'performance management') {
            icon.className = 'fa-solid fa-chart-line';
            card.className = 'Hometile performance';
          } else if(titleText === 'employee benefits') {
            icon.className = 'fa-solid fa-gift';
            card.className = 'Hometile benefits';
          } else if(titleText === 'workforce management') {
            icon.className = 'fa-solid fa-users-gear';
            card.className = 'Hometile workforce';
          } else if(titleText === 'exit management') {
            icon.className = 'fa-solid fa-door-open';
            card.className = 'Hometile exit';
          } else if(titleText === 'manpower budget') {
            icon.className = 'fa-solid fa-sack-dollar';
            card.className = 'Hometile manpower-budget';
          } else if(titleText === 'employee documents') {
            icon.className = 'fa-solid fa-folder-tree';
            card.className = 'Hometile employee-documents';
          } else if(titleText === 'canteen management') {
            icon.className = 'fa-solid fa-utensils';
            card.className = 'Hometile canteen-management';
          } else if(titleText === 'asset management') {
            icon.className = 'fa-solid fa-boxes-stacked';
            card.className = 'Hometile asset-management';
          } else if(titleText === 'sales information') {
            icon.className = 'fa-solid fa-chart-pie';
            card.className = 'Hometile sales-information';
          } else if(titleText === 'approval documents') {
            icon.className = 'fa-solid fa-file-signature';
            card.className = 'Hometile approval-documents';
          } else if(titleText === 'approvals') {
            icon.className = 'fa-solid fa-clipboard-check';
            card.className = 'Hometile approvals';
          } else if(titleText === 'to-do list') {
            icon.className = 'fa-solid fa-list-check';
            card.className = 'Hometile todo';
          }
          
          iconContainer.appendChild(icon);
          
          const titleElement = card.querySelector('.Hometile-title');
          if (titleElement) {
            content.appendChild(iconContainer);
            content.appendChild(titleElement.cloneNode(true));
            titleElement.remove();
          }
          
          card.insertBefore(content, card.firstChild);
        });

        // Create modal container
        const modalContainer = document.createElement('div');
        modalContainer.style.cssText = \`
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
          display: none;
          justify-content: center;
          align-items: flex-start;
          z-index: 9999;
          overflow-y: auto;
          padding: 20px;
        \`;
        document.body.appendChild(modalContainer);

        // Handle button click
        document.querySelectorAll('.leave-action-tile').forEach(button => {
          button.addEventListener('click', (e) => {
            e.preventDefault();
            const href = button.getAttribute('data-href');
            
            // Find the target form
            const targetForm = document.querySelector(href);
            if (!targetForm) return;

            // Clone the form to preserve the original
            const formClone = targetForm.cloneNode(true);
            
            // Style the form for modal display
            formClone.style.cssText = \`
              background: white;
              padding: 20px;
              border-radius: 12px;
              width: 100%;
              max-width: 800px;
              margin: 20px auto;
              position: relative;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            \`;

            // Add close button
            const closeButton = document.createElement('button');
            closeButton.innerHTML = '×';
            closeButton.style.cssText = \`
              position: absolute;
              top: 10px;
              right: 10px;
              background: none;
              border: none;
              font-size: 24px;
              cursor: pointer;
              color: #666;
              padding: 4px 8px;
              z-index: 1;
            \`;
            
            closeButton.onclick = () => {
              modalContainer.style.display = 'none';
              document.body.style.overflow = 'auto';
              // Remove the cloned form
              modalContainer.innerHTML = '';
            };

            // Show modal with cloned form
            modalContainer.innerHTML = '';
            modalContainer.appendChild(formClone);
            formClone.appendChild(closeButton);
            modalContainer.style.display = 'flex';
            document.body.style.overflow = 'hidden';

            // Preserve form functionality
            const inputs = formClone.querySelectorAll('input, select, textarea');
            inputs.forEach(input => {
              input.addEventListener('change', (e) => {
                const originalInput = targetForm.querySelector(\`[name="\${input.name}"]\`);
                if (originalInput) {
                  originalInput.value = input.value;
                  // Trigger change event on original input
                  const event = new Event('change', { bubbles: true });
                  originalInput.dispatchEvent(event);
                }
              });
            });

            // Find the buttons container
            const buttonsContainer = document.querySelector('.buttons-container');
            if (!buttonsContainer) {
              // If buttons don't have the class yet, add it to the parent of the buttons
              const firstButton = document.querySelector('input[type="submit"]')?.closest('.col-md-4')?.parentElement;
              if (firstButton) {
                firstButton.classList.add('buttons-container');
              }
            }

            // When a button is clicked, hide the buttons container
            document.querySelectorAll('input[type="submit"]').forEach(button => {
              button.addEventListener('click', function() {
                const container = document.querySelector('.buttons-container');
                if (container) {
                  container.style.display = 'none';
                }
              });
            });

            // When modal is closed, show the buttons container again
            modalContainer.addEventListener('click', function(e) {
              if (e.target === modalContainer) {
                const container = document.querySelector('.buttons-container');
                if (container) {
                  container.style.display = '';
                }
              }
            });

            // Add close button event to show buttons
            closeButton.addEventListener('click', function() {
              const container = document.querySelector('.buttons-container');
              if (container) {
                container.style.display = '';
              }
            });

            return false;
          });
        });

        // Close modal when clicking outside
        modalContainer.addEventListener('click', (e) => {
          if (e.target === modalContainer) {
            modalContainer.style.display = 'none';
            document.body.style.overflow = 'auto';
            modalContainer.innerHTML = '';
          }
        });

        // Add custom styles for form elements
        const styles = document.createElement('style');
        styles.textContent = \`
          .x_panel {
            background: white;
            border-radius: 12px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            margin: 15px;
            padding: 15px;
            max-width: 800px;
            margin: 0 auto;
          }

          .x_title {
            border-bottom: 1px solid #eee;
            padding-bottom: 10px;
            margin-bottom: 15px;
          }

          .x_title h4 {
            color: #333;
            font-size: 18px;
            margin: 0;
          }

          .txtnewbig, .txtnewbigddl {
            width: 100% !important;
            padding: 8px 12px;
            border: 1px solid #ddd !important;
            border-radius: 6px !important;
            font-size: 14px !important;
            margin: 4px 0 !important;
            background: white !important;
            box-shadow: none !important;
            height: auto !important;
          }

          .txtnewbigddl {
            height: 38px !important;
            background: white !important;
          }

          textarea.txtnewbigddl {
            min-height: 60px !important;
            resize: vertical !important;
          }

          .bebutton {
            background: linear-gradient(135deg, #ea580c, #fb923c) !important;
            color: white !important;
            padding: 10px 20px !important;
            border: none !important;
            border-radius: 6px !important;
            font-size: 16px !important;
            font-weight: 500 !important;
            margin: 5px !important;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1) !important;
            min-width: 120px !important;
          }

          .bebutton:hover {
            transform: translateY(-1px) !important;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1) !important;
          }

          table {
            width: 100% !important;
            border-collapse: separate !important;
            border-spacing: 0 8px !important;
          }

          td {
            padding: 8px !important;
            vertical-align: middle !important;
          }

          span[id*="Label"] {
            color: #444 !important;
            font-weight: 500 !important;
            display: inline-block !important;
            margin-bottom: 4px !important;
          }

          .form-container {
            max-width: 1000px !important;
            margin: 0 auto !important;
            padding: 20px !important;
          }

          @media (max-width: 768px) {
            table {
              display: block !important;
            }
            
            tr {
              margin-bottom: 15px !important;
              display: block !important;
            }
            
            td {
              display: block !important;
              width: 100% !important;
              text-align: left !important;
            }
          }
        \`;
        document.head.appendChild(styles);

        // Style specific form elements
        document.querySelectorAll('.x_panel').forEach(panel => {
          const inputs = panel.querySelectorAll('input, select, textarea');
          inputs.forEach(input => {
            if (input.type === 'text' || input.type === 'password') {
              input.classList.add('txtnewbig');
            }
            if (input.tagName === 'SELECT') {
              input.classList.add('txtnewbigddl');
            }
          });

          const buttons = panel.querySelectorAll('input[type="submit"]');
          buttons.forEach(button => {
            button.classList.add('bebutton');
          });
        });

        styles.textContent += \`
          .buttons-container {
            transition: display 0.3s ease !important;
          }
        \`;

        // Add form-specific styles
        const formStyles = document.createElement('style');
        formStyles.textContent = \`
          /* Form Container Styles */
          .modal-content {
            padding: 15px !important;
            border-radius: 12px !important;
            max-width: 100% !important;
            margin: 10px !important;
            background: white !important;
          }

          /* Form Fields */
          input[type="text"],
          input[type="number"],
          input[type="time"],
          select,
          textarea {
            width: 100% !important;
            padding: 10px !important;
            margin: 5px 0 15px 0 !important;
            border: 1px solid #ddd !important;
            border-radius: 8px !important;
            font-size: 16px !important;
            background-color: white !important;
          }

          /* Labels */
          label {
            font-size: 14px !important;
            font-weight: 500 !important;
            color: #333 !important;
            margin-bottom: 5px !important;
            display: block !important;
          }

          /* Form Row Layout */
          .form-group {
            margin-bottom: 15px !important;
            width: 100% !important;
          }

          /* Buttons */
          .btn-primary,
          .btn-default,
          input[type="submit"],
          button[type="submit"] {
            background: #ea580c !important;
            color: white !important;
            padding: 12px 20px !important;
            border: none !important;
            border-radius: 8px !important;
            font-size: 16px !important;
            font-weight: 500 !important;
            margin: 5px !important;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1) !important;
            min-width: 120px !important;
          }

          .btn-default,
          button[type="reset"] {
            background: #6B7280 !important;
          }

          /* Table Styles */
          table {
            width: 100% !important;
            margin-bottom: 15px !important;
            border-collapse: collapse !important;
          }

          td, th {
            padding: 12px 8px !important;
            border: 1px solid #ddd !important;
            font-size: 14px !important;
          }

          /* Form Title */
          .x_title h2 {
            font-size: 20px !important;
            font-weight: 600 !important;
            color: #333 !important;
            margin: 0 0 20px 0 !important;
            padding: 0 !important;
          }

          /* Fix select dropdowns */
          select {
            -webkit-appearance: none !important;
            -moz-appearance: none !important;
            appearance: none !important;
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23333' d='M6 8L1 3h10z'/%3E%3C/svg%3E") !important;
            background-repeat: no-repeat !important;
            background-position: right 10px center !important;
            padding-right: 30px !important;
          }

          /* Fix date inputs */
          input[type="date"] {
            -webkit-appearance: none !important;
            appearance: none !important;
            padding: 10px !important;
          }

          /* Button Container */
          .form-actions {
            display: flex !important;
            justify-content: center !important;
            gap: 10px !important;
            margin-top: 20px !important;
            padding: 15px 0 !important;
          }

          /* Modal Close Button */
          .close {
            position: absolute !important;
            right: 15px !important;
            top: 15px !important;
            font-size: 24px !important;
            color: #666 !important;
            opacity: 0.8 !important;
            background: none !important;
            border: none !important;
            padding: 5px !important;
          }

          /* Form Section Spacing */
          .x_content {
            padding: 0 !important;
            margin: 0 !important;
          }

          /* Grid Layout Fixes */
          .col-md-6,
          .col-sm-6,
          .col-xs-12 {
            width: 100% !important;
            padding: 0 10px !important;
            float: none !important;
          }

          /* Error Messages */
          .error-message {
            color: #dc2626 !important;
            font-size: 14px !important;
            margin-top: 5px !important;
          }

          /* Required Field Indicator */
          .required:after {
            content: ' *' !important;
            color: #dc2626 !important;
          }
        \`;
        document.head.appendChild(formStyles);

        // Add specific styles for attendance regularization form
        const attendanceFormStyles = document.createElement('style');
        attendanceFormStyles.textContent = \`
          /* Target the specific form */
          #ctl00_ContentPlaceHolder1_Panel2,
          .attendance-form {
            padding: 15px !important;
            background: white !important;
            border-radius: 12px !important;
            margin: 10px !important;
            width: 100% !important;
            max-width: 100% !important;
            box-sizing: border-box !important;
          }

          /* Form rows */
          #ctl00_ContentPlaceHolder1_Panel2 tr,
          .attendance-form tr {
            display: flex !important;
            flex-direction: column !important;
            margin-bottom: 15px !important;
            width: 100% !important;
          }

          /* Form cells */
          #ctl00_ContentPlaceHolder1_Panel2 td,
          .attendance-form td {
            display: block !important;
            width: 100% !important;
            padding: 5px 0 !important;
            border: none !important;
          }

          /* Labels */
          #ctl00_ContentPlaceHolder1_Label11,
          #ctl00_ContentPlaceHolder1_Label10,
          #ctl00_ContentPlaceHolder1_Label1,
          #ctl00_ContentPlaceHolder1_Label2,
          #ctl00_ContentPlaceHolder1_blrec0,
          #ctl00_ContentPlaceHolder1_lblSwipe,
          #ctl00_ContentPlaceHolder1_lblFromDate,
          #ctl00_ContentPlaceHolder1_lblToDate,
          #ctl00_ContentPlaceHolder1_lblShift,
          #ctl00_ContentPlaceHolder1_lblShiftTo,
          #ctl00_ContentPlaceHolder1_lblInTime,
          #ctl00_ContentPlaceHolder1_lblOutTime,
          #ctl00_ContentPlaceHolder1_lbldays,
          #ctl00_ContentPlaceHolder1_lblQtr {
            display: block !important;
            margin-bottom: 5px !important;
            font-weight: 500 !important;
            color: #333 !important;
            font-size: 14px !important;
            position: relative !important;
            padding-left: 25px !important;
          }

          /* Add icons before labels */
          #ctl00_ContentPlaceHolder1_Label11::before {
            content: "👤" !important;
            position: absolute !important;
            left: 0 !important;
          }

          #ctl00_ContentPlaceHolder1_Label10::before {
            content: "📝" !important;
            position: absolute !important;
            left: 0 !important;
          }

          #ctl00_ContentPlaceHolder1_Label1::before {
            content: "🔄" !important;
            position: absolute !important;
            left: 0 !important;
          }

          #ctl00_ContentPlaceHolder1_Label2::before {
            content: "📋" !important;
            position: absolute !important;
            left: 0 !important;
          }

          #ctl00_ContentPlaceHolder1_blrec0::before {
            content: "👥" !important;
            position: absolute !important;
            left: 0 !important;
          }

          #ctl00_ContentPlaceHolder1_lblFromDate::before {
            content: "📅" !important;
            position: absolute !important;
            left: 0 !important;
          }

          #ctl00_ContentPlaceHolder1_lblToDate::before {
            content: "📅" !important;
            position: absolute !important;
            left: 0 !important;
          }

          #ctl00_ContentPlaceHolder1_lblInTime::before {
            content: "⏰" !important;
            position: absolute !important;
            left: 0 !important;
          }

          #ctl00_ContentPlaceHolder1_lblOutTime::before {
            content: "⏰" !important;
            position: absolute !important;
            left: 0 !important;
          }

          /* Submit and Clear buttons */
          .bebutton {
            background: linear-gradient(135deg, #ea580c, #fb923c) !important;
            color: white !important;
            padding: 12px 25px !important;
            border: none !important;
            border-radius: 8px !important;
            font-size: 16px !important;
            font-weight: 500 !important;
            margin: 10px !important;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1) !important;
            transition: all 0.3s ease !important;
            min-width: 120px !important;
          }

          /* Textarea */
          textarea.txtnewbigddl {
            min-height: 80px !important;
            resize: vertical !important;
          }

          /* Table layout */
          table {
            width: 100% !important;
            border-spacing: 0 8px !important;
          }

          td {
            padding: 8px !important;
            vertical-align: top !important;
          }

          /* Responsive adjustments */
          @media (max-width: 768px) {
            .x_content {
              padding: 15px !important;
            }
            
            td {
              display: block !important;
              width: 100% !important;
            }
          }
        \`;
        document.head.appendChild(attendanceFormStyles);

        // Add mobile form styles
        const mobileFormStyles = document.createElement('style');
        mobileFormStyles.textContent = \`
          #ctl00_ContentPlaceHolder1_Panel2 {
            display: flex !important;
            flex-direction: column !important;
            padding: 20px !important;
          }

          #ctl00_ContentPlaceHolder1_Panel2 table {
            display: flex !important;
            flex-direction: column !important;
            width: 100% !important;
            border: none !important;
          }

          #ctl00_ContentPlaceHolder1_Panel2 tr {
            display: flex !important;
            flex-direction: column !important;
            margin-bottom: 15px !important;
            width: 100% !important;
          }

          #ctl00_ContentPlaceHolder1_Panel2 td {
            display: block !important;
            width: 100% !important;
            padding: 5px 0 !important;
            border: none !important;
          }

          #ctl00_ContentPlaceHolder1_Panel2 input[type="text"],
          #ctl00_ContentPlaceHolder1_Panel2 select {
            width: 100% !important;
            height: 40px !important;
            padding: 10px !important;
            margin: 5px 0 !important;
            border: 1px solid #ddd !important;
            border-radius: 8px !important;
            font-size: 16px !important;
            background-color: white !important;
          }

          #ctl00_ContentPlaceHolder1_Panel2 input[type="submit"],
          #ctl00_ContentPlaceHolder1_Panel2 input[type="button"] {
            width: auto !important;
            min-width: 120px !important;
            padding: 12px 25px !important;
            margin: 5px !important;
            border: none !important;
            border-radius: 8px !important;
            font-size: 16px !important;
            font-weight: 500 !important;
            cursor: pointer !important;
          }

          #ctl00_ContentPlaceHolder1_btnSubmit {
            background: #ea580c !important;
            color: white !important;
          }

          #ctl00_ContentPlaceHolder1_btnClear {
            background: #6B7280 !important;
            color: white !important;
          }

          .modal-content {
            padding: 20px !important;
            border-radius: 12px !important;
            width: 90% !important;
            max-width: 500px !important;
            margin: 20px auto !important;
            background: white !important;
          }

          .x_panel, .x_title, .x_content {
            padding: 0 !important;
            margin: 0 !important;
            border: none !important;
            background: none !important;
          }

          .form-group {
            margin-bottom: 15px !important;
          }
        \`;
        document.head.appendChild(mobileFormStyles);
      }
      true;
    }
  `;

  const injectedJavaScriptForForms = `
    (function() {
      const style = document.createElement('style');
      style.textContent = \`
        /* Form Container */
        .x_content {
          padding: 20px !important;
          background: #fff !important;
          border-radius: 16px !important;
          box-shadow: 0 4px 20px rgba(0,0,0,0.08) !important;
          margin: 16px !important;
        }

        /* Hide nav menu and footer */
        .nav_menu, .footer {
          display: none !important;
        }

        .right_col {
          background: #f0f2f5 !important;
          margin: 0 !important;
        }

        /* Fix endless scrolling */
        #main_container {
          height: 100vh !important;
          overflow: hidden !important;
        }

        .container.body {
          height: 100vh !important;
          overflow: auto !important;
        }

        /* Form Layout */
        form {
          display: flex !important;
          flex-direction: column !important;
          gap: 16px !important;
        }

        .form-group {
          display: flex !important;
          flex-direction: column !important;
          margin-bottom: 8px !important;
        }

        /* Labels with Icons */
        label, span[id*="Label"], span[id*="lbl"] {
          display: flex !important;
          align-items: center !important;
          gap: 8px !important;
          margin-bottom: 10px !important;
          font-weight: 500 !important;
          color: #374151 !important;
          font-size: 15px !important;
        }

        label::before, span[id*="Label"]::before, span[id*="lbl"]::before {
          font-size: 18px !important;
        }

        /* Form Fields - Increased Height */
        .txtnewbig, .txtnewbigddl, select, input[type="date"], input[type="time"] {
          width: 100% !important;
          height: 50px !important;
          padding: 0 16px !important;
          border: 1px solid #e2e8f0 !important;
          border-radius: 12px !important;
          font-size: 16px !important;
          background: #f8fafc !important;
          margin-bottom: 16px !important;
          transition: all 0.2s ease !important;
        }

        /* Focus states */
        .txtnewbig:focus, .txtnewbigddl:focus, select:focus, input[type="date"]:focus, input[type="time"]:focus {
          border-color: #ea580c !important;
          box-shadow: 0 0 0 3px rgba(234, 88, 12, 0.1) !important;
          outline: none !important;
        }

        /* Select Dropdowns */
        select {
          appearance: none !important;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23475569' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E") !important;
          background-repeat: no-repeat !important;
          background-position: right 16px center !important;
          background-size: 18px !important;
          padding-right: 48px !important;
        }

        /* Employee Info Section */
        .employee-info {
          background: #f8fafc !important;
          padding: 20px !important;
          border-radius: 12px !important;
          margin-bottom: 24px !important;
        }

        /* Buttons Container */
        .button-container {
          display: flex !important;
          gap: 16px !important;
          margin-top: 24px !important;
          justify-content: space-between !important;
        }

        /* Submit and Clear buttons */
        .bebutton {
          flex: 1 !important;
          height: 54px !important;
          background: linear-gradient(135deg, #ea580c, #fb923c) !important;
          color: white !important;
          padding: 0 20px !important;
          border: none !important;
          border-radius: 12px !important;
          font-size: 16px !important;
          font-weight: 600 !important;
          box-shadow: 0 2px 4px rgba(234, 88, 12, 0.2) !important;
          transition: all 0.2s ease !important;
          text-align: center !important;
        }

        .bebutton:hover {
          transform: translateY(-1px) !important;
          box-shadow: 0 4px 6px rgba(234, 88, 12, 0.25) !important;
        }

        /* Icons for specific fields */
        #ctl00_ContentPlaceHolder1_Label11::before { content: "👤" !important; }
        #ctl00_ContentPlaceHolder1_Label10::before { content: "🆔" !important; }
        #ctl00_ContentPlaceHolder1_Label1::before { content: "🔄" !important; }
        #ctl00_ContentPlaceHolder1_Label2::before { content: "📋" !important; }
        #ctl00_ContentPlaceHolder1_blrec0::before { content: "👥" !important; }
        #ctl00_ContentPlaceHolder1_lblFromDate::before { content: "📅" !important; }
        #ctl00_ContentPlaceHolder1_lblToDate::before { content: "📅" !important; }
        #ctl00_ContentPlaceHolder1_lblInTime::before { content: "⏰" !important; }
        #ctl00_ContentPlaceHolder1_lblOutTime::before { content: "⏰" !important; }

        /* Textarea */
        textarea.txtnewbigddl {
          height: 120px !important;
          padding: 16px !important;
          resize: vertical !important;
        }

        /* Table to Flex conversion */
        table, tbody, tr, td {
          display: block !important;
          width: 100% !important;
        }

        tr {
          margin-bottom: 20px !important;
        }

        /* Form Title */
        .x_title h2 {
          font-size: 22px !important;
          color: #1e293b !important;
          font-weight: 600 !important;
          margin-bottom: 28px !important;
          text-align: center !important;
        }
      \`;
      document.head.appendChild(style);
    })();
    true;
  `;

  const injectedJavaScriptForReports = `
    (function() {
      // Create a wrapper for the ASP.NET __doPostBack function
      if (typeof(window.__doPostBack) === 'function') {
        const originalDoPostBack = window.__doPostBack;
        window.__doPostBack = function(eventTarget, eventArgument) {
          try {
            // Check if this is a report page
            if (window.location.href.includes('pgtimecardreporttotalemp.aspx') || 
                window.location.href.includes('pgTimeCardReport.aspx')) {
              
              // Get the form element
              const form = document.forms['aspnetForm'];
              if (form) {
                // Set the __EVENTTARGET and __EVENTARGUMENT
                const eventTargetElement = document.getElementById('__EVENTTARGET');
                const eventArgumentElement = document.getElementById('__EVENTARGUMENT');
                
                if (eventTargetElement && eventArgumentElement) {
                  eventTargetElement.value = eventTarget;
                  eventArgumentElement.value = eventArgument;
                  
                  // Submit the form normally
                  form.submit();
                  return true;
                }
              }
            }
            
            // For other pages, use the original function
            return originalDoPostBack(eventTarget, eventArgument);
          } catch (error) {
            console.error('Error in __doPostBack:', error);
            return false;
          }
        };
      }

      // Handle clicks on report links
      document.addEventListener('click', function(e) {
        const target = e.target;
        if (target && target.tagName === 'A') {
          const href = target.getAttribute('href');
          if (href && (
            href.includes('pgtimecardreporttotalemp.aspx') || 
            href.includes('pgTimeCardReport.aspx')
          )) {
            e.preventDefault();
            window.location.href = href;
          }
        }
      }, true);

      // Add form submit handler
      const form = document.forms['aspnetForm'];
      if (form) {
        form.onsubmit = function(e) {
          if (window.location.href.includes('pgtimecardreporttotalemp.aspx') || 
              window.location.href.includes('pgTimeCardReport.aspx')) {
            return true; // Allow form submission
          }
        };
      }
    })();
    true;
  `;

  const handleReportPress = (reportType) => {
    const url = reportType === 'timecard' 
      ? 'https://portal.dodladairy.com/pace/pgtimecardreporttotalemp.aspx'
      : 'https://portal.dodladairy.com/pace/pgTimeCardReport.aspx';
    setReportUrl(url);
    setIsReportVisible(true);
  };

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <SafeAreaView style={{ flex: 1 }}>
        {!isLoggedIn ? (
          // Login Form
          <LinearGradient colors={[colors.primary, colors.secondary]} style={loginStyles.container}>
            <View style={loginStyles.logoContainer}>
              <Text style={{
                fontSize: 28,
                fontWeight: 'bold',
                color: '#FFFFFF',
                textAlign: 'center',
                marginBottom: 10
              }}>DODLA DAIRY</Text>
              <Text style={{
                fontSize: 16,
                color: '#FFFFFF',
                textAlign: 'center',
                opacity: 0.9
              }}>Employee Portal</Text>
            </View>

            <View style={loginStyles.formContainer}>
              <View style={loginStyles.inputContainer}>
                <Ionicons 
                  name="person-outline" 
                  size={20} 
                  color={colors.primary} 
                  style={loginStyles.icon} 
                />
                <TextInput
                  style={loginStyles.input}
                  placeholder="Employee ID"
                  value={username}
                  onChangeText={setUsername}
                  placeholderTextColor={colors.placeholder}
                />
              </View>

              <View style={loginStyles.inputContainer}>
                <Ionicons 
                  name="lock-closed-outline" 
                  size={20} 
                  color={colors.primary} 
                  style={loginStyles.icon} 
                />
                <TextInput
                  style={loginStyles.input}
                  placeholder="Password"
                  secureTextEntry
                  value={password}
                  onChangeText={setPassword}
                  placeholderTextColor={colors.placeholder}
                />
              </View>

              <TouchableOpacity 
                style={loginStyles.loginButton} 
                onPress={handleLogin}
              >
                <Text style={loginStyles.loginButtonText}>Login</Text>
              </TouchableOpacity>

              <View style={loginStyles.rememberContainer}>
                <TouchableOpacity 
                  style={[
                    loginStyles.checkbox,
                    rememberMe && loginStyles.checkboxChecked
                  ]}
                  onPress={() => setRememberMe(!rememberMe)}
                >
                  {rememberMe && (
                    <Ionicons name="checkmark" size={16} color={colors.secondary} />
                  )}
                </TouchableOpacity>
                <Text style={loginStyles.rememberText}>Remember me</Text>
                <TouchableOpacity>
                  <Text style={loginStyles.forgotPassword}>
                    Forgot Password?
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </LinearGradient>
        ) : (
          // WebView after login
          <View style={{ flex: 1 }}>
            <WebView
              ref={webViewRef}
              source={{ uri: BASE_URL }}
              style={styles.webView}
              onLoadStart={() => setIsLoading(true)}
              onLoadEnd={() => setIsLoading(false)}
              onError={handleError}
              onNavigationStateChange={handleWebViewNavigationStateChange}
              injectedJavaScript={injectedJavaScript}
              injectedJavaScriptBeforeContentLoaded={injectedJavaScriptBeforeContentLoaded}
              javaScriptEnabled={true}
              domStorageEnabled={true}
              startInLoadingState={true}
              scalesPageToFit={true}
              allowFileAccess={true}
              cacheEnabled={true}
              allowUniversalAccessFromFileURLs={true}
              onShouldStartLoadWithRequest={(request) => {
                // Always allow form submissions
                if (request.url.includes('pgtimecardreporttotalemp.aspx') || 
                    request.url.includes('pgTimeCardReport.aspx')) {
                  return true;
                }
                // For other URLs, use normal navigation handling
                return handleWebViewNavigationStateChange({ url: request.url });
              }}
              mixedContentMode="compatibility"
            />
            {isLoading && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#ea580c" />
              </View>
            )}
            {hasError && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>Failed to load the page</Text>
                <TouchableOpacity style={styles.retryButton} onPress={retry}>
                  <Text style={styles.retryText}>Retry</Text>
                </TouchableOpacity>
              </View>
            )}
            {isFormVisible && (
              <View style={styles.formModal}>
                <TouchableOpacity 
                  style={styles.closeButton}
                  onPress={() => {
                    setIsFormVisible(false);
                    setCurrentFormUrl('');
                    // Navigate back to main page
                    webViewRef.current?.goBack();
                  }}
                >
                  <Text style={styles.closeText}>×</Text>
                </TouchableOpacity>
                <WebView
                  source={{ uri: currentFormUrl }}
                  style={styles.webView}
                  injectedJavaScript={injectedJavaScriptForForms}
                  javaScriptEnabled={true}
                  domStorageEnabled={true}
                />
              </View>
            )}
            {isReportVisible && (
              <View style={styles.formModal}>
                <TouchableOpacity 
                  style={styles.closeButton}
                  onPress={() => {
                    setIsReportVisible(false);
                    setReportUrl('');
                  }}
                >
                  <Text style={styles.closeText}>×</Text>
                </TouchableOpacity>
                <WebView
                  source={{ uri: reportUrl }}
                  style={styles.webView}
                  injectedJavaScript={injectedJavaScriptForReports}
                  javaScriptEnabled={true}
                  domStorageEnabled={true}
                />
              </View>
            )}
          </View>
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}