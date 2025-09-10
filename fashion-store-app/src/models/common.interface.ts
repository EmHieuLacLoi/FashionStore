export interface User {
  id: number;
  email: string;
  full_name: string;
  gender: number;
  note: string;
  phone_number: string;
  username: string;
}

export interface AuthRequest {
  username: string;
  password: string;
}

export interface Role {
  id: number;
  name: string;
  code: string;
}
