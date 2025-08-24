import type { ReactNode } from "react";
export interface Point {
  x: number;
  y: number;
}
export interface MenuItem {
  key: string;
  label: string;
  icon?: React.ReactNode;
  children?: MenuItem[];
}

export interface TabItem {
  key: string;
  label: string;
  icon: ReactNode;
}

export interface ToolItem {
  key: string;
  label: string;
  icon?: ReactNode;
}

export interface Tools {
  [key: string]: ToolItem[];
}
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

export interface Permission {
  id: number;
  name: string;
  group: string;
  note?: string;
}

export interface Role {
  id: number;
  name: string;
  code: string;
}
