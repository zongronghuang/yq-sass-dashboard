import { TOKEN_KEY } from "../constants";

export const validateEmail = (email: FormDataEntryValue | null) => {
  if (!email || typeof email !== "string") return false;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: FormDataEntryValue | null) => {
  if (!password || typeof password !== "string") return false;

  const passwordRegex = /^[0-9a-zA-Z]+$/;
  return passwordRegex.test(password);
};

export const getToken = () => {
  const token = localStorage.getItem(TOKEN_KEY);
  return token;
};
