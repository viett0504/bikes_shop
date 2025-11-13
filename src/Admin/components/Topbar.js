export default function Topbar() {
  return (
    <div className="topbar">
      <div className="breadcrumb">
        <span className="crumb-home">Home</span>
        <span className="crumb-sep">›</span>
        <span className="crumb-current">Dashboard</span>
      </div>

      <div className="top-actions">
        <div className="search">
          <input placeholder="Search…" />
          <button aria-label="search">🔍</button>
        </div>

        <div className="admin">
          <button className="btn-ghost">🔔</button>
          <div className="dropdown">
            <button className="btn">ADMIN ▾</button>
            <div className="dropdown-menu">
              <button>Profile</button>
              <button>Settings</button>
              <button>Logout</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
