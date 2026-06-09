import React from "react";
import Dashboard from "../../layout/Dashboard";
import "./user.css";
import { useSelector } from "react-redux";
import {getalluser} from "../../Reducer/UserSlice";
import { useDispatch } from "react-redux";
import { useEffect } from "react";

const User = () => {
  const { userList } = useSelector((state) => state?.userData);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getalluser());
  }, [dispatch]);
console.log("users",userList);


return (
    <Dashboard active="users">

      <h1 className="users-title">Users</h1>

      <div className="users-list">
        {userList?.data?.map((user) => (
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
              <p>📍 {user.email}</p>
            </div>

          </div>
        ))}
      </div>

    </Dashboard>
  )
};

export default User;
