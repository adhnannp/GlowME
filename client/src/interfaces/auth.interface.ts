export interface User {
    _id: string;
    email: string;
    isAdmin: boolean;
    profile_image?:string;
    username?:string;
    created_at?:string;
    questions_explored?:number;
    badge?:string;
    xp?:number;
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