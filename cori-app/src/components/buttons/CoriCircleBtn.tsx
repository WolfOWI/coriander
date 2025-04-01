// Wolf Botha - 01/04/2025

import React from "react";
import "../../styles/buttons.css";
import { Button } from "react-bootstrap";

// PrimaryBtn Properties
interface PrimaryBtnProps {
  onClick?: () => void;
  children?: React.ReactNode;
  className?: string;
  style?: "default" | "black" | "red";
  type?: "button" | "submit";
  icon: React.ReactElement<{ fontSize?: "small" | "medium" | "large" }>;
}

// Add props using destructuring
const CoriCircleBtn = ({ onClick, className, style, type, icon }: PrimaryBtnProps) => {
  // Default styles
  let btnStyles = "";
  switch (style) {
    case "default":
      btnStyles =
        "bg-corigreen-500 text-white border-2 border-corigreen-500 hover:bg-corigreen-600 hover:border-corigreen-600";
      break;
    case "black":
      btnStyles =
        "bg-zinc-500 text-zinc-50 border-2 border-zinc-500 hover:bg-zinc-900 hover:text-zinc-50 hover:border-zinc-900";
      break;
    case "red":
      btnStyles =
        "bg-red-700 text-white border-2 border-red-700 hover:bg-red-800 hover:border-red-800";
      break;
    default:
      btnStyles =
        "bg-corigreen-500 text-white border-2 border-corigreen-500 hover:bg-corigreen-600 hover:border-corigreen-600";
      break;
  }
  return (
    <Button
      onClick={onClick}
      type={type}
      className={`${btnStyles} flex items-center justify-center h-8 w-8 rounded-full cori-btn ${className}`}
    >
      {React.isValidElement(icon) && React.cloneElement(icon, { fontSize: "small" })}
    </Button>
  );
};

export default CoriCircleBtn;
