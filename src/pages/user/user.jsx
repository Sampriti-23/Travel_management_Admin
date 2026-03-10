import React from "react";
import Dashboard from "../../layout/Dashboard";
import "./user.css";

const User = () => {
  const users = [
    {
      id: 1,
      name: "Amit Sharma",
      phone: "+91 98765 43210",
      location: "Delhi",
      package: "Manali Explorer Package",
      amountPaid: "₹45,000",
      travellers: 2,
    },
    {
      id: 2,
      name: "Neha Verma",
      phone: "+91 91234 56789",
      location: "Mumbai",
      package: "Spiti Valley Adventure",
      amountPaid: "₹78,000",
      travellers: 3,
    },
    {
      id: 3,
      name: "Rahul Mehta",
      phone: "+91 99887 66554",
      location: "Ahmedabad",
      package: "Kashmir Winter Getaway",
      amountPaid: "₹62,500",
      travellers: 2,
    },
    {
      id: 4,
      name: "Priya Singh",
      phone: "+91 90123 45678",
      location: "Lucknow",
      package: "Uttrakhand Honeymoon Package",
      amountPaid: "₹55,000",
      travellers: 2,
    },
    {
      id: 5,
      name: "Kunal Patel",
      phone: "+91 88990 11223",
      location: "Surat",
      package: "Chandratal Trek",
      amountPaid: "₹39,000",
      travellers: 1,
    },
  ];

  return (
    <Dashboard active="users">

      <h1 className="users-title">Users</h1>

      <div className="users-list">
        {users.map((user) => (
          <div className="user-row" key={user.id}>

            {/* USER LOGO */}
            <div className="user-logo">
              {user.name.split(" ").map(n => n[0]).join("")}
              <span className="traveller-badge">{user.travellers}</span>
            </div>

            {/* USER INFO */}
            <div className="user-info">
              <h2>{user.name}</h2>
              <p>📞 {user.phone}</p>
              <p>📍 {user.location}</p>
              <p>📦 {user.package}</p>
            </div>

            {/* PAYMENT INFO */}
            <div className="user-payment">
              <p className="amount">{user.amountPaid}</p>
              <button>View</button>
            </div>

          </div>
        ))}
      </div>

    </Dashboard>
  );
};

export default User;
