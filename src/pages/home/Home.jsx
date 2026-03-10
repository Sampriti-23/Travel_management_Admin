import React from "react";
import Dashboard from "../../layout/Dashboard";
import "./Homee.css";

const Home = () => {
  return (
    <Dashboard active="dashboard">

      <div className="stats-grid">
        {[
          { title: "Active Tours", value: 6, sub: "2 Delayed", color: "green-bg" },
          { title: "Bookings", value: 132, sub: "28 Completed", color: "teal-bg" },
          { title: "Travel Agents", value: 8, sub: "1 Inactive", color: "red-bg" },
          { title: "Customer Satisfaction", value: "76%", sub: "26% Increased", color: "yellow-bg" },
        ].map((item, i) => (
          <div key={i} className={`stat-card ${item.color}`}>
            <p>{item.title}</p>
            <h2>{item.value}</h2>
            <span>{item.sub}</span>
          </div>
        ))}
      </div>

      <div className="card">
        <h2>Active Projects</h2>
        <table className="project-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Progress</th>
              <th>Status</th>
              <th>Assigned</th>
            </tr>
          </thead>
          <tbody>
            {[
              { name: "Manali Package", progress: 75, status: "On Track", team: "RK" },
              { name: "Spiti Valley", progress: 45, status: "At Risk", team: "AA" },
            ].map((p, i) => (
              <tr key={i}>
                <td>{p.name}</td>
                <td>{p.progress}%</td>
                <td>{p.status}</td>
                <td><div className="assigned-box">{p.team}</div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </Dashboard>
  );
};

export default Home;
