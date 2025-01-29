import React from "react";
import { Link } from "react-router-dom";

const Login = () => {
  return (
    <div className="center">
      <form>
        <div className="form-header">
          <h4>Login Now</h4>
        </div>
        <label htmlFor="">Email</label>
        <input />
        <label htmlFor="">Password</label>
        <input />
        <button>LOGIN</button>
        <div
          style={{
            textAlign: "center",
          }}
        >
          <small>
            New Here? <Link to="/register">Register</Link>
          </small>
          <br />
          <small>
            Forgot Password? <a href="">click here to reset</a>
          </small>
        </div>
      </form>
    </div>
  );
};

export default Login;
