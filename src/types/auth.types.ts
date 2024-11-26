export interface User {
  user_id: number; 
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  profile_picture?: string | null;
  status?: string; 
  isVerified?: boolean; 
  is2FAEnabled?: boolean; 
}

  
  export interface LoginResponse {
    success: boolean;
    message: string;
    data: {
      user: User;
      token: string;
    };
  }
  
  export interface LoginCredentials {
    email: string;
    password: string;
  }
  