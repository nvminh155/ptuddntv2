"use client";

import Checkbox from "@/components/Checkbox";
import PasswordStrengthIndicator from "@/components/PasswordStrengthIndicator";
import { COLORS } from "@/constants";
import { useAuth } from "@/contexts/auth-context";
import Icon from "@expo/vector-icons/Feather";
import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RegisterScreen({ navigation }: any) {
  const { register } = useAuth();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);

  // Error states
  const [usernameError, setUsernameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [termsError, setTermsError] = useState("");

  const validateUsername = (name: string) => {
    if (!name) {
      setUsernameError("Username is required");
      return false;
    } else if (name.length < 2) {
      setUsernameError("Username must be at least 2 characters");
      return false;
    }
    setUsernameError("");
    return true;
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setEmailError("Email is required");
      return false;
    } else if (!emailRegex.test(email)) {
      setEmailError("Invalid email address");
      return false;
    }
    setEmailError("");
    return true;
  };

  const validatePassword = (password: string) => {
    if (!password) {
      setPasswordError("Password is required");
      return false;
    } else if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      return false;
    }
    setPasswordError("");
    return true;
  };

  const validateConfirmPassword = (confirmPassword: string) => {
    if (!confirmPassword) {
      setConfirmPasswordError("Please confirm your password");
      return false;
    } else if (confirmPassword !== password) {
      setConfirmPasswordError("Passwords do not match");
      return false;
    }
    setConfirmPasswordError("");
    return true;
  };

  const validateTerms = () => {
    if (!acceptTerms) {
      setTermsError("You must agree to the terms of service");
      return false;
    }
    setTermsError("");
    return true;
  };

  const handleRegister = async () => {
    const isUsernameValid = validateUsername(username);
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);
    const isConfirmPasswordValid = validateConfirmPassword(confirmPassword);
    const isTermsAccepted = validateTerms();

    if (
      !isUsernameValid ||
      !isEmailValid ||
      !isPasswordValid ||
      !isConfirmPasswordValid ||
      !isTermsAccepted
    ) {
      return;
    }

    setIsLoading(true);

    // Simulate API call
    try {
      await register(username, email, password);

      setIsLoading(false);
      // For demo, we'll just show a success message
      Alert.alert(
        "Registration Successful",
        "Your account has been created successfully. Please log in to continue.",
        [
          {
            text: "OK",
            onPress: () => router.push("/login"),
          },
        ]
      );
    } catch (error: any) {
      setIsLoading(false);
      Alert.alert(
        "Registration Failed",
        error?.message ||
          "An error occurred during registration. Please try again."
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView contentContainerStyle={styles.scrollView}>
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Icon name="arrow-left" size={24} color={COLORS.gray} />
            </TouchableOpacity>
            <View style={styles.logoContainer}>
              <Icon name="user-plus" size={32} color={COLORS.primary} />
            </View>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>
              Register to start chatting with AI
            </Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Username</Text>
              <View
                style={[
                  styles.inputWrapper,
                  usernameError
                    ? styles.inputWrapperError
                    : username
                    ? styles.inputWrapperFilled
                    : null,
                ]}
              >
                <Icon
                  name="user"
                  size={20}
                  color={COLORS.lightGray}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Enter your username"
                  placeholderTextColor={COLORS.lightGray}
                  value={username}
                  onChangeText={(text) => {
                    setUsername(text);
                    if (usernameError) validateUsername(text);
                  }}
                  onBlur={() => validateUsername(username)}
                />
              </View>
              {usernameError ? (
                <Text style={styles.errorText}>{usernameError}</Text>
              ) : null}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email</Text>
              <View
                style={[
                  styles.inputWrapper,
                  emailError
                    ? styles.inputWrapperError
                    : email
                    ? styles.inputWrapperFilled
                    : null,
                ]}
              >
                <Icon
                  name="mail"
                  size={20}
                  color={COLORS.lightGray}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Enter your email"
                  placeholderTextColor={COLORS.lightGray}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    if (emailError) validateEmail(text);
                  }}
                  onBlur={() => validateEmail(email)}
                />
              </View>
              {emailError ? (
                <Text style={styles.errorText}>{emailError}</Text>
              ) : null}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Password</Text>
              <View
                style={[
                  styles.inputWrapper,
                  passwordError
                    ? styles.inputWrapperError
                    : password
                    ? styles.inputWrapperFilled
                    : null,
                ]}
              >
                <Icon
                  name="lock"
                  size={20}
                  color={COLORS.lightGray}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Create a password"
                  placeholderTextColor={COLORS.lightGray}
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    if (passwordError) validatePassword(text);
                    if (confirmPassword)
                      validateConfirmPassword(confirmPassword);
                  }}
                  onBlur={() => validatePassword(password)}
                />
                <TouchableOpacity
                  style={styles.visibilityIcon}
                  onPress={() => setShowPassword(!showPassword)}
                  activeOpacity={0.7}
                >
                  <Icon
                    name={showPassword ? "eye-off" : "eye"}
                    size={20}
                    color={COLORS.lightGray}
                  />
                </TouchableOpacity>
              </View>
              {password ? (
                <PasswordStrengthIndicator password={password} />
              ) : null}
              {passwordError ? (
                <Text style={styles.errorText}>{passwordError}</Text>
              ) : null}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Confirm Password</Text>
              <View
                style={[
                  styles.inputWrapper,
                  confirmPasswordError
                    ? styles.inputWrapperError
                    : confirmPassword
                    ? styles.inputWrapperFilled
                    : null,
                ]}
              >
                <Icon
                  name="lock"
                  size={20}
                  color={COLORS.lightGray}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Re-enter your password"
                  placeholderTextColor={COLORS.lightGray}
                  secureTextEntry={!showConfirmPassword}
                  value={confirmPassword}
                  onChangeText={(text) => {
                    setConfirmPassword(text);
                    if (confirmPasswordError) validateConfirmPassword(text);
                  }}
                  onBlur={() => validateConfirmPassword(confirmPassword)}
                />
                <TouchableOpacity
                  style={styles.visibilityIcon}
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  activeOpacity={0.7}
                >
                  <Icon
                    name={showConfirmPassword ? "eye-off" : "eye"}
                    size={20}
                    color={COLORS.lightGray}
                  />
                </TouchableOpacity>
              </View>
              {confirmPasswordError ? (
                <Text style={styles.errorText}>{confirmPasswordError}</Text>
              ) : null}
            </View>

            <View style={styles.termsContainer}>
              <Checkbox
                checked={acceptTerms}
                onToggle={() => {
                  setAcceptTerms(!acceptTerms);
                  if (termsError) validateTerms();
                }}
              />
              <View style={styles.termsTextContainer}>
                <Text style={styles.termsText}>
                  I agree to the{" "}
                  <Text style={styles.termsLink}>Terms of Service</Text> and{" "}
                  <Text style={styles.termsLink}>Privacy Policy</Text>
                </Text>
              </View>
            </View>
            {termsError ? (
              <Text style={[styles.errorText, styles.termsError]}>
                {termsError}
              </Text>
            ) : null}

            <TouchableOpacity
              style={[
                styles.registerButton,
                (!username ||
                  !email ||
                  !password ||
                  !confirmPassword ||
                  !acceptTerms ||
                  isLoading) &&
                  styles.registerButtonDisabled,
              ]}
              onPress={handleRegister}
              disabled={
                !username ||
                !email ||
                !password ||
                !confirmPassword ||
                !acceptTerms ||
                isLoading
              }
              activeOpacity={0.8}
            >
              {isLoading ? (
                <ActivityIndicator color={COLORS.white} size="small" />
              ) : (
                <Text style={styles.registerButtonText}>Register</Text>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => router.push("/login")}>
              <Text style={styles.loginText}>Log in</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 10,
    paddingBottom: 40,
  },
  header: {
    alignItems: "center",
    marginBottom: 30,
    position: "relative",
  },
  backButton: {
    position: "absolute",
    left: 0,
    top: 0,
    zIndex: 10,
  },
  logoContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#FFF1ED", // Light version of primary
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: COLORS.black,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.lightGray,
    textAlign: "center",
  },
  form: {
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.gray,
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.lightGray3,
    borderRadius: 12,
    backgroundColor: COLORS.white,
    height: 56,
    paddingHorizontal: 16,
  },
  inputWrapperFilled: {
    borderColor: COLORS.primary,
  },
  inputWrapperError: {
    borderColor: COLORS.lightRed,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: COLORS.black,
    height: "100%",
  },
  visibilityIcon: {
    padding: 8,
  },
  errorText: {
    fontSize: 12,
    color: COLORS.lightRed,
    marginTop: 4,
    marginLeft: 4,
  },
  termsContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginVertical: 16,
  },
  termsTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  termsText: {
    fontSize: 14,
    color: COLORS.lightGray,
    lineHeight: 20,
  },
  termsLink: {
    color: COLORS.primary,
    fontWeight: "500",
  },
  termsError: {
    marginTop: -12,
    marginBottom: 16,
  },
  registerButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    height: 56,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
  },
  registerButtonDisabled: {
    backgroundColor: "#FBB8A2", // Lighter version of primary
    opacity: 0.7,
  },
  registerButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.white,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24,
  },
  footerText: {
    fontSize: 14,
    color: COLORS.lightGray,
  },
  loginText: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.primary,
  },
});
