import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { Outlet } from "react-router-dom";

export default function AdminLayout(){
  return (
    <div className="ad-layout">
      <Sidebar />
      <div className="ad-main">
        <Topbar />
        <main className="ad-container">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
