export interface User {
    id: string;
    email: string;
    isAdmin: boolean;
}

export interface UserCredentials {
  email: string;
  password: string;
}

export interface RegisterUserData extends UserCredentials {
  username: string;
}
  
export interface Otp{
  otp:string;
  email:string;
}

export interface accessToken{
  accessToken:string;
}