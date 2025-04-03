import React, { JSX } from "react";
import { EmployType } from "../../types/common";
import CoriBadge from "./CoriBadge";

interface EmployTypeBadgeProps {
  status: EmployType | "suspended";
}

function EmployTypeBadge({ status }: EmployTypeBadgeProps) {
  let component: JSX.Element;

  switch (status) {
    case "suspended":
      component = <CoriBadge text="Suspended" color="red" size="small" />;
      break;
    case EmployType.FullTime:
      component = <CoriBadge text="Full Time" color="green" size="small" />;
      break;
    case EmployType.PartTime:
      component = <CoriBadge text="Part Time" color="orange" size="small" />;
      break;
    case EmployType.Contract:
      component = <CoriBadge text="Contract" color="blue" size="small" />;
      break;
    case EmployType.Intern:
      component = <CoriBadge text="Intern" color="yellow" size="small" />;
      break;
    default:
      component = <CoriBadge text="Unknown" color="white" size="small" />;
      break;
  }

  return component;
}

export default EmployTypeBadge;
