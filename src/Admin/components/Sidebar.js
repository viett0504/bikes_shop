import { NavLink } from 'react-router-dom'

const NavItem = ({ to, label, icon="•" }) => (
  <NavLink
    to={to}
    className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}
  >
    <span className="nav-icon">{icon}</span>
    <span>{label}</span>
  </NavLink>
)

export default function Sidebar() {
  return (
    <div className="sidebar-inner">
      <div className="brand">KICKS</div>

      <div className="nav-group">
        <div className="nav-label">MENU</div>
        <NavItem to="/dashboard" label="Dashboard" icon="🏠" />
        <NavItem to="/orders" label="Order List" icon="🧾" />
        <NavItem to="/products" label="All Products" icon="🧩" />
        <NavItem to="/categories" label="Categories" icon="🏷️" />
      </div>
    </div>
  )
}
