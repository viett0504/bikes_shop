import React, { createContext, useContext, useState, useCallback } from "react";
import "./notification.css";
import { CheckCircle, AlertTriangle, Info, X } from "lucide-react";

const NotificationContext = createContext(null);

const ICONS = {
  success: <CheckCircle className="noti-icon" />,
  error: <AlertTriangle className="noti-icon" />,
  warning: <AlertTriangle className="noti-icon" />,
  info: <Info className="noti-icon" />,
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const showNotification = useCallback(
    (
      message,
      type = "success",
      options = {}
      // options: { title, duration }
    ) => {
      const id = Date.now();
      const {
        title = type === "success"
          ? "Thành công"
          : type === "error"
          ? "Có lỗi xảy ra"
          : type === "warning"
          ? "Chú ý"
          : "Thông báo",
        duration = 3000,
      } = options;

      setNotifications((prev) => [
        ...prev,
        { id, message, type, title, duration },
      ]);

      // auto close
      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
      }, duration);
    },
    []
  );

  const closeNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}

      <div className="noti-container">
        {notifications.map((n) => (
          <div
            key={n.id}
            className={`noti-item noti-${n.type}`}
          >
            <div className="noti-left">
              {ICONS[n.type] || ICONS.info}
            </div>

            <div className="noti-content">
              <div className="noti-header">
                <span className="noti-title">{n.title}</span>
                <button
                  className="noti-close-btn"
                  onClick={() => closeNotification(n.id)}
                >
                  <X className="noti-close-icon" />
                </button>
              </div>
              <div className="noti-message">{n.message}</div>
              <div
                className="noti-progress"
                style={{ animationDuration: `${n.duration}ms` }}
              />
            </div>
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);
