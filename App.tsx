import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, ActivityIndicator, Text, TouchableOpacity, TextInput, Platform, Alert } from 'react-native';
import { WebView } from 'react-native-webview';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors, loginStyles } from './assets/styles';

export default function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showWebView, setShowWebView] = useState(false);
  const [showSavePrompt, setShowSavePrompt] = useState(false);
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
    setIsLoggedIn(true);

    // Show save credentials prompt if not remembered
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
      }, 1500); // Show after a brief delay
    }
  };

  const handleError = () => {
    setHasError(true);
    setIsLoading(false);
    setIsLoggedIn(false);
    setShowWebView(false);
  };

  const retry = () => {
    setHasError(false);
    setIsLoading(true);
  };

  useEffect(() => {
    if (rememberMe) {
      saveCredentials();
    } else {
      clearCredentials();
    }
  }, [rememberMe]);

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
      height: 100% !important;
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
  `;

  const injectedJavaScriptBeforeContentLoaded = `
    window.onload = () => {
      if(window.location.href.includes('pglogin.aspx')) {
        document.getElementById('txtUserName').value = '${username}';
        document.getElementById('txtPassword').value = '${password}';
        document.getElementById('btnLogin').click();
      } else {
        const style = document.createElement('style');
        style.textContent = ${JSON.stringify(customStyles)};
        document.head.appendChild(style);

        // Add Font Awesome
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css';
        document.head.appendChild(link);

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
      }
      true;
    }
  `;

  if (hasError) {
    return (
      <SafeAreaProvider>
        <StatusBar style="light" />
        <SafeAreaView style={loginStyles.container}>
          <LinearGradient
            colors={['#0066CC', '#0044AA']}
            style={loginStyles.gradientBackground}
          >
            <View style={loginStyles.errorContainer}>
              <Ionicons name="warning-outline" size={60} color={colors.secondary} />
              <Text style={[loginStyles.errorText, { color: colors.secondary }]}>
                Unable to connect to Dodla Dairy
              </Text>
              <Text style={[loginStyles.errorSubText, { color: colors.secondary }]}>
                Please check your internet connection
              </Text>
              <TouchableOpacity 
                style={[loginStyles.loginButton, { backgroundColor: colors.secondary }]} 
                onPress={retry}
              >
                <Text style={[loginStyles.loginButtonText, { color: colors.primary }]}>
                  Retry
                </Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  if (isLoggedIn) {
    return (
      <SafeAreaProvider>
        <StatusBar style="light" />
        <SafeAreaView style={loginStyles.container}>
          <View style={{ flex: 1, backgroundColor: colors.primary }}>
            <WebView
              ref={webViewRef}
              source={{ uri: 'https://portal.dodladairy.com/pace/pglogin.aspx' }}
              style={{ 
                flex: 1,
                display: showWebView ? 'flex' : 'none'
              }}
              onLoadStart={() => setIsLoading(true)}
              onNavigationStateChange={(navState) => {
                if (!navState.url.includes('pglogin.aspx')) {
                  setIsLoading(false);
                  setShowWebView(true);
                }
              }}
              onError={handleError}
              javaScriptEnabled={true}
              domStorageEnabled={true}
              injectedJavaScriptBeforeContentLoaded={injectedJavaScriptBeforeContentLoaded}
              onMessage={(event) => {
                console.log('Message from WebView:', event.nativeEvent.data);
              }}
            />
            {!showWebView && (
              <View 
                style={[
                  loginStyles.loadingOverlay, 
                  { 
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: colors.primary,
                    zIndex: 1000
                  }
                ]}
              >
                <ActivityIndicator size="large" color={colors.secondary} />
                <Text style={{ color: colors.secondary, marginTop: 10 }}>Logging in...</Text>
              </View>
            )}
          </View>
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <SafeAreaView style={loginStyles.container}>
        <LinearGradient
          colors={['#0066CC', '#0044AA']}
          style={loginStyles.gradientBackground}
        >
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
      </SafeAreaView>
    </SafeAreaProvider>
  );
}