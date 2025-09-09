"use client";
import { useContext } from "react";

import { ProfileContext } from "@/@core/contexts/profileContext";

export const useProfile = () => {
  const context = useContext(ProfileContext);

  if (!context) {
    throw new Error("useProfileContext must be used within a ProfileProvider");
  }

  return context;
};
