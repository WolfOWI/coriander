import React from "react";
import CoriBtn from "../../components/buttons/CoriBtn";
import { useNavigate } from "react-router-dom";
const EmployeeSignUp: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-zinc-900">Employee Sign Up</h1>
      <CoriBtn type="submit" style="black" onClick={() => navigate("/employee/home")}>
        Skip Sign Up
      </CoriBtn>
    </div>
  );
};

export default EmployeeSignUp;
