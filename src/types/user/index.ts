export interface User {
  id: string;
  email: string;
  name: string | null;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserSession {
  user: User | null;
  loading: boolean;
  refetch: () => Promise<void>;
}
