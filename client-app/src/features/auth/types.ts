export type SignInFlow = "signIn" | "signUp";

export type User = {
  name: string;
  email: string;
  avatar?: string;
};

export type SignUpRequest = {
  name: string;
  email: string;
  password: string;
  avatar?: string;
};

export type SignInRequest = {
  email: string;
  password: string;
};
