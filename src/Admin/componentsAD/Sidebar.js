import { Link, useLocation } from "react-router-dom";

export default function Sidebar(){
  const { pathname } = useLocation();
  const Item = ({to,label}) => (
    <Link className={`ad-link ${pathname.startsWith(to)?'active':''}`} to={to}>{label}</Link>
  );
  return (
    <aside className="ad-sidebar">
      <div className="ad-title">Trang quản lý</div>
      <nav>
        <Item to="/admin/dashboard" label="Tổng quan" />
        <Item to="/admin/products"  label="Sản phẩm" />
        <Item to="/admin/orders"    label="Đơn hàng" />
        <Item to="/admin/categories"label="Thương hiệu" />
      </nav>
    </aside>
  );
}
