import { useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { Outlet } from "react-router-dom";
import "../../admin.css";
export default function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="ad-layout">
      {/* Overlay cho mobile khi sidebar mở */}
      {isSidebarOpen && (
        <div className="ad-sidebar-overlay" onClick={closeSidebar}></div>
      )}

      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

      <div className="ad-main">
        <Topbar onToggleSidebar={toggleSidebar} />
        <main className="ad-container">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
