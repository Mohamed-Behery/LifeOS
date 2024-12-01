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
  faCaretDown,
  faCashRegister,
  faCreditCard,
  faMoneyBill,
  faMoneyBill1Wave,
  faCartShopping,
  faArchive,
  faChartPie,
} from "@fortawesome/free-solid-svg-icons";

const Container = styled.div`
  width: ${(props) => (props.open ? "300px" : "75px")};
  height: 100vh;
  background-color: ${({ theme }) => theme.bg};
  padding: 20px;
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
  font-weight: bold;
  color: ${({ theme }) => theme.text};
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  position: relative;
  user-select: none;
  justify-content: ${(props) => (props.open ? "flex-start" : "center")};
  a {
    color: ${({ theme }) => theme.text};
    user-select: none;
  }

  a:hover {
    color: ${({ theme }) => theme.primary};
  }

  svg {
    margin-left: ${(props) => (props.open ? "8px" : "0")};
    aspect-ratio: 1;
  }

  svg.fa-caret-down {
    position: absolute;
    left: ${(props) => (props.open ? "10%" : "50%")};
  }
`;

const SubMenu = styled.ul`
  background-color: ${({ theme }) => theme.neutral};
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.border};
  padding: 8px;
  margin-top: 8px;
  margin-bottom: 16px;
  width: 100%;

  li {
    display: flex;
    align-items: center;
    /* font-size: 16px; */
    font-weight: normal;
    padding: 8px 0;
    color: ${({ theme }) => theme.text};
    cursor: pointer;
    transition: all 0.3s ease;

    a {
      display: flex;
      align-items: center;
      color: ${({ theme }) => theme.text};
      font-weight: bold;
      gap: 10px;

      &:hover {
        color: ${({ theme }) => theme.primary};
      }

      /* svg {
        font-size: 20px;
      } */

      span {
        display: ${(props) => (props.open ? "inline" : "none")};
      }
    }
  }
`;

const DarkModeToggle = styled(SidebarItem)`
  user-select: none;
`;

const Sidebar = ({ darkMode, toggleDarkMode }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isMoneyOpen, setMoneyOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const toggleMoney = () => {
    setMoneyOpen(!isMoneyOpen);
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
          <Link to="/dashboard">
            <FontAwesomeIcon icon={faChartPie} />
            {isSidebarOpen && "الإحصائيات"}
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
        <SidebarItem onClick={toggleMoney} open={isSidebarOpen}>
          <FontAwesomeIcon icon={faMoneyBill} /> {isSidebarOpen && "الفلوس"}{" "}
          {isSidebarOpen && <FontAwesomeIcon icon={faCaretDown} />}
        </SidebarItem>

        {isMoneyOpen && (
          <SubMenu open={isSidebarOpen}>
            <li>
              <Link to="/cash-registers">
                <FontAwesomeIcon icon={faCashRegister} />
                <span>الكاش</span>
              </Link>
            </li>
            <li>
              <Link to="/banks">
                <FontAwesomeIcon icon={faCreditCard} />
                <span>البنك</span>
              </Link>
            </li>
            <li>
              <Link to="/revenues">
                <FontAwesomeIcon icon={faMoneyBill1Wave} />
                <span>الدخل</span>
              </Link>
            </li>
            <li>
              <Link to="/expenses">
                <FontAwesomeIcon icon={faCartShopping} />
                <span>المصروفات</span>
              </Link>
            </li>
            <li>
              <Link to="/revenue-types">
                <FontAwesomeIcon icon={faArchive} />
                <span>مصادر الدخل</span>
              </Link>
            </li>
            <li>
              <Link to="/expense-types">
                <FontAwesomeIcon icon={faArchive} />
                <span>أنواع المصروفات</span>
              </Link>
            </li>
          </SubMenu>
        )}

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
