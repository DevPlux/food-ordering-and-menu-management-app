export const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

type LoginInput = { email: string; password: string };
export const validateLogin = ({ email, password }: LoginInput) => {
  const errors: Record<string, string> = {};
  if (!email) errors.email = "Email is required";
  else if (!isEmail(email)) errors.email = "Enter a valid email";
  if (!password) errors.password = "Password is required";
  return errors;
};

type RegisterInput = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};
export const validateRegister = ({
  name,
  email,
  password,
  confirmPassword,
}: RegisterInput) => {
  const errors: Record<string, string> = {};
  if (!name) errors.name = "Name is required";
  if (!email) errors.email = "Email is required";
  else if (!isEmail(email)) errors.email = "Enter a valid email";
  if (!password) errors.password = "Password is required";
  else if (password.length < 6) errors.password = "Minimum 6 characters";
  if (password !== confirmPassword)
    errors.confirmPassword = "Passwords do not match";
  return errors;
};
