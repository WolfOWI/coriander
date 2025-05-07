import api from "./api.service";
import axios from "axios";

export interface CurrentUserDTO {
  userId: number;
  fullName: string;
  email: string;
  role: string;
  isLinked: boolean;
  employeeId?: number;
  adminId?: number;
  profilePicture?: string;
  isVerified: boolean;
}

export async function getCurrentUser(): Promise<CurrentUserDTO | null> {
  try {
    // pull the token straight out of the "token" cookie
    const tokenCookie = document.cookie
      .split("; ")
      .find((c) => c.startsWith("token="));
    if (!tokenCookie) {
      console.error("⚠️ No JWT token found in cookies");
      return null;
    }
    const token = tokenCookie.split("=")[1];
    console.log("🔑 Retrieved JWT token:", token);

    // hit your decode-token endpoint
    const { data } = await api.get<CurrentUserDTO>(`/Auth/decode-token/`, {
      params: { token },
    });

    console.log("✅ decode-token response:", data);
    return data;
  } catch (err) {
    console.error("❌ getCurrentUser failed:", err);
    return null;
  }
}

// ✅ Call 1: Google Login
export const userGoogleLogin = async (
  idToken: string
): Promise<{ errorCode: number; message: string }> => {
  console.log("🔐 userGoogleLogin: sending token to /google-login:", idToken);

  try {
    const res = await api.post(
      "/Auth/google-login",
      { idToken },
      { withCredentials: true }
    );
    console.log("✅ userGoogleLogin: success:", res.status, res.data);
    return {
      errorCode: res.status,
      message: res.data || "Login successful",
    };
  } catch (err: any) {
    const status = err?.response?.status || 500;
    console.error("❌ userGoogleLogin: failed:", status, err);
    return {
      errorCode: status,
      message: "Google login failed",
    };
  }
};

export interface GoogleSignInResult {
  errorCode: number;
  message: string;
}

/**
 * All-in-one Google sign-in:
 * 1) calls userGoogleLogin(idToken)
 * 2) calls getCurrentUser()
 * → returns only errorCode/message
 */
export async function fullGoogleSignIn(
  idToken: string
): Promise<GoogleSignInResult> {
  console.log("🔑 fullGoogleSignIn → idToken:", idToken);

  try {
    // 1️⃣ perform the login step
    const loginResult = await userGoogleLogin(idToken);
    console.log("✅ userGoogleLogin result:", loginResult);

    // if loginResult.errorCode !== 200, bubble it up
    if (loginResult.errorCode !== 200) {
      return loginResult;
    }

    // 2️⃣ fetch the current user
    const user = await getCurrentUser();
    console.log("📡 getCurrentUser result:", user);

    // 3️⃣ check link status
    if (!user || !user.isLinked) {
      return {
        errorCode: 403,
        message: "User account not linked",
      };
    }

    return {
      errorCode: 200,
      message: "Login successful, user linked",
    };
  } catch (err: any) {
    console.error("🔴 fullGoogleSignIn unexpected error:", err);
    return {
      errorCode: err.response?.status ?? 500,
      message: err.message || "Unknown error",
    };
  }
}

export async function logout(): Promise<void> {
  try {
    // 1️⃣ Tell the backend to clear its cookie
    await api.post("/Auth/logout", null, { withCredentials: true });
  } catch (err) {
    console.error("Logout request failed:", err);
  }

  // 2️⃣ Remove the token from document.cookie
  // (expires it immediately, path must match where you set it)
  document.cookie = [
    "token=",
    "Path=/",
    "Expires=Thu, 01 Jan 1970 00:00:00 GMT",
  ].join("; ");

  // 3️⃣ Redirect to your login page
  window.location.href = "/";
}
