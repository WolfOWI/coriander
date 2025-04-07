import React from "react";
import CoriBtn from "../../components/buttons/CoriBtn";
import { useNavigate } from "react-router-dom";
const AdminSignUp: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-zinc-900">Admin Sign Up</h1>
      <CoriBtn type="submit" style="black" onClick={() => navigate("/admin/dashboard")}>
        Skip Sign Up
      </CoriBtn>
    </div>
  );
};

export default AdminSignUp;
