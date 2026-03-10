import React from "react";
import { Link } from "react-router-dom";
import "../pages/home/Homee.css";

const Dashboard = ({ children, active }) => {
  return (
    <div className="home-wrapper">
      <aside className="sidebar">
        <h1 className="sidebar-title">Hodophile</h1>

        <nav className="menu">
          <Link to="/">
            <div className={`menu-item ${active === "dashboard" ? "active" : ""}`}>
              📊 Dashboard
            </div>
          </Link>

         <Link to="/users">
             <div className={`menu-item ${active === "users" ? "active" : ""}`}>
                👤 Users
             </div>
        </Link>


          <Link to="/hotels">
            <div className={`menu-item ${active === "hotels" ? "active" : ""}`}>
              🏨 Hotels
            </div>
          </Link>

        <Link to="/rooms">
            <div className={`menu-item ${active === "rooms" ? "active" : ""}`}>
              🛏️ Rooms
            </div>
          </Link>


          <div className="menu-item">📦 Tour Package</div>
          <div className="menu-item">🛒 Booking</div>
          <div className="menu-item">💰 Payments</div>

          <Link to="/team">
          <div className={`menu-item ${active === "team" ? "active" : ""}`}>
             👥 Team
          </div>
          </Link>

          <div className="menu-item">⚙️ Settings</div>
        </nav>
      </aside>

      <main className="main">{children}</main>
    </div>
  );
};
export default Dashboard;
