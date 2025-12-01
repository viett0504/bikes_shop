import { useState, useEffect } from "react";
import { DashboardData, TodayOrders } from "./FetchApi";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

const KPI = ({ icon, label, value, sub }) => (
  <div className="ad-card">
    <div className="ad-body">
      <div className="ad-kpi">
        <div className="ad-icon">{icon}</div>
        <div className="ad-muted" style={{ fontSize: 14 }}>
          {label}
        </div>
      </div>
      <div className="ad-kpi-value">{value}</div>
      {sub && (
        <div className="ad-green" style={{ fontSize: 13 }}>
          {sub}
        </div>
      )}
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

  const [loadingChart, setLoadingChart] = useState(true);
  const [chartData, setChartData] = useState([]);

  const [currentMonthRevenue, setCurrentMonthRevenue] = useState(0);
  const [growthRate, setGrowthRate] = useState(null);

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
    };

    const fetchOrdersAndRevenue = async () => {
      const data = await TodayOrders();
      if (!data || !data.Orders) {
        setLoadingChart(false);
        return;
      }

      const orders = data.Orders;
      const paidOrders = orders.filter((o) => o.payStatus === "Đã thanh toán");

      if (!paidOrders.length) {
        setChartData([]);
        setLoadingChart(false);
        return;
      }

      const monthMap = {};

      paidOrders.forEach((order) => {
        const createdAt = new Date(order.createdAt);
        const key = `${createdAt.getFullYear()}-${String(
          createdAt.getMonth() + 1
        ).padStart(2, "0")}`;

        if (!monthMap[key]) monthMap[key] = 0;
        monthMap[key] += Number(order.amount || 0);
      });

      const sortedKeys = Object.keys(monthMap).sort();

      const chart = sortedKeys.map((key) => ({
        month: key,
        total: monthMap[key],
      }));

      setChartData(chart);

      // Doanh thu tháng hiện tại và tháng trước
      const now = new Date();
      const curKey = `${now.getFullYear()}-${String(
        now.getMonth() + 1
      ).padStart(2, "0")}`;

      const prevDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const prevKey = `${prevDate.getFullYear()}-${String(
        prevDate.getMonth() + 1
      ).padStart(2, "0")}`;

      const curRevenue = monthMap[curKey] || 0;
      const prevRevenue = monthMap[prevKey] || 0;

      setCurrentMonthRevenue(curRevenue);
      setGrowthRate(
        prevRevenue > 0
          ? ((curRevenue - prevRevenue) / prevRevenue) * 100
          : null
      );

      setLoadingChart(false);
    };

    fetchStats();
    fetchOrdersAndRevenue();
  }, []);

  const todayStr = new Date().toLocaleDateString("vi-VN");
  const monthLabel = new Date().toLocaleDateString("vi-VN", {
    month: "2-digit",
    year: "numeric",
  });

  const chartConfig = {
    labels: chartData.map((d) => d.month),
    datasets: [
      {
        label: "Doanh thu (VND)",
        data: chartData.map((d) => d.total),
        borderColor: "#4ade80",
        backgroundColor: "rgba(74, 222, 128, 0.3)",
        tension: 0.3,
      },
    ],
  };

  return (
    <div className="ad-row ad-row-3">
      {/* Biểu đồ */}
      <div className="ad-card">
        <div className="ad-body">
          <div style={{ marginBottom: 8 }}>Hôm nay: {todayStr}</div>

          <div
            style={{
              height: 260,
              padding: 10,
            }}
          >
            {loadingChart ? (
              <div
                style={{
                  textAlign: "center",
                  paddingTop: 100,
                  color: "var(--text-muted)",
                }}
              >
                Đang tải biểu đồ...
              </div>
            ) : chartData.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  paddingTop: 100,
                  color: "var(--text-muted)",
                }}
              >
                Chưa có đơn nào ĐÃ THANH TOÁN.
              </div>
            ) : (
              <Line data={chartConfig} />
            )}
          </div>
        </div>
      </div>

      {/* Doanh thu & KPI */}
      <div
        className="ad-row"
        style={{ gridTemplateColumns: "1fr", gap: 16 }}
      >
        <div className="ad-card">
          <div className="ad-body">
            <div className="ad-muted">Doanh thu tháng: {monthLabel}</div>
            <div className="ad-green" style={{ fontSize: 30 }}>
              {currentMonthRevenue.toLocaleString("vi-VN")} ₫
            </div>

            <div
              className={growthRate && growthRate < 0 ? "ad-red" : "ad-green"}
              style={{ fontSize: 13 }}
            >
              {growthRate === null
                ? "Không có dữ liệu tháng trước"
                : `${growthRate >= 0 ? "↑" : "↓"} ${Math.abs(
                    growthRate
                  ).toFixed(1)}% so với tháng trước`}
            </div>
          </div>
        </div>

        <div
          className="ad-row"
          style={{ gridTemplateColumns: "1fr 1fr", gap: 16 }}
        >
          <KPI icon={"🛒"} label="Tổng đơn" value={stats.Orders} />
          <KPI icon={"📈"} label="Tỷ lệ chuyển đổi" value="0%" />
          <KPI icon={"📦"} label="Sản phẩm" value={stats.Products} />
          <KPI icon={"👥"} label="Khách hàng" value={stats.Users} />
        </div>
      </div>

      {/* Bảng dưới */}
      <div className="ad-card" style={{ gridColumn: "1 / -1" }}>
        <div className="ad-body">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
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
  );
}
