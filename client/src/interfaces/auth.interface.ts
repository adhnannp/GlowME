export interface User {
    _id: string;
    username?:string;
    email: string;
    profile_image?:string;
    isAdmin: boolean;
    badge?:string;
    xp?:number;
    questions_explored?:number;
    ban_expires_at?: string | null;
    isBlock?:boolean;
    created_at?:string;
    edited_at?: string;
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