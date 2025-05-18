import React from "react";
import { Link } from "react-router-dom";
import CoriBtn from "./buttons/CoriBtn";
import { Icons } from "../constants/icons";
import { logout } from "../services/authService";
import logo from "../assets/logos/cori_logo_green.png";

const Navigation: React.FC = () => {
  return (
    <div className="w-[296px] flex-shrink-0">
      {/* Sidebar */}
      <div className="fixed top-4 left-4 bg-zinc-900 text-white w-[260px] rounded-3xl h-[calc(100vh-32px)] overflow-hidden">
        <div className="p-10 h-full overflow-y-auto flex flex-col justify-between">
          <div className="flex flex-col">
            <img src={logo} alt="Coriander" className="mb-4 w-full" />
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
              <Link to="/employee/meetings" className="nav-link text-white">
                My Meetings
              </Link>
            </div>

            {/* Admin Links */}
            <div className="mb-4">
              <small className="text-corigreen-500 text-uppercase">Admin</small>
              <Link to="/admin/dashboard" className="nav-link text-white">
                Admin Dashboard
              </Link>
              <Link to="/admin/employees" className="nav-link text-white">
                Employee Management
              </Link>
              <Link to="/admin/create-employee" className="nav-link text-white">
                Create Employee
              </Link>
              <Link to="/admin/equipment" className="nav-link text-white">
                Equipment
              </Link>
              {/* <Link to="/admin/individual-employee" className="nav-link text-white">
              Individual Employee
            </Link> */}
              <Link to="/admin/leave-requests" className="nav-link text-white">
                Leave Requests
              </Link>
              <Link to="/admin/meetings" className="nav-link text-white">
                Meetings
              </Link>
            </div>

            <div className="mb-4">
              <small className="text-corigreen-500 text-uppercase">Reference</small>
              <Link to="/reference" className="nav-link text-white">
                Custom Stuffies
              </Link>
              <Link to="/temp-modals/leave-overview" className="nav-link text-white">
                Modals: Leave Overv
              </Link>
              <Link to="/temp-modals/admin-dash" className="nav-link text-white">
                Modals: Admin Dash
              </Link>
              <Link to="/apiplayground" className="nav-link text-white">
                API Playground - do not remove
              </Link>
            </div>
          </div>

          <CoriBtn style="black" className="w-full" onClick={logout}>
            Logout
          </CoriBtn>
        </div>
      </div>
    </div>
  );
};

export default Navigation;
