import type { Metadata } from "next";

// Third-party Imports
import "react-perfect-scrollbar/dist/css/styles.css";

// Type Imports
import type { ChildrenType } from "@core/types";

// Style Imports
import "@/app/globals.css";
import "@/styles/sweetalert.css";

// Generated Icon CSS Imports
import "@assets/iconify-icons/generated-icons.css";

export const metadata: Metadata = {
  title: "Kalimasada - Spa & Salon Management System",
  description: "Kalimasada - Spa & Salon Management System",
  icons: {
    icon: "/logo.svg"
  }
};

const RootLayout = ({ children }: ChildrenType) => {
  // Vars
  const direction = "ltr";

  return (
    <html id='__next' lang='en' dir={direction}>
      <body className='flex is-full min-bs-full flex-auto flex-col'>{children}</body>
    </html>
  );
};

export default RootLayout;
