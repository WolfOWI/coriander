import React from "react";
import { Link } from "react-router-dom";

const Navigation: React.FC = () => {
  return (
    <div className="flex-grow-0 mr-8">
      {/* Sidebar */}
      <div className="bg-zinc-900 text-white w-fit rounded-3xl h-full">
        <div className="p-10">
          <h1 className="text-2xl font-bold mb-4">Coriander</h1>

          {/* Auth Links */}
          <div className="mb-4">
            <small className="text-corigreen-500 text-uppercase">Authentication</small>
            <Link to="/" className="nav-link text-white">
              Login
            </Link>
            <Link to="/employee/signup" className="nav-link text-white">
              Employee Sign Up
            </Link>
            <Link to="/admin/signup" className="nav-link text-white">
              Admin Sign Up
            </Link>
          </div>

          {/* Employee Links */}
          <div className="mb-4">
            <small className="text-corigreen-500 text-uppercase">Employee</small>
            <Link to="/employee/home" className="nav-link text-white">
              Employee Home
            </Link>
            <Link to="/employee/leave-overview" className="nav-link text-white">
              Leave Overview
            </Link>
            <Link to="/employee/profile" className="nav-link text-white">
              Employee Profile
            </Link>
          </div>

          {/* Admin Links */}
          <div className="mb-4">
            <small className="text-corigreen-500 text-uppercase">Admin</small>
            <Link to="/admin/dashboard" className="nav-link text-white">
              Admin Dashboard
            </Link>
            <Link to="/admin/employee-management" className="nav-link text-white">
              Employee Management
            </Link>
            <Link to="/admin/create-employee" className="nav-link text-white">
              Create Employee
            </Link>
            <Link to="/admin/individual-employee" className="nav-link text-white">
              Individual Employee
            </Link>
            <Link to="/admin/leave-requests" className="nav-link text-white">
              Leave Requests
            </Link>
          </div>

          <div className="mb-4">
            <small className="text-corigreen-500 text-uppercase">Reference</small>
            <Link to="/reference" className="nav-link text-white">
              Custom Stuffies
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navigation;
