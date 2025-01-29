import React, { useState } from "react";
import { Link } from "react-router-dom";
import img from "../assets/default.jpg";
// import "./Navbar.css"; // Ensure to create this CSS file for styling

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleAccountStats = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="navbar-contents">
      <Link to="/" style={{ textDecoration: "none", color: "white" }}>
        <h3 className="logo">
          <i className="bi bi-nut"></i>
          <span>NewsBlog</span>
        </h3>
      </Link>
      <div className="form">
        <form action="">
          <i className="bi bi-search"></i>
          <input type="text" placeholder="Type here to search" />
        </form>
      </div>
      <div className="account" onClick={toggleAccountStats}>
        <span>
          <img src={img} alt="Profile" className="profile-img" />
          <div className="account-text">
            <span>Account</span>
            <i className="bi bi-caret-down" id="icon"></i>
          </div>
        </span>
        <ul
          className={`account-stats ${isOpen ? "open" : ""}`}
          id="account-stats"
        >
          <li>
            <a href="" className="first">
              <i className="bi bi-box-arrow-in-right"></i>Login
            </a>
          </li>
          <li>
            <a href="" className="last">
              <i className="bi bi-person-plus"></i>Register
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
