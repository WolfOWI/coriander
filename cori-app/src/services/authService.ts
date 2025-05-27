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

  fd.append("FullName", form.fullName);
  fd.append("Email", form.email);
  fd.append("Password", form.password);
  fd.append("Code", form.code);
  fd.append("Role", "1"); // Employee role

  if (form.profileImage) {
    fd.append("ProfileImage", form.profileImage);
  }

  console.log("📦 employeeSignup2FA → FormData Preview:");
  fd.forEach((value, key) => {
    console.log(`→ ${key}:`, value);
  });

  try {
    const res = await fetch(
      "https://coriander-backend.onrender.com/api/Auth/register-verified",
      {
        method: "POST",
        body: fd,
      }
    );

    const data = await res.json();

    if (res.status === 200 || res.status === 201) {
      console.log("✅ Signup successful, logging in...");

      // 🔐 Attempt to login after successful signup
      const loginResult = await fullEmailLogin(form.email, form.password);

      window.location.href = "/employee/home";

      // Combine messages if needed
      return {
        errorCode: loginResult.errorCode,
        message: loginResult.message,
      };
    }

    return {
      errorCode: res.status,
      message: data.message || "Employee account created, but login skipped",
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
  fullName: string;
  email: string;
  password: string;
  code: string;
  profileImage?: File;
}): Promise<AuthResult> {
  const fd = new FormData();

  fd.append("FullName", form.fullName);
  fd.append("Email", form.email);
  fd.append("Password", form.password);
  fd.append("Code", form.code);
  fd.append("Role", "2"); // Admin role

  if (form.profileImage) {
    fd.append("ProfileImage", form.profileImage);
  }

  console.log("📦 adminSignup2FA → FormData Preview:");
  fd.forEach((value, key) => {
    console.log(`→ ${key}:`, value);
  });

  try {
    const res = await fetch(
      "https://coriander-backend.onrender.com/api/Auth/register-admin-verified",
      {
        method: "POST",
        body: fd,
      }
    );

    const data = await res.json();

    if (res.status === 200 || res.status === 201) {
      console.log("✅ Admin signup successful, logging in...");

      // 🔐 Attempt to login after successful signup
      const loginResult = await fullEmailLogin(form.email, form.password);

      window.location.href = "/admin/dashboard";

      return {
        errorCode: loginResult.errorCode,
        message: loginResult.message,
      };
    }

    return {
      errorCode: res.status,
      message: data.message || "Admin account created, but login skipped",
    };
  } catch (err: any) {
    console.error("❌ adminSignup2FA → Fetch error:", err);
    return {
      errorCode: 500,
      message: "Something went wrong during admin registration",
    };
  }
}

// Google Sign ups
export const employeeGoogleSignUp = async (
  idToken: string
): Promise<AuthResult> => {
  const role = 1;

  try {
    const response = await loginWithGoogle(idToken, role);

    if (response.errorCode !== 200) {
      return {
        errorCode: response.errorCode,
        message: response.message,
      };
    }

    const user = await getCurrentUser();

    if (!user || !user.isLinked || !user.employeeId) {
      window.location.href = "/#notlinked";
      return {
        errorCode: 200,
        message:
          "Account created, but employee profile is not yet linked. Please wait for activation.",
      };
    }

    window.location.href = "/employee/home";

    return {
      errorCode: 200,
      message: "Employee account created and logged in successfully.",
    };
  } catch (error: any) {
    console.error("❌ Employee Google signup failed:", error);
    return {
      errorCode: 500,
      message: "Something went wrong during employee Google signup.",
    };
  }
};

// adminGoogleSignUp
export const adminGoogleSignUp = async (
  idToken: string
): Promise<AuthResult> => {
  const role = 2;

  try {
    const response = await loginWithGoogle(idToken, role);

    if (response.errorCode !== 200) {
      return {
        errorCode: response.errorCode,
        message: response.message,
      };
    }

    const user = await getCurrentUser();

    if (!user || !user.adminId || !user.isLinked) {
      return {
        errorCode: 403,
        message: "Admin role not linked properly. Please contact support.",
      };
    }

    window.location.href = "/admin/dashboard";

    return {
      errorCode: 200,
      message: "Admin account created and logged in successfully.",
    };
  } catch (error: any) {
    console.error("Admin Google signup failed:", error);
    return {
      errorCode: 500,
      message: "Something went wrong during admin Google signup.",
    };
  }
};

// Login Functions ----------------------------------------------------------------------------

