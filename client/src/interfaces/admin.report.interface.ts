export interface Report {
  _id: string;
  reporter: {
    _id: string;
    username: string;
    email: string;
    profile_image: string;
  };
  reported_user: {
    _id: string;
    username: string;
    email: string;
    profile_image: string;
  };
  reason: string;
  status: string;
  created_at: string;
}

export interface ReportedUser {
  reportedUser: {
    _id: string;
    username: string;
    email: string;
    profile_image: string;
    coin_balance: number;
    questions_explored: number;
    isAdmin:boolean;
  };
  reports: Report[];
}

export interface ApiResponse {
  message: string;
  reports: ReportedUser[];
}