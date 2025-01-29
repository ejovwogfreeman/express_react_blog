import React from "react";
import { Link } from "react-router-dom";

const Register = () => {
  return (
    <div className="center">
      <form>
        <div className="form-header">
          <h4>Register Now</h4>
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
            Already Have An Account? <Link to="/login">Register</Link>
          </small>
        </div>
      </form>
    </div>
  );
};

export default Register;
