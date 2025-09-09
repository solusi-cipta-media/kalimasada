"use server";
import getConfig from "next/config";

const getNextConfig = () => {
  const { publicRuntimeConfig } = getConfig();

  return publicRuntimeConfig;
};

export default getNextConfig;