export const loginWithEmail = async (
  email: string,
  password: string
): Promise<AuthResult> => {
  console.log("📤 loginWithEmail: Request started", { email });

  try {
    const res = await api.post(
      "/Auth/login",
      { email, password },
      {
        withCredentials: true,
        timeout: 25000, // ⏱️ Increased timeout to handle slow Render.com
      }
    );

    console.log("🐞 loginWithEmail: Full server response →", res);

    if (res.data && res.data.token) {
      console.log("✅ loginWithEmail: Token found →", res.data.token);
      tokenService.setToken(res.data.token);
      console.log(
        "🔐 loginWithEmail: Token stored in localStorage →",
        res.data.token
      );
    } else {
      console.warn(
        "⚠️ loginWithEmail: No token found in response.data →",
        res.data
      );
    }

    return {
      errorCode: res.status,
      message: res.data.message || "Login successful",
    };
  } catch (err: any) {
    console.error("❌ loginWithEmail: Request failed", err);

    const status = err?.response?.status || 500;
    const message =
      err?.response?.data?.message || "Incorrect email or password";

    // Extra log for slow connection insight
    if (err.code === "ECONNABORTED") {
      console.error("⏰ loginWithEmail: Request timeout hit after 25s.");
    }

    return {
      errorCode: status,
      message,
    };
  }
};

export const loginWithGoogle = async (
  idToken: string,
  role: number
): Promise<AuthResult> => {
  console.log("📤 loginWithGoogle: Sending request...");
  console.log("🪪 loginWithGoogle: ID Token:", idToken);
  console.log("👤 loginWithGoogle: Role:", role);

  try {
    const res = await api.post(
      "/Auth/google-login",
      { idToken, role },
      { withCredentials: true }
    );

    console.log("✅ loginWithGoogle: Request successful");
    console.log("📥 loginWithGoogle: Response status →", res.status);
    console.log("📥 loginWithGoogle: Response data →", res.data);

    if (res.data?.token) {
      tokenService.setToken(res.data.token);
      console.log(
        "🔐 loginWithGoogle: Token stored in cookies →",
        res.data.token
      );
    } else {
      console.warn(
        "⚠️ loginWithGoogle: No token returned in response data →",
        res.data
      );
    }

    return {
      errorCode: res.status,
      message: res.data?.message || "Google login successful",
    };
  } catch (err: any) {
    console.error("❌ loginWithGoogle: Request failed");
    console.error("📛 loginWithGoogle: Error object →", err);

    const status = err?.response?.status || 500;
    const responseData = err?.response?.data;

    console.error("📥 loginWithGoogle: Response status →", status);
    console.error("📥 loginWithGoogle: Response data →", responseData);

    return {
      errorCode: status,
      message: responseData?.message || "Google login failed",
    };
  }
};

// Full logins - Login + session management ------------------------------------------------------------

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

export const fullGoogleSignIn = async (
  idToken: string
): Promise<AuthResult> => {
  console.log("📤 fullGoogleSignIn: Starting login process");

  // 1️⃣ Perform the Google login
  const loginResult = await loginWithGoogle(idToken, 0); // 0 = Sign In

  if (loginResult.errorCode !== 200) {
    console.warn("❌ fullGoogleSignIn: Google login failed", loginResult);
    return loginResult;
  }

  // 2️⃣ Fetch user details
  const user = await getCurrentUser();

  if (!user) {
    console.warn("❌ fullGoogleSignIn: Could not fetch user details.");
    return { errorCode: 404, message: "Could not fetch user details." };
  }

  // 3️⃣ Ensure the user is “linked”
  if (!user.isLinked) {
    console.warn("⚠️ fullGoogleSignIn: User account not linked.");
    return { errorCode: 300, message: "User account not linked." };
  }

  // 4️⃣ Redirect based on user role
  if (user.adminId) {
    console.log("✅ fullGoogleSignIn: Redirecting to admin dashboard");
    window.location.href = "/admin/dashboard";
  } else if (user.employeeId) {
    console.log("✅ fullGoogleSignIn: Redirecting to employee home");
    window.location.href = "/employee/home";
  } else {
    console.error("❌ fullGoogleSignIn: Unrecognized user role");
    return { errorCode: 403, message: "Unrecognized user role." };
  }

  return { errorCode: 200, message: "Login successful." };
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

    console.log("getCurrentUserLog: Retrieved token →", token);

    if (!token) {
      console.warn("getCurrentUserLog: No token found, returning null.");
      return null;
    }

    const response = await api.get<CurrentUserDTO>("/Auth/decode-token", {
      params: { token },
    });

    console.log("getCurrentUserLog: Response status →", response.status);
    console.log("getCurrentUserLog: Response data →", response.data);

    return response.data;
  } catch (error: any) {
    console.error(
      "getCurrentUserLog: Error occurred during token decode →",
      error
    );
    if (error?.response) {
      console.error(
        "getCurrentUserLog: Server response status →",
        error.response.status
      );
      console.error(
        "getCurrentUserLog: Server response data →",
        error.response.data
      );
    }
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
