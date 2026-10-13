import React from "react";
import { NavLink } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = ({ items, theme, onToggleTheme, total }) => {
  return (
    <aside className="sidebar">
      <div className="sidebar__brand">
        <span className="sidebar__logo">💸</span>
        <div>
          <h1>Expense Tracker</h1>
          <p>Spending dashboard</p>
        </div>
      </div>

      <nav className="sidebar__nav">
        {items.map((item) => (
          <NavLink
            key={item.id}
            to={item.path}
            end={item.path === "/"}
            className={({ isActive }) => `nav-item${isActive ? " nav-item--active" : ""}`}
          >
            <span className="nav-item__icon">{item.icon}</span>
            <span className="nav-item__label">{item.label}</span>
            {item.id === "expenses" && total > 0 && (
              <span className="nav-item__badge">{total}</span>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar__footer">
        <button
          type="button"
          className="theme-toggle"
          onClick={onToggleTheme}
          aria-label="Toggle theme"
        >
          <span>{theme === "dark" ? "🌙" : "☀️"}</span>
          {theme === "dark" ? "Dark mode" : "Light mode"}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
