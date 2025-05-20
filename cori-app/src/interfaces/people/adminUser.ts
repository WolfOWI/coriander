// AdminUserDTO in backend

export interface AdminUser {
  adminId: number;
  userId: number;
  email: string | null;
  fullName: string | null;
}