import { createContext, useContext, useState, useEffect } from 'react';

const DashboardContext = createContext();

export const DashboardProvider = ({ children }) => {
  const sidebarStorageKey = "adminHMD.sidebarMini";
  const themeStorageKey = "adminHMD.colorTheme";

  // 1. Theme State Logic
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem(themeStorageKey);
    if (savedTheme === "dark" || savedTheme === "light") return savedTheme;
    
    // System preferences fallback
    if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
      return "dark";
    }
    return "light";
  });

  // 2. Sidebar Layout States
  const [isSidebarMini, setIsSidebarMini] = useState(() => {
    return localStorage.getItem(sidebarStorageKey) === "true";
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // For mobile view

  // 3. Monitor screen changes to clear mobile layout classes
  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 992px)");
    
    const handleBreakpointChange = (e) => {
      if (e.matches) {
        setIsSidebarOpen(false); // Close mobile tray when returning to desktop view
      } else {
        // Safe defaults on mobile resize
      }
    };

    mediaQuery.addEventListener("change", handleBreakpointChange);
    return () => mediaQuery.removeEventListener("change", handleBreakpointChange);
  }, []);

  // 4. Side Effect: Apply data attributes directly to the document root element when theme changes
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    document.documentElement.setAttribute("data-bs-theme", theme);
    localStorage.setItem(themeStorageKey, theme);
  }, [theme]);

  // 5. Side Effect: Persist sidebar layout states
  useEffect(() => {
    localStorage.setItem(sidebarStorageKey, String(isSidebarMini));
  }, [isSidebarMini]);

  const toggleTheme = () => setTheme(prev => prev === "dark" ? "light" : "dark");
  
  const toggleSidebar = () => {
    const isDesktop = window.matchMedia("(min-width: 992px)").matches;
    if (isDesktop) {
      setIsSidebarMini(prev => !prev);
    } else {
      setIsSidebarOpen(prev => !prev);
    }
  };

  const closeMobileSidebar = () => setIsSidebarOpen(false);

  return (
    <DashboardContext.Provider value={{
      theme,
      isSidebarMini,
      isSidebarOpen,
      toggleTheme,
      toggleSidebar,
      closeMobileSidebar
    }}>
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => useContext(DashboardContext);