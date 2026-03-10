import React, { useState } from "react";
import Dashboard from "../../layout/Dashboard";
import "./team.css";

const Team = () => {
  const [showModal, setShowModal] = useState(false);

  const [team, setTeam] = useState([
    {
      id: 1,
      name: "Rohit Sharma",
      post: "Tour Manager",
      salary: "₹45,000",
      location: "Manali",
      phone: "+91 98765 12345",
    },
  ]);

  const [form, setForm] = useState({
    name: "",
    post: "",
    salary: "",
    location: "",
    phone: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setTeam([...team, { ...form, id: Date.now() }]);
    setForm({ name: "", post: "", salary: "", location: "", phone: "" });
    setShowModal(false);
  };

  return (
    <Dashboard active="team">

      <div className="page-header">
        <h1>Team Members</h1>
        <button onClick={() => setShowModal(true)}>+ Add Member</button>
      </div>

      {/* TEAM LIST */}
      <div className="team-list">
        {team.map((m) => (
          <div className="team-row" key={m.id}>
            <div className="team-avatar">
              {m.name.split(" ").map(n => n[0]).join("")}
            </div>
            <div className="team-info">
              <h2>{m.name}</h2>
              <p>{m.post}</p>
              <p>📍 {m.location}</p>
              <p>📞 {m.phone}</p>
            </div>
            <div className="team-salary">{m.salary}</div>
          </div>
        ))}
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Add Team Member</h3>
              <span onClick={() => setShowModal(false)}>✕</span>
            </div>

            <form onSubmit={handleSubmit}>
              <label>Name*</label>
              <input required onChange={e=>setForm({...form,name:e.target.value})} />

              <label>Post*</label>
              <input required onChange={e=>setForm({...form,post:e.target.value})} />

              <label>Salary*</label>
              <input required onChange={e=>setForm({...form,salary:e.target.value})} />

              <label>Location*</label>
              <input required onChange={e=>setForm({...form,location:e.target.value})} />

              <label>Phone*</label>
              <input required onChange={e=>setForm({...form,phone:e.target.value})} />

              <button type="submit">Save</button>
            </form>
          </div>
        </div>
      )}

    </Dashboard>
  );
};

export default Team;
