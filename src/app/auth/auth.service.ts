import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() {}

  // Giữ lại các hàm rỗng để tránh lỗi khi được gọi ở nơi khác
  Signin(username: string, password: string): Promise<boolean> {
    return Promise.resolve(true);
  }

  logout(): void {}

  getCurrentUser(): any {
    return null;
  }

  getCurrentUserRole(): string | null {
    return null;
  }

  isLoggedIn(): boolean {
    return true;
  }

  hasPermission(permission: string): boolean {
    return true;
  }
}
