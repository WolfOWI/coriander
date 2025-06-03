import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CoriBtn from "./buttons/CoriBtn";
import { Icons } from "../constants/icons";
import { logout, navbarUserStatus } from "../services/authService";
import logo from "../assets/logos/cori_logo_green.png";

// MUI Icons:
import LoginIcon from "@mui/icons-material/Login";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import HomeIcon from "@mui/icons-material/Home";
import EventNoteIcon from "@mui/icons-material/EventNote";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import GroupsIcon from "@mui/icons-material/Groups";
import BuildIcon from "@mui/icons-material/Build";
import AssignmentIcon from "@mui/icons-material/Assignment";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import CodeIcon from "@mui/icons-material/Code";
import ApiIcon from "@mui/icons-material/Api";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";

const Navigation: React.FC = () => {
  const [userStatus, setUserStatus] = useState<number | null>(null); // -1, 0, 1, 2
  const [devMode, setDevMode] = useState<boolean>(false);

  useEffect(() => {
    const checkStatus = async () => {
      const status = await navbarUserStatus();
      setUserStatus(status);
    };
    checkStatus();
  }, []);

  return (
    <div className="w-[296px] flex-shrink-0 z-10">
      {/* Sidebar */}
      <div className="fixed top-4 left-4 bg-zinc-900 text-white w-[260px] rounded-3xl h-[calc(100vh-32px)] overflow-hidden">
        <div className="p-10 h-full overflow-y-auto flex flex-col justify-between">
          <div className="flex flex-col">
            <img src={logo} alt="Coriander" className="mb-4 w-full" />
            {/* Auth Links */}
            {userStatus === -1 || userStatus === 0 ? (
              <div className="mb-4 flex flex-col gap-2">
                <small className="text-corigreen-500 text-uppercase">
                  Authentication
                </small>
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
            ) : null}

            {/* Employee Links */}
            {userStatus === 1 && (
              <div className="mb-4 flex flex-col gap-1">
                <small className="text-corigreen-500 text-uppercase">
                  Employee
                </small>
                <Link
                  to="/employee/home"
                  className="nav-link text-white flex items-center gap-2"
                >
                  <HomeIcon fontSize="small" />
                  Home
                </Link>

                <Link
                  to="/employee/leave-overview"
                  className="nav-link text-white flex items-center gap-2"
                >
                  <EventNoteIcon fontSize="small" />
                  My Leave
                </Link>

                <Link
                  to="/employee/meetings"
                  className="nav-link text-white flex items-center gap-2"
                >
                  <MeetingRoomIcon fontSize="small" />
                  My Meetings
                </Link>

                <Link
                  to="/employee/profile"
                  className="nav-link text-white flex items-center gap-2"
                >
                  <AccountCircleIcon fontSize="small" />
                  Your Profile
                </Link>
              </div>
            )}

            {/* Admin Links */}
            {userStatus === 2 && (
              <div className="mb-4 flex flex-col gap-2">
                <small className="text-corigreen-500 text-uppercase">
                  Admin
                </small>
                <Link
                  to="/admin/dashboard"
                  className="nav-link text-white flex items-center gap-2"
                >
                  <AdminPanelSettingsIcon fontSize="small" />
                  Admin Dashboard
                </Link>

                <Link
                  to="/admin/employees"
                  className="nav-link text-white flex  gap-2"
                >
                  <GroupsIcon fontSize="small" />
                  Employee Management
                </Link>

                <Link
                  to="/admin/equipment"
                  className="nav-link text-white flex items-center gap-2"
                >
                  <BuildIcon fontSize="small" />
                  Equipment
                </Link>

                <Link
                  to="/admin/create-employee"
                  className="nav-link text-white flex items-center gap-2"
                >
                  <PersonAddAltIcon fontSize="small" />
                  Create Employee
                </Link>

                <Link
                  to="/admin/leave-requests"
                  className="nav-link text-white flex items-center gap-2"
                >
                  <AssignmentIcon fontSize="small" />
                  Leave Requests
                </Link>

                <Link
                  to="/admin/meetings"
                  className="nav-link text-white flex items-center gap-2"
                >
                  <MeetingRoomIcon fontSize="small" />
                  Meetings
                </Link>
                {/* <Link to="/admin/individual-employee" className="nav-link text-white">
              Individual Employee
            </Link> */}
              </div>
            )}

            {/* Reference links only if dev mode is enabled */}
            {devMode && (
              <div className="mb-4">
                <small className="text-corigreen-500 text-uppercase">
                  Reference
                </small>
                <Link to="/reference" className="nav-link text-white">
                  Custom Stuffies
                </Link>
                <Link
                  to="/temp-modals/leave-overview"
                  className="nav-link text-white"
                >
                  Modals: Leave Overv
                </Link>
                <Link
                  to="/temp-modals/admin-dash"
                  className="nav-link text-white"
                >
                  Modals: Admin Dash
                </Link>
                <Link to="/apiplayground" className="nav-link text-white">
                  API Playground - do not remove
                </Link>
                <Link
                  to="/temp-new-gathering-box"
                  className="nav-link text-white"
                >
                  New Meeting / Gathering Box
                </Link>
              </div>
            )}
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
