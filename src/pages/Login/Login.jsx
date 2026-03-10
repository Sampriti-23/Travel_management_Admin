import React, { useState } from "react";
import "./Login.css";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../../Reducer/AuthSlice";
import { useForm } from "react-hook-form";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
    const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const onSubmit=(data)=>{
    dispatch(login(data)).then((res)=>{
      if(res?.payload?.status_code===200){
        navigate("/home")
      }
    });
  }

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

      {/* RIGHT LOGIN BOX */}
      <form className="auth-card" onSubmit={handleSubmit(onSubmit)}>

        <label>Email</label>
        <input
          type="email"
          placeholder="Enter your email"
          {...register("email", { required: "Email is required" })}
        />
        {errors.email && <p className="text-red-500">{errors.email.message}</p>}

        <label>Password</label>
        <input
          type="password"
          placeholder="********"
          {...register("password", { required: "Password is required" })}
        />
        {errors.password && (<p className="text-red-500">{errors.password.message}</p>)}

        <button type="submit">SIGN IN</button>

        <p className="switch">
          Are you new? <Link to="/register">Create an Account</Link>
        </p>
      </form>

    </div>
  );
};

export default Login;
