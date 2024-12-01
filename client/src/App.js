import "./index.css";
import styled from "styled-components";
import { ThemeProvider } from "styled-components";
import { lightTheme, darkTheme } from "./utils/Theme";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Notes from "./pages/Notes";
import { useEffect, useState } from "react";
import Tasks from "./pages/Tasks";
import CashRegisters from "./pages/CashRegisters";
import Banks from "./pages/Banks";
import Revenues from "./pages/Revenues";
import Expenses from "./pages/Expenses";
import RevenueTypes from "./pages/RevenueTypes";
import ExpenseTypes from "./pages/ExpenseTypes";

const AppContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: ${({ theme }) => theme.bg};
  color: ${({ theme }) => theme.text};
  overflow: auto;
  width: 100%;
`;

const Content = styled.div`
  flex: 1;
  padding: 24px 8px;

  @media screen and (max-width: 768px) {
    margin-right: 75px;
  }
`;

function App() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const storedDarkMode = localStorage.getItem("darkMode");
    if (storedDarkMode) {
      setDarkMode(JSON.parse(storedDarkMode));
    }
  }, []);

  const toggleDarkMode = () => {
    setDarkMode((prevMode) => {
      const newMode = !prevMode;
      localStorage.setItem("darkMode", JSON.stringify(newMode));
      return newMode;
    });
  };

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <Router>
        <AppContainer>
          <Sidebar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
          <Content>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/Home" element={<Home />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/notes" element={<Notes />} />
              <Route path="/tasks" element={<Tasks />} />
              <Route path="/cash-registers" element={<CashRegisters />} />
              <Route path="/banks" element={<Banks />} />
              <Route path="/revenues" element={<Revenues />} />
              <Route path="/expenses" element={<Expenses />} />
              <Route path="/revenue-types" element={<RevenueTypes />} />
              <Route path="/expense-types" element={<ExpenseTypes />} />
            </Routes>
          </Content>
        </AppContainer>
      </Router>
    </ThemeProvider>
  );
}

export default App;
