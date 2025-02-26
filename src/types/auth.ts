
export type UserRole = 'office_staff' | 'business_owner';

export interface LoginFormData {
  username: string;
  password: string;
}

export interface LoginProps {
  onLogin: (data: LoginFormData) => void;
  onForgotPassword: (email: string) => void;
}
