// token.service.ts
// Handles all client-side JWT cookie operations.

export default class TokenService {
  private static readonly TOKEN_KEY = "token";

  // Retrieves the JWT token from cookies
  static getToken(): string | null {
    const cookies = document.cookie.split("; ");
    const tokenCookie = cookies.find((cookie) =>
      cookie.startsWith(`${this.TOKEN_KEY}=`)
    );
    return tokenCookie ? tokenCookie.split("=")[1] : null;
  }

  // Sets the JWT token as a cookie
  static setToken(token: string): void {
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 7); // Set expiration to 7 days from now
    document.cookie = `${
      this.TOKEN_KEY
    }=${token}; Path=/; Secure; HttpOnly; SameSite=Strict; Expires=${expirationDate.toUTCString()}`;
  }

  // Clears the JWT token cookie
  static clearToken(): void {
    document.cookie = `${this.TOKEN_KEY}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 UTC; Secure; HttpOnly; SameSite=Strict`;
  }
}
