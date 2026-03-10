import React, { useState } from "react";
import "./Registration.css";
import { Link } from "react-router-dom";

const Register = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className="auth-container">

      {/* LEFT CONTENT */}
      <div className="auth-left">
        <h1>
          <span className="travel">TRAVEL</span>
          <br />
          EXPLORE
          <br />
          LANDSCAPES
        </h1>

        <p className="tagline">
          Where Your Dream Destinations <br />
          Become Reality
        </p>

      </div>

      {/* RIGHT REGISTER BOX */}
      <form className="auth-card" onSubmit={handleSubmit}>
        <label>Name</label>
        <input placeholder="Your name" required />

        <label>Email</label>
        <input type="email" placeholder="Enter your email" required />

        <label>Phone</label>
        <input placeholder="+91 XXXXX XXXXX" required />

        <label>Password</label>
        <input type="password" placeholder="Create password" required />

        <button type="submit">REGISTER</button>

        <p className="switch">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>

    </div>
  );
};

export default Register;
