import React, { useState } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faBars,
  faSun,
  faMoon,
  faNoteSticky,
  faTasks,
} from "@fortawesome/free-solid-svg-icons";

const Container = styled.div`
  width: ${(props) => (props.open ? "300px" : "60px")};
  height: 100vh;
  background-color: ${({ theme }) => theme.bg};
  padding: 20px;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: ${(props) => (props.open ? "flex-start" : "center")};
  overflow-y: auto;
  transition: width 0.3s ease;

  @media (max-width: 768px) {
    position: fixed;
    z-index: 1000;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  }
`;

const LogoContainer = styled.div`
  display: flex;
  justify-content: ${(props) => (props.open ? "flex-start" : "center")};
  align-items: center;
  gap: 16px;
  width: 100%;
`;

const ToggleButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  color: ${({ theme }) => theme.text};
  cursor: pointer;
  transition: all 0.3s ease;
`;

const Logo = styled.h1`
  font-size: 32px;
  text-align: center;
  color: ${({ theme }) => theme.text};
  display: ${(props) => (props.open ? "block" : "none")};
  width: 80%;
`;

const SidebarList = styled.ul`
  list-style-type: none;
  margin-top: 32px;
  padding: 0;
  width: 100%;
`;

const SidebarItem = styled.li`
  margin: 16px 0;
  font-size: 16px;
  font-weight: bold;
  color: ${({ theme }) => theme.text};
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: ${(props) => (props.open ? "flex-start" : "center")};

  a {
    color: ${({ theme }) => theme.text};
  }

  a:hover {
    color: ${({ theme }) => theme.primary};
  }

  svg {
    margin-left: ${(props) => (props.open ? "8px" : "0")};
  }
`;

const DarkModeToggle = styled(SidebarItem)`
  user-select: none;
`;

const Sidebar = ({ darkMode, toggleDarkMode }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };
  return (
    <Container open={isSidebarOpen}>
      <LogoContainer>
        <ToggleButton onClick={toggleSidebar}>
          <FontAwesomeIcon icon={faBars} />
        </ToggleButton>

        <Logo open={isSidebarOpen}>LifeOS</Logo>
      </LogoContainer>
      <SidebarList>
        <SidebarItem open={isSidebarOpen}>
          <Link to="/">
            <FontAwesomeIcon icon={faHome} /> {isSidebarOpen && "الرئيسية"}
          </Link>
        </SidebarItem>
        <SidebarItem open={isSidebarOpen}>
          <Link to="/notes">
            <FontAwesomeIcon icon={faNoteSticky} />{" "}
            {isSidebarOpen && "الملاحظات"}
          </Link>
        </SidebarItem>
        <SidebarItem open={isSidebarOpen}>
          <Link to="/tasks">
            <FontAwesomeIcon icon={faTasks} /> {isSidebarOpen && "المهام"}
          </Link>
        </SidebarItem>
        <hr />
        <DarkModeToggle onClick={toggleDarkMode} open={isSidebarOpen}>
          {darkMode ? (
            <FontAwesomeIcon icon={faSun} />
          ) : (
            <FontAwesomeIcon icon={faMoon} />
          )}
          {isSidebarOpen && (darkMode ? "الوضع العادي" : "الوضع المظلم")}
        </DarkModeToggle>
      </SidebarList>
    </Container>
  );
};

export default Sidebar;
