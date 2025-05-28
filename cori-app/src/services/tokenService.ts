const TOKEN_KEY = "jwt_token";

const tokenService = {
  getToken(): string | null {
    const token = localStorage.getItem(TOKEN_KEY);
    console.log("🔐 tokenService.getToken →", token);
    return token;
  },

  setToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
    console.log("💾 tokenService.setToken →", token);
  },

  clearToken(): void {
    localStorage.removeItem(TOKEN_KEY);
    console.log("🧹 tokenService.clearToken → Token cleared");
  },
};

export default tokenService;
