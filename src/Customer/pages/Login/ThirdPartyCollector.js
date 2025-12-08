import React, { useEffect, useState } from "react";

const STORAGE_KEY = "referer_collector_history";

const ThirdPartyCollector = () => {
  const [currentUrl, setCurrentUrl] = useState("");
  const [currentReferrer, setCurrentReferrer] = useState("");
  const [entries, setEntries] = useState([]);
  const [justCollected, setJustCollected] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  useEffect(() => {
    // 1. Đọc lịch sử từ localStorage
    const saved = localStorage.getItem(STORAGE_KEY);
    let history = [];
    if (saved) {
      try {
        history = JSON.parse(saved);
      } catch (e) {
        console.error("Parse history error:", e);
      }
    }

    // 2. Đọc thông tin hiện tại
    const pageUrl = window.location.href;
    const ref = document.referrer || "";

    setCurrentUrl(pageUrl);
    setCurrentReferrer(ref || "(không có)");

    try {
      // 3. Parse referrer để lấy JWT
      const refUrl = ref ? new URL(ref) : null;
      const params = refUrl ? Array.from(refUrl.searchParams.entries()) : [];

      if (params.length > 0) {
        const newEntry = {
          time: new Date().toISOString(),
          referrer: ref,         // URL gốc có JWT
          leakedUrl: pageUrl,    // URL /collector
          params,                // các query param từ referrer
        };

        history.push(newEntry);
        if (history.length > 100) history = history.slice(-100);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(history));

        setJustCollected(true);

        console.log("✅ Collected from referrer:", refUrl.toString());

        // ✅ BỎ REDIRECT - chỉ tắt animation sau 3s
        setTimeout(() => {
          setJustCollected(false);
        }, 3000);
      } else {
        console.log("✅ No sensitive query params in referrer.");
      }
    } catch (e) {
      console.error("❌ Error parsing referrer:", e);
    }

    setEntries(history);
  }, []); // ✅ Empty dependency - chỉ chạy 1 lần khi mount

  // 🔥 Hàm xóa lịch sử
  const clearHistory = () => {
    if (window.confirm("Xóa toàn bộ lịch sử leak?")) {
      localStorage.removeItem(STORAGE_KEY);
      setEntries([]);
      console.log("🗑️ History cleared");
    }
  };

  // Hàm decode JWT
  const decodeJWT = (token) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(jsonPayload);
    } catch (e) {
      return null;
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        margin: 0,
        padding: "20px",
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        background: "linear-gradient(135deg, #020617 0%, #0c1526 100%)",
        color: "#e5e7eb",
      }}
    >
      <div style={{ maxWidth: 1400, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <h1 style={{ 
            marginTop: 0, 
            fontSize: 36, 
            marginBottom: 8,
            background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            fontWeight: "bold"
          }}>
            🕵️ Third-party JWT Leak Collector
          </h1>
          <p style={{ fontSize: 16, color: "#9ca3af", marginBottom: 16 }}>
            Trang này tự động thu thập JWT từ Referer header và lưu vào localStorage.
          </p>
          
          {/* Nút giải thích */}
          <button
            onClick={() => setShowExplanation(!showExplanation)}
            style={{
              background: "#1e3a8a",
              border: "1px solid #3b82f6",
              color: "#fff",
              padding: "8px 16px",
              borderRadius: 8,
              cursor: "pointer",
              fontSize: 14,
              fontWeight: "500"
            }}
          >
            {showExplanation ? "❌ Ẩn giải thích" : "ℹ️ Cách hoạt động"}
          </button>
        </div>

        {/* Explanation Panel */}
        {showExplanation && (
          <div
            style={{
              background: "#0f172a",
              border: "2px solid #1e40af",
              borderRadius: 12,
              padding: 24,
              marginBottom: 24,
            }}
          >
            <h3 style={{ marginTop: 0, color: "#3b82f6", fontSize: 18 }}>
              🎯 Kịch bản tấn công JWT qua Referer Header
            </h3>
            
            <div style={{ marginBottom: 20 }}>
              <h4 style={{ color: "#60a5fa", fontSize: 16 }}>📋 Các bước:</h4>
              <ol style={{ lineHeight: 1.8, color: "#d1d5db" }}>
                <li><strong>Bước 1:</strong> User đăng nhập tại <code>bikeshop.com/login</code></li>
                <li><strong>Bước 2:</strong> Sau login thành công, ứng dụng redirect về home với JWT trong URL: 
                  <code style={{ display: "block", background: "#1e293b", padding: 8, marginTop: 8, borderRadius: 4, fontSize: 12 }}>
                    http://bikeshop.com/?jwt=eyJhbGc...&email=user@mail.com
                  </code>
                </li>
                <li><strong>Bước 3:</strong> HomePage tạo iframe ẩn trỏ đến <code>/collector</code></li>
                <li><strong>Bước 4:</strong> Browser tự động gửi <strong>Referer header</strong> chứa full URL (có JWT)</li>
                <li><strong>Bước 5:</strong> Collector page đọc <code>document.referrer</code> và lưu JWT</li>
              </ol>
            </div>

            <div style={{ 
              background: "#7f1d1d", 
              border: "1px solid #dc2626",
              borderRadius: 8, 
              padding: 16,
              marginBottom: 16
            }}>
              <h4 style={{ marginTop: 0, color: "#fca5a5", fontSize: 15 }}>
                ⚠️ Tại sao nguy hiểm?
              </h4>
              <ul style={{ margin: 0, paddingLeft: 20, lineHeight: 1.8, color: "#fecaca" }}>
                <li>Referer header được browser <strong>TỰ ĐỘNG GỬI</strong> - dev không kiểm soát được</li>
                <li>JWT trong URL sẽ bị leak qua mọi request external (images, iframes, links)</li>
                <li>Attacker không cần XSS hay CSRF, chỉ cần đặt 1 iframe/image tag</li>
                <li>JWT bị đánh cắp có thể dùng mãi cho đến khi hết hạn</li>
              </ul>
            </div>

            <div style={{ 
              background: "#14532d", 
              border: "1px solid #16a34a",
              borderRadius: 8, 
              padding: 16
            }}>
              <h4 style={{ marginTop: 0, color: "#86efac", fontSize: 15 }}>
                ✅ Cách phòng tránh:
              </h4>
              <ul style={{ margin: 0, paddingLeft: 20, lineHeight: 1.8, color: "#bbf7d0" }}>
                <li><strong>KHÔNG BAO GIỜ</strong> đặt JWT/token vào URL (query params hoặc hash)</li>
                <li>Dùng <strong>httpOnly cookie</strong> thay vì localStorage</li>
                <li>Set header <code>Referrer-Policy: no-referrer</code></li>
                <li>Dùng POST request với body thay vì GET với query params</li>
                <li>Implement CSRF token cho các form quan trọng</li>
              </ul>
            </div>
          </div>
        )}

        {/* Thông báo vừa thu thập */}
        {justCollected && (
          <div
            style={{
              background: "#7c2d12",
              border: "2px solid #ea580c",
              borderRadius: 12,
              padding: 20,
              marginBottom: 24,
              animation: "pulse 2s infinite",
            }}
          >
            <div style={{ fontSize: 24, marginBottom: 8 }}>🚨 JWT Leak Detected!</div>
            <p style={{ margin: "8px 0 0 0", fontSize: 15 }}>
              Đã thu thập JWT thành công từ Referer header!
            </p>
          </div>
        )}

        {/* Thống kê */}
        <div style={{ display: "flex", gap: 16, marginBottom: 24, flexWrap: "wrap" }}>
          <div
            style={{
              flex: 1,
              minWidth: 250,
              background: "#0f172a",
              border: "2px solid #1f2937",
              borderRadius: 12,
              padding: 20,
            }}
          >
            <div style={{ fontSize: 13, color: "#9ca3af", marginBottom: 8 }}>
              Tổng số lần leak
            </div>
            <div style={{ fontSize: 42, fontWeight: "bold", color: "#ef4444" }}>
              {entries.length}
            </div>
          </div>
          
          <div
            style={{
              flex: 1,
              minWidth: 250,
              background: "#0f172a",
              border: "2px solid #1f2937",
              borderRadius: 12,
              padding: 20,
            }}
          >
            <div style={{ fontSize: 13, color: "#9ca3af", marginBottom: 8 }}>
              Lần leak gần nhất
            </div>
            <div style={{ fontSize: 16, fontWeight: "500", color: "#e5e7eb" }}>
              {entries.length > 0
                ? new Date(entries[entries.length - 1].time).toLocaleString("vi-VN")
                : "Chưa có"}
            </div>
          </div>

          <div
            style={{
              flex: 1,
              minWidth: 250,
              background: "#0f172a",
              border: "2px solid #1f2937",
              borderRadius: 12,
              padding: 20,
            }}
          >
            <div style={{ fontSize: 13, color: "#9ca3af", marginBottom: 8 }}>
              Current Referrer
            </div>
            <div style={{ 
              fontSize: 12, 
              fontWeight: "500", 
              color: "#e5e7eb",
              wordBreak: "break-all",
              fontFamily: "monospace"
            }}>
              {currentReferrer === "(không có)" 
                ? currentReferrer 
                : currentReferrer.substring(0, 50) + (currentReferrer.length > 50 ? "..." : "")}
            </div>
          </div>
        </div>

        {/* Bảng lịch sử */}
        <div
          style={{
            background: "#0f172a",
            borderRadius: 12,
            padding: 20,
            border: "2px solid #1f2937",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 16,
              flexWrap: "wrap",
              gap: 12
            }}
          >
            <strong style={{ fontSize: 20 }}>📋 Lịch sử JWT Leaks</strong>
            {entries.length > 0 && (
              <button
                onClick={clearHistory}
                style={{
                  background: "#7f1d1d",
                  border: "1px solid #991b1b",
                  color: "#fff",
                  padding: "8px 16px",
                  borderRadius: 8,
                  cursor: "pointer",
                  fontSize: 13,
                  fontWeight: "500"
                }}
              >
                🗑️ Xóa lịch sử
              </button>
            )}
          </div>

          {entries.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "60px 20px",
                color: "#6b7280",
              }}
            >
              <div style={{ fontSize: 64, marginBottom: 16 }}>🔒</div>
              <h3 style={{ margin: "0 0 12px 0", color: "#9ca3af" }}>
                Chưa có JWT nào bị leak
              </h3>
              <p style={{ margin: 0, fontSize: 14 }}>
                Hãy đăng nhập ở trang chính để xem demo
              </p>
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              {entries
                .slice()
                .reverse()
                .map((entry, idx) => {
                  // ✅ Tìm cả "jwt" và "token"
                  const tokenParam = entry.params.find(([k]) => k === "token" || k === "jwt");
                  const token = tokenParam ? tokenParam[1] : null;
                  const decoded = token ? decodeJWT(token) : null;

                  return (
                    <div
                      key={idx}
                      style={{
                        background: "#1e293b",
                        border: "1px solid #334155",
                        borderRadius: 8,
                        padding: 16,
                        marginBottom: 12,
                      }}
                    >
                      <div style={{ 
                        display: "flex", 
                        justifyContent: "space-between",
                        alignItems: "start",
                        marginBottom: 12,
                        flexWrap: "wrap",
                        gap: 8
                      }}>
                        <div>
                          <span style={{ 
                            background: "#7f1d1d",
                            color: "#fca5a5",
                            padding: "4px 12px",
                            borderRadius: 6,
                            fontSize: 12,
                            fontWeight: "bold"
                          }}>
                            #{entries.length - idx}
                          </span>
                        </div>
                        <div style={{ fontSize: 13, color: "#94a3b8" }}>
                          {new Date(entry.time).toLocaleString("vi-VN")}
                        </div>
                      </div>

                      <div style={{ marginBottom: 12 }}>
                        <div style={{ fontSize: 12, color: "#64748b", marginBottom: 4 }}>
                          📨 Referrer (trang gốc):
                        </div>
                        <div style={{
                          background: "#0f172a",
                          padding: 8,
                          borderRadius: 6,
                          fontFamily: "monospace",
                          fontSize: 11,
                          color: "#94a3b8",
                          wordBreak: "break-all"
                        }}>
                          {entry.referrer || "(không có)"}
                        </div>
                      </div>

                      <div>
                        <div style={{ fontSize: 12, color: "#64748b", marginBottom: 8 }}>
                          🔥 Leaked Data:
                        </div>
                        {entry.params.map(([k, v]) => (
                          <div
                            key={k}
                            style={{
                              marginBottom: 8,
                              padding: 12,
                              background: (k === "token" || k === "jwt") ? "#7f1d1d" : "#334155",
                              borderRadius: 6,
                              border: (k === "token" || k === "jwt") ? "1px solid #dc2626" : "none"
                            }}
                          >
                            <div style={{
                              fontSize: 11,
                              color: (k === "token" || k === "jwt") ? "#fca5a5" : "#94a3b8",
                              marginBottom: 6,
                              fontWeight: "bold"
                            }}>
                              {k.toUpperCase()}
                            </div>
                            <div style={{
                              fontFamily: "monospace",
                              fontSize: 11,
                              color: (k === "token" || k === "jwt") ? "#fecaca" : "#cbd5e1",
                              wordBreak: "break-all",
                              lineHeight: 1.5
                            }}>
                              {v}
                            </div>
                            
                            {(k === "token" || k === "jwt") && decoded && (
                              <details style={{ marginTop: 8 }}>
                                <summary style={{ 
                                  cursor: "pointer", 
                                  color: "#fca5a5",
                                  fontSize: 12,
                                  fontWeight: "bold"
                                }}>
                                  🔓 Decoded JWT Payload
                                </summary>
                                <pre style={{
                                  background: "#0f172a",
                                  padding: 12,
                                  borderRadius: 6,
                                  marginTop: 8,
                                  fontSize: 11,
                                  color: "#fecaca",
                                  overflow: "auto"
                                }}>
                                  {JSON.stringify(decoded, null, 2)}
                                </pre>
                              </details>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </div>

        {/* Footer info */}
        <div
          style={{
            marginTop: 24,
            padding: 16,
            background: "#0f172a",
            border: "1px solid #1f2937",
            borderRadius: 12,
            fontSize: 13,
            color: "#9ca3af",
            lineHeight: 1.8
          }}
        >
          <strong style={{ color: "#e5e7eb" }}>💡 Technical Details:</strong>
          <ul style={{ margin: "12px 0 0 0", paddingLeft: 24 }}>
            <li>Khi user đăng nhập, HomePage tạo iframe ẩn trỏ đến <code>/collector</code></li>
            <li>Browser tự động gửi <strong>Referer header</strong> chứa URL gốc (bao gồm JWT)</li>
            <li>Trang này đọc JWT từ <code>document.referrer</code> và lưu vào localStorage</li>
            <li>URL luôn giữ sạch là <code>/collector</code> - không có query params</li>
            <li>Bạn có thể truy cập trang này bất cứ lúc nào để xem lịch sử leak</li>
          </ul>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
      `}</style>
    </div>
  );
};

export default ThirdPartyCollector;