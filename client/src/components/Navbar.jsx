import React from "react";

function Navbar({
  user,
  notifications,
  onNotification,
  darkMode,
  setDarkMode,
}) {
  return (
    <header className="top-navbar">

      <div className="navbar-left">

        <button
          className="menu-toggle"
          title="Menu"
        >
          ☰
        </button>

        <div className="navbar-title">
          <h2>
            Internal Marks Management System
          </h2>

          <span>
            Academic Performance Dashboard
          </span>
        </div>

      </div>

      <div className="navbar-right">

        <button
          className="theme-btn"
          onClick={() =>
            setDarkMode(!darkMode)
          }
          title="Toggle theme"
        >
          {darkMode ? "☀" : "☾"}
        </button>

        <button
          className="notification-btn"
          onClick={onNotification}
          title="Notifications"
        >
          🔔

          {notifications > 0 && (
            <span>
              {notifications}
            </span>
          )}
        </button>

        <div className="profile-area">

          <div className="profile-avatar">
            {user?.fullName
              ? user.fullName
                  .charAt(0)
                  .toUpperCase()
              : "A"}
          </div>

          <div className="profile-text">

            <strong>
              {user?.fullName || "Admin"}
            </strong>

            <small>
              {user?.role || "Super Admin"}
            </small>

          </div>

          <span className="profile-arrow">
            ⌄
          </span>

        </div>

      </div>

    </header>
  );
}

export default Navbar;