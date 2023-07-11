export type User = {
  id: string;
  username: string;
  email: string;
  password?: string;
};

export type UserLogin = Pick<User, "email" | "password">;
export type UserRegister = Pick<User, "username" | "email" | "password">;
