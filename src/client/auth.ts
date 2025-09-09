import axios from "axios";

export const requestLogin = async ({ email, password }: { email: string; password: string }) => {
  const response = await axios.post("/api/auth/login", { email, password });

  return response.data;
};

export const requestLogout = async () => {
  const response = await axios.get("/api/auth/logout");

  return response.data;
};
