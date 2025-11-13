import { useState, useEffect } from "react";
import { DashboardData } from "./FetchApi"; // import API mới

const KPI = ({ icon, label, value, sub }) => (
  <div className="ad-card">
    <div className="ad-body">
      <div className="ad-kpi">
        <div className="ad-icon">{icon}</div>
        <div className="ad-muted" style={{ fontSize: 14 }}>{label}</div>
      </div>
      <div className="ad-kpi-value">{value}</div>
      {sub && <div className="ad-green" style={{ fontSize: 13 }}>{sub}</div>}
    </div>
  </div>
);

export default function Dashboard() {
  const [tab, setTab] = useState("quotes");
  const [stats, setStats] = useState({
    Users: 0,
    Orders: 0,
    Products: 0,
    Categories: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const data = await DashboardData();
      if (data) {
        setStats({
          Users: data.Users || 0,
          Orders: data.Orders || 0,
          Products: data.Products || 0,
          Categories: data.Categories || 0,
        });
      }
      setLoading(false);
    };
    fetchStats();
  }, []);

  return (
    <div className="ad-row ad-row-3">
      {/* Trái: biểu đồ */}
      <div className="ad-card">
        <div className="ad-body">
          <div style={{ marginBottom: 8 }}>
            Hôm nay: {new Date().toLocaleDateString("vi-VN")}
          </div>
          <div
            style={{
              height: 260,
              background: "var(--panel)",
              border: "1px solid var(--border)",
              borderRadius: 12,
            }}
          >
            {loading && (
              <div
                style={{
                  textAlign: "center",
                  paddingTop: "120px",
                  color: "var(--text-muted)",
                }}
              >
                Đang tải biểu đồ...
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Phải: doanh thu & KPI */}
      <div className="ad-row" style={{ gridTemplateColumns: "1fr", gap: 16 }}>
        <div className="ad-card">
          <div className="ad-body">
            <div className="ad-muted" style={{ fontSize: 14 }}>
              Doanh thu tháng: {new Date().toLocaleDateString("vi-VN", { month: "2-digit", year: "numeric" })}
            </div>
            <div style={{ fontSize: 30, fontWeight: 700 }} className="ad-green">
              0 ₫
            </div>
            <div className="ad-green" style={{ fontSize: 13 }}>
              ↑ 0% tăng trưởng so với tháng trước
            </div>
          </div>
        </div>

        <div className="ad-row" style={{ gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <KPI icon={"🛒"} label="Tổng đơn" value={stats.Orders} />
          <KPI icon={"📈"} label="Tỷ lệ chuyển đổi" value="0%" />
          <KPI icon={"📦"} label="Sản phẩm đang bán" value={stats.Products} />
          <KPI icon={"👥"} label="Khách hàng" value={stats.Users} />
        </div>
      </div>

      {/* Dưới: Bảng cần phê duyệt */}
      <div className="ad-card" style={{ gridColumn: "1 / -1" }}>
        <div className="ad-body">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 12,
            }}
          >
            <div style={{ fontWeight: 600 }}>Cần phê duyệt mới nhất</div>
            <div className="ad-tabs">
              {[
                { k: "quotes", t: "Bảng tính giá", n: 3 },
                { k: "vendors", t: "Nhà cung cấp", n: 1 },
                { k: "materials", t: "NPL", n: 1 },
                { k: "codes", t: "Màu/Mã", n: 14 },
              ].map((x) => (
                <button
                  key={x.k}
                  onClick={() => setTab(x.k)}
                  className={`ad-tab ${tab === x.k ? "active" : ""}`}
                >
                  {x.t} <span className="ad-badge">{x.n}</span>
                </button>
              ))}
            </div>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table className="ad-table">
              <thead>
                <tr>
                  <th>STT</th>
                  <th>TT tính giá</th>
                  <th>MF ID</th>
                  <th>Thương hiệu</th>
                  <th>Mã tham chiếu</th>
                  <th>Mã hàng</th>
                  <th>Mùa</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan="8" className="text-center">
                    (Chưa có dữ liệu)
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
