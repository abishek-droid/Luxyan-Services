export enum UserRole {
  ADMIN = 'Admin',
  SUPERVISOR = 'Supervisor',
  CLEANER = 'Cleaner',
  CLIENT = 'Client',
}

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}

export interface User {
  name: string;
  email: string;
  role: UserRole;
  status: 'approved' | 'pending';
  avatar: string; 
}
