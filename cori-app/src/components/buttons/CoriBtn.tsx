// Wolf Botha - 27/03/2025

import React from "react";
import { Button } from "react-bootstrap";

// PrimaryBtn Properties
interface PrimaryBtnProps {
  onClick?: () => void;
  children?: React.ReactNode;
  className?: string;
  hierarchy?: "primary" | "secondary";
  style?: "default" | "black" | "red";
}

// Add props using destructuring
const CoriBtn = ({ onClick, children, className, hierarchy, style }: PrimaryBtnProps) => {
  // Button Styles (depending on hierarchy and style)
  let btnStyles = "";
  let btnVariant = "";

  if (hierarchy === "primary") {
    btnVariant = "primary";
    switch (style) {
      case "default":
        btnStyles =
          "bg-corigreen-500 text-white border-2 border-corigreen-500 hover:bg-corigreen-600 hover:border-corigreen-600";
        break;
      case "black":
        btnStyles =
          "bg-zinc-800 text-zinc-50 border-2 border-zinc-800 hover:bg-zinc-900 hover:text-zinc-50 hover:border-zinc-900";
        break;
      case "red":
        btnStyles =
          "bg-red-500 text-white border-2 border-red-500 hover:bg-red-600 hover:border-red-600";
        break;
      default:
        btnStyles =
          "bg-corigreen-500 text-white border-2 border-corigreen-500 hover:bg-corigreen-600 hover:border-corigreen-600";
        break;
    }
  } else if (hierarchy === "secondary") {
    btnVariant = "outline-primary";
    switch (style) {
      case "default":
        btnStyles =
          "border-2 border-corigreen-500 text-corigreen-500 hover:bg-corigreen-500 hover:text-white hover:border-corigreen-500";
        break;
      case "black":
        btnStyles =
          "border-2 border-zinc-800 text-zinc-800 hover:bg-zinc-800 hover:text-white hover:border-zinc-800";
        break;
      case "red":
        btnStyles =
          "border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white hover:border-red-500";
        break;
      default:
        btnStyles =
          "border-2 border-corigreen-500 text-corigreen-500 hover:bg-corigreen-500 hover:text-white hover:border-corigreen-500";
        break;
    }
  }

  return (
    <Button
      variant={btnVariant}
      onClick={onClick}
      className={`${btnStyles} flex items-center gap-2 h-12 rounded-lg ${className} `}
    >
      {children}
    </Button>
  );
};

export default CoriBtn;
