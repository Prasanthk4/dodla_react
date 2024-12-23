import { StyleSheet } from 'react-native';

export const colors = {
  primary: '#0066CC',
  secondary: '#FFFFFF',
  background: '#F5F7FA',
  text: '#333333',
  placeholder: '#A0A0A0',
  error: '#FF3B30',
};

export const loginStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  gradientBackground: {
    flex: 1,
    padding: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: '15%',
    marginBottom: 30,
  },
  logo: {
    width: 150,
    height: 60,
    resizeMode: 'contain',
  },
  formContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  inputContainer: {
    marginBottom: 15,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    paddingLeft: 45,
    fontSize: 16,
    color: colors.text,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  icon: {
    position: 'absolute',
    left: 15,
    top: 15,
  },
  loginButton: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  loginButtonText: {
    color: colors.secondary,
    fontSize: 16,
    fontWeight: '600',
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginTop: 10,
    color: colors.primary,
  },
  rememberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: colors.primary,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: colors.primary,
  },
  rememberText: {
    color: colors.text,
    fontSize: 14,
  },
  backgroundImage: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
});
