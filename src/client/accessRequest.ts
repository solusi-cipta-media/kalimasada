import type { FeatureAccess } from "@/types/featureAccess";
import axiosInstance from "./axiosInstance";
import type ResponseFormat from "@/types/ResponseFormat";

export const requestGetFeatures = async (props?: { parentId?: number; showOnSideBar?: boolean }) => {
  const param = [];

  if (props?.parentId !== undefined) {
    param.push(`parentId=${props?.parentId}`);
  }

  if (props?.showOnSideBar !== undefined) {
    param.push(`showOnSideBar=${props?.showOnSideBar}`);
  }

  const response = await axiosInstance.get("/api/access?" + param.join("&"));

  return response.data as ResponseFormat<FeatureAccess[]>;
};
