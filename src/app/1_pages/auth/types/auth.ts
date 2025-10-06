import { USER_ROLE } from "./role.enum";

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  phone: string;
  role: USER_ROLE;
  isBlocked: boolean;
  isDeleted: boolean;
}

// export interface AuthTokens {
//   accessToken: string;
//   refreshToken: string;
// }

export interface LoginResponse {
  //   tokens: AuthTokens;
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
