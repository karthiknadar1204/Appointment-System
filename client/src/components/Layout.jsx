import React from "react";
import "../styles/Layout.css";
import { adminMenu, userMenu } from "../Data/data";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { message, Badge } from "antd";

const Layout = ({ children }) => {
  const user = useSelector((state) => state.users.user);
  const location = useLocation();
  const Navigate = useNavigate();

  // Check if user is null or undefined
  if (!user) {
    // You can return a loading indicator or handle the null user state here
    return <div>Loading...</div>;
  }
  const doctorMenu = [ 
    {
      name: "Home",
      path: "/",
      icon: "fa-solid fa-house",
    },
    {
      name: "Appointments",
      path: "/doctor-appointments",
      icon: "fa-solid fa-list",
    },
    {
      name: "Profile",
      path: `/doctor/profile/${user?._id}`,
      icon: "fa-solid fa-user",
    },
  ];

  const SidebarMenu = user?.isAdmin
    ? adminMenu
    : user?.isDoctor
    ? doctorMenu
    : userMenu;

  const handleLogout = () => {
    localStorage.clear();
    message.success("Logout Successfully");
    Navigate("/login");
  };

  return (
    <>
      <div className="main">
        <div className="layout">
          <div className="sidebar">
            <div className="logo">
              <h6>DOC APP</h6>
              <hr />
            </div>
            <div className="menu">
              {SidebarMenu.map((menu) => {
                const isActive = location.pathname === menu.path;
                return (
                  <div
                    key={menu.path}
                    className={`menu-item ${isActive && "active"}`}
                  >
                    <i className={menu.icon}></i>
                    <Link to={menu.path}>{menu.name}</Link>
                  </div>
                );
              })}

              <div className={`menu-item`} onClick={handleLogout}>
                <i className="fa-solid fa-right-from-bracket"></i>
                <Link to={"/login"}>LogOut</Link>
              </div>
            </div>
          </div>
          <div className="content">
            <div className="header">
              <div className="header-content" style={{ cursor: "pointer" }}>
                <Badge
                  count={user?.notification.length}
                  onClick={() => {
                    Navigate("/notification");
                  }}
                >
                  <i className="fa-solid fa-bell"></i>
                </Badge>
                <Link to="/profile">{user.name}</Link>
              </div>
            </div>
            <div className="body">{children}</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Layout;
