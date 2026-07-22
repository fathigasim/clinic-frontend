import { useEffect } from 'react';
import { useDashboard } from './DashboardContext';
import SideBar from './SideBar';
import Navbar from '../features/navbar/NavBar';
import { Outlet } from 'react-router';

const MainLayout = () => {
  const { isSidebarMini, isSidebarOpen } = useDashboard();

  // Synchronize layout state classes directly onto the global document body element
  useEffect(() => {
    const body = document.body;

    if (isSidebarMini) {
      body.classList.add("sidebar-mini");
    } else {
      body.classList.remove("sidebar-mini");
    }

    if (isSidebarOpen) {
      body.classList.add("sidebar-open");
    } else {
      body.classList.remove("sidebar-open");
    }

    // Optional: Ensure baseline framework wrapper class is attached
    body.classList.add("admin-layout-ready");

    // Clean up classes if the component unmounts (e.g., when routing to landing or public login pages)
    return () => {
      body.classList.remove("sidebar-mini", "sidebar-open", "admin-layout-ready");
    };
  }, [isSidebarMini, isSidebarOpen]);

  return (
    <div className="admin-main">
      <SideBar />
      <div className="content-wrapper">
        <Navbar />
        <main className="p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;