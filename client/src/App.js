import "./index.css";
import styled from "styled-components";
import { ThemeProvider } from "styled-components";
import { lightTheme, darkTheme } from "./utils/Theme";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Home from "./pages/Home";
import Notes from "./pages/Notes";
import { useEffect, useState } from "react";
import Tasks from "./pages/Tasks";

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
    margin-right: 60px;
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
              <Route path="/notes" element={<Notes />} />
              <Route path="/tasks" element={<Tasks />} />
            </Routes>
          </Content>
        </AppContainer>
      </Router>
    </ThemeProvider>
  );
}

export default App;
