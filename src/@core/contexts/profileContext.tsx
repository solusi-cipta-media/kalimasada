"use client";
import React, { createContext } from "react";

import { useQuery } from "@tanstack/react-query";

import { getProfile } from "@/@core/utils/getProfile";

export const ProfileContext = createContext<any>(null);

export const ProfileProvider = ({ children }: { children: React.ReactNode }) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
    select: (response) => {
      return response.data?.data;
    }
  });

  const refreshProfile = () => {
    refetch();
  };

  return (
    <ProfileContext.Provider value={{ data, isLoading, error, refreshProfile }}>{children}</ProfileContext.Provider>
  );
};
