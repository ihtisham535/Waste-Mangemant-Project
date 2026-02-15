import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar.jsx";

const ShopkeeperLayout = () => {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("shopkeeperDarkMode");
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-theme");
    } else {
      document.body.classList.remove("dark-theme");
    }
    localStorage.setItem("shopkeeperDarkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };

  return (
    <div className="app-shell">
      <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      <main className="main">
        <Outlet />
      </main>
    </div>
  );
};

export default ShopkeeperLayout;
