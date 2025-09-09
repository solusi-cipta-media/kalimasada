import axiosInstanceNoIntercept from "@/client/axiosInstanceNoIntercept";

export const getProfile = async () => {
  const response = await axiosInstanceNoIntercept.get("/api/account/profile");

  return response;
};
