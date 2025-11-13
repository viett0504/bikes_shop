import { Link, useLocation } from "react-router-dom";

export default function Sidebar(){
  const { pathname } = useLocation();
  const Item = ({to,label}) => (
    <Link className={`ad-link ${pathname.startsWith(to)?'active':''}`} to={to}>{label}</Link>
  );
  return (
    <aside className="ad-sidebar">
      <div className="ad-title">Admin</div>
      <nav>
        <Item to="/admin/dashboard" label="Dashboard" />
        <Item to="/admin/products"  label="Products" />
        <Item to="/admin/orders"    label="Orders" />
        <Item to="/admin/categories"label="Categories" />
      </nav>
    </aside>
  );
}
