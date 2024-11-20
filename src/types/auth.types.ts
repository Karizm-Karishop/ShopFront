export interface User {
  user_id: number; // Unique ID
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  profile_picture?: string; // Optional
  status?: string; // Optional
  isVerified?: boolean; // Optional
  is2FAEnabled?: boolean; // Optional
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
  