import api from "./api.service";
import axios from "axios";
import tokenService from "./tokenService";
import { Navigate } from "react-router-dom"; // Import navigate for redirection

export interface AuthResult {
  errorCode: number;
  message: string;
}

export interface CurrentUserDTO {
  userId: number;
  fullName: string;
  email: string;
  role: number;
  isLinked: boolean;
  employeeId?: number;
  adminId?: number;
  profilePicture?: string;
  isVerified: boolean;
}

interface RegisterVerifiedDTO {
  FullName: string;
  Email: string;
  Password: string;
  code: string;
  role: number;
  profileImage?: File;
}

// Sign Up Functions ----------------------------------------------------------------------------

// Email Sign ups
// requestEmailVerification
export async function requestEmailVerification(input: {
  fullName: string;
  email: string;
}): Promise<AuthResult> {
  try {
    const res = await api.post("/Auth/request-verification", {
      fullName: input.fullName,
      email: input.email,
    });

    return {
      errorCode: res.status,
      message: res.data || "Verification code sent to email",
    };
  } catch (err: any) {
    const code = err?.response?.status || 500;
    const message =
      err?.response?.data || "Verification request failed (Bad Request)";
    return { errorCode: code, message };
  }
}

export async function employeeSignup2FA(form: {
  fullName: string;
  email: string;
  password: string;
  code: string;
  profileImage?: File;
}): Promise<AuthResult> {
  const fd = new FormData();

  // ✅ IMPORTANT: Match the PascalCase DTO fields
  fd.append("FullName", form.fullName);
  fd.append("Email", form.email);
  fd.append("Password", form.password);
  fd.append("Code", form.code);
  fd.append("Role", "1"); // Employee = 1 (as per your enum)

  if (form.profileImage) {
    fd.append("ProfileImage", form.profileImage);
  }

  // Debug the actual form data being sent
  console.log("📦 employeeSignup2FA → FormData Preview:");
  fd.forEach((value, key) => {
    console.log(`→ ${key}:`, value);
  });

  try {
    const res = await fetch(
      "http://localhost:5121/api/Auth/register-verified",
      {
        method: "POST",
        body: fd,
      }
    );

    const data = await res.json();

    return {
      errorCode: res.status,
      message: data.message || "Employee account created",
    };
  } catch (err: any) {
    console.error("❌ employeeSignup2FA → Fetch error:", err);
    return {
      errorCode: 500,
      message: "Something went wrong during employee registration",
    };
  }
}

// adminSignup2FA
export async function adminSignup2FA(form: {
  email: string;
  fullName: string;
  password: string;
  code: string;
  profileImage?: File;
}): Promise<AuthResult> {
  try {
    const formData = new FormData();
    formData.append("Email", form.email);
    formData.append("FullName", form.fullName);
    formData.append("Password", form.password);
    formData.append("Code", form.code);
    formData.append("Role", "2"); // 2 = Admin
    if (form.profileImage) {
      formData.append("ProfileImage", form.profileImage);
    }

    const res = await api.post("/Auth/register-admin-verified", formData, {
      withCredentials: true,
    });

    return {
      errorCode: res.status,
      message: res.data || "Admin account created",
    };
  } catch (err: any) {
    const code = err?.response?.status || 500;
    const message = err?.response?.data || "Admin signup failed";
    return { errorCode: code, message };
  }
}

// Google Sign ups

// employeeGoogleSignUp
/**
 * Registers a user using their Google ID token.
 *
 * @param {string} idToken - The Google ID token.
 * @returns {Promise<AuthResult>} The result of the registration attempt.
 */
export const employeeGoogleSignUp = async (
  idToken: string
): Promise<AuthResult> => {
  try {
    const res = await api.post("/Auth/google-register", { idToken });
    return {
      errorCode: res.status,
      message: res.data || "Google registration successful",
    };
  } catch (err: any) {
    const status = err?.response?.status || 500;
    return {
      errorCode: status,
      message: "Google registration failed",
    };
  }
};

// adminGoogleSignUp
export const adminGoogleSignUp = async (
  idToken: string
): Promise<AuthResult> => {
  try {
    const res = await api.post("/Auth/google-register-admin", { idToken });
    return {
      errorCode: res.status,
      message: res.data || "Google registration successful",
    };
  } catch (err: any) {
    const status = err?.response?.status || 500;
    return {
      errorCode: status,
      message: "Google registration failed",
    };
  }
};

// Login Functions ----------------------------------------------------------------------------

/**
 * Logs in a user using their email and password.
 *
 * @param {string} email - The user's email.
 * @param {string} password - The user's password.
 * @returns {Promise<AuthResult>} The result of the login attempt.
 */
export const loginWithEmail = async (
  email: string,
  password: string
): Promise<AuthResult> => {
  try {
    const res = await api.post(
      "/Auth/login",
      { email, password },
      { withCredentials: true }
    );
    return {
      errorCode: res.status,
      message: res.data || "Login successful",
    };
  } catch (err: any) {
    const status = err?.response?.status || 500;
    return {
      errorCode: status,
      message: "Incorrect email or password",
    };
  }
};

/**
 * Logs in a user using their Google ID token.
 *
 * @param {string} idToken - The Google ID token.
 * @returns {Promise<AuthResult>} The result of the login attempt.
 */
