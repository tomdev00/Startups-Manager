import React, { useContext, useEffect, useState } from "react";
import "../styles/client.css";
import { Layout, Menu } from "antd";
import { Content, Header } from "antd/es/layout/layout";

import { Routes, Route, useNavigate } from "react-router-dom";
import Home from "../pages/Home";
import Startup from "../pages/Startup";
import Login from "../pages/Login";
import Favourites from "../pages/Favourites";
import Register from "../pages/Register";
import Profile from "../pages/Profile";
import "../App.css";
import { getCookie } from "../connections/connection";

import { AiFillHome } from "react-icons/ai";
import { MdFavoriteBorder } from "react-icons/md";
import { AiOutlineLogin } from "react-icons/ai";
import { RiLogoutCircleLine } from "react-icons/ri";
import { RiFileList3Line } from "react-icons/ri";
import { RxHamburgerMenu } from "react-icons/rx";
import { CgProfile } from "react-icons/cg";
import Sider from "antd/es/layout/Sider";
import { useLogin } from "../context/loginProvider";

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  // const [isLoggedIn, setIsLoggedIn] = useState(false)
  const { setIsLoggedIn, isLoggedIn } = useLogin();
  useEffect(() => {
    const token: any = getCookie("userToken");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    document.cookie = `userToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=None;`;
    setIsLoggedIn(false);
  };

  const siderItems = isLoggedIn
    ? [
        {
          label: "Home",
          key: "/home",
          icon: <AiFillHome />,
        },
        {
          label: "Startups",
          key: "/startups",
          icon: <RiFileList3Line />,
        },
        {
          label: "Favourites",
          key: "/favourites",
          icon: <MdFavoriteBorder />,
        },
        {
          label: "Profile",
          key: "/profile",
          icon: <CgProfile />,
        },
        {
          label: "Logout",
          key: "signout",
          icon: <RiLogoutCircleLine />,
        },
      ]
    : [
        {
          label: "Home",
          key: "/home",
          icon: <AiFillHome />,
        },
        {
          label: "Startups",
          key: "/startups",
          icon: <RiFileList3Line />,
        },
        {
          label: "Favourites",
          key: "/favourites",
          icon: <MdFavoriteBorder />,
        },
        {
          label: "Profile",
          key: "/profile",
          icon: <CgProfile />,
        },
        {
          label: "Logout",
          key: "signout",
          icon: <RiLogoutCircleLine />,
        },
      ];

  return (
    <Layout className="container-layout">
      <Header className="header">
        <div style={{ alignItems: "center" }}>
          <RxHamburgerMenu
            onClick={() => setCollapsed(!collapsed)}
            size={30}
            style={{ float: "left", marginTop: 20 }}
          />
          <div className="brand" style={{ textAlign: "center" }}>
            Startups Project - Tomas Mendes
          </div>
        </div>
      </Header>
      <Layout>
        <Sider collapsed={collapsed} theme="dark">
          <Menu
            onClick={({ key }) => {
              if (key === "signout") {
                handleLogout();
                navigate("/home");
              } else {
                navigate(key);
              }
            }}
            theme="dark"
            mode="inline"
            items={siderItems}
          />
        </Sider>

        <Content className="content">
          <Routes>
            {<Route index element={<Home />} />}
            {<Route path="/home" element={<Home />} />}
            {isLoggedIn && <Route path="/startups" element={<Startup />} />}
            {!isLoggedIn && <Route path="/login" element={<Login />} />}
            {!isLoggedIn && <Route path="/Register" element={<Register />} />}
            {isLoggedIn && (
              <Route path="/favourites" element={<Favourites />} />
            )}
            {isLoggedIn && <Route path="/Profile" element={<Profile />} />}
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
}
