import React from "react";
import { MobileSidebar } from "./MobileSidebar";
import { NavbarRoutes } from "@/components/shared/navbar-routes";

export const Navbar = () => {
  return (
    <div className="p-4 border-b h-full flex items-center bg-white shadow-sm">
      <MobileSidebar />
      <NavbarRoutes />
    </div>
  );
};