export const loginWithGoogle = async (idToken: string): Promise<AuthResult> => {
  try {
    const res = await api.post(
      "/Auth/google-login",
      { idToken },
      { withCredentials: true }
    );
    return {
      errorCode: res.status,
      message: res.data || "Google login successful",
    };
  } catch (err: any) {
    const status = err?.response?.status || 500;
    return {
      errorCode: status,
      message: "Google login failed",
    };
  }
};

// Full logins - Login + session management ------------------------------------------------------------

/**
 * Performs a full email login process.
 *
 * @param {string} email - The user's email.
 * @param {string} password - The user's password.
 * @returns {Promise<AuthResult>} The result of the login process.
 */
export const fullEmailLogin = async (
  email: string,
  password: string
): Promise<AuthResult> => {
  // 1️⃣ Perform the email/password login
  const loginResult = await loginWithEmail(email, password);
  if (loginResult.errorCode !== 200) {
    return loginResult;
  }

  // 2️⃣ Fetch user details
  const user = await getCurrentUser();
  if (!user) {
    return { errorCode: 404, message: "Could not fetch user details." };
  }

  // 3️⃣ Ensure they’re “linked”
  if (!user.isLinked) {
    return { errorCode: 300, message: "User account not linked." };
  }

  // 4️⃣ Redirect based on role
  if (user.adminId) {
    window.location.href = "/admin/dashboard";
  } else if (user.employeeId) {
    window.location.href = "/employee/home";
  } else {
    return { errorCode: 403, message: "Unrecognized user role." };
  }

  return { errorCode: 200, message: "Login successful." };
};

/**
 * Performs a full Google sign-in process.
 *
 * @param {string} idToken - The Google ID token.
 * @returns {Promise<AuthResult>} The result of the sign-in process.
 */
export const fullGoogleSignIn = async (
  idToken: string
): Promise<AuthResult> => {
  // Step 1: Perform the Google login
  const loginResult = await loginWithGoogle(idToken);

  // If login fails, return the error result
  if (loginResult.errorCode !== 200) {
    return loginResult;
  }

  // Step 2: Fetch the current user's details
  const user = await getCurrentUser();

  // Step 3: Check if the user's account is linked
  if (!user || !user.isLinked) {
    return {
      errorCode: 200,
      message: "User account not linked",
    };
  }

  // Step 4: Check if the user is an Employee or an Admin and redirect
  if (user.adminId) {
    window.location.href = "/admin/dashboard"; // Redirect to admin dashboard
  } else if (user.employeeId) {
    window.location.href = "/employee/home"; // Redirect to employee home
  } else {
    return {
      errorCode: 403,
      message: "User role not recognized",
    };
  }

  // Step 5: Return success if the user is linked and redirected
  return {
    errorCode: 200,
    message: "Login successful",
  };
};

// Session management ----------------------------------------------------------------------------

/**
 * Retrieves the current user's information by decoding the JWT token.
 *
 * @returns {Promise<CurrentUserDTO | null>} The current user's details or null.
 */
export const getCurrentUser = async (): Promise<CurrentUserDTO | null> => {
  try {
    const token = tokenService.getToken();
    if (!token) {
      return null;
    }

    const { data } = await api.get<CurrentUserDTO>("/Auth/decode-token", {
      params: { token },
    });

    return data;
  } catch {
    return null;
  }
};

/**
 * Retrieves the current user's information and redirects if not linked.
 * This function is used to ensure that the user is linked before accessing certain pages.
 *
 * @returns {Promise<CurrentUserDTO | null>} The current user's details or null.
 */
export const getFullCurrentUser = async (): Promise<CurrentUserDTO | null> => {
  const user = await getCurrentUser();

  if (!user) {
    window.location.href = "/";
    return null;
  } else if (!user.isLinked) {
    window.location.href = "/#notlinked";
    return null;
  } else {
    return user;
  }
};

/**
 * Checks if the user is linked and redirects them accordingly.
 *
 * @returns {Promise<CurrentUserDTO | null>} The current user's details or null.
 */
export const checkIfUserIsLinked = async (): Promise<AuthResult> => {
  const user = await getCurrentUser();

  if (!user || !user.isLinked) {
    window.location.href = "/#notlinked";
    console.log("User not linked");
    return { errorCode: 400, message: "Your account haven't been linked yet" };
  } else if (user.adminId) {
    window.location.href = "/admin/dashboard"; // Redirect to admin dashboard
    return { errorCode: 200, message: "Welcome " + user.fullName };
  } else if (user.employeeId) {
    window.location.href = "/employee/home"; // Redirect to employee home
    return { errorCode: 200, message: "Welcome " + user.fullName };
  }

  // Default return statement to handle all code paths
  return { errorCode: 500, message: "Unexpected error occurred" };
};

/**
 * Retrieves the current user's secured information.
 *
 * @returns {Promise<CurrentUserDTO | null>} The current user's details or null.
 */
export const getSecuredUser = async (): Promise<CurrentUserDTO | null> => {
  try {
    const { data } = await api.get<CurrentUserDTO>("/Auth/me", {
      withCredentials: true,
    });
    return data;
  } catch {
    return null;
  }
};

/**
 * Logs out the current user.
 *
 * @param {boolean} [redirect=true] - Whether to redirect to the login page.
 * @returns {Promise<void>} Resolves when the logout process is complete.
 */
export const logout = async (redirect = true): Promise<void> => {
  try {
    await api.post("/Auth/logout", null, { withCredentials: true });
  } catch (err) {
    console.error("Logout request failed:", err);
  }

  tokenService.clearToken();

  if (redirect) {
    window.location.href = "/";
  }
};

// ---------------------------------------------
