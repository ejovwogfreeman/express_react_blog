import React from "react";

const Navbar = () => {
  return (
    <nav class="navbar-contents">
      <h3 class="logo">
        <i class="bi bi-nut"></i>
        <span>PetroTalk</span>
      </h3>
      <div class="form">
        <form action="">
          <i class="bi bi-search"></i>
          <input type="text" placeholder="Type here to search" name="" id="" />
        </form>
      </div>
      <div class="account">
        <span>
          <img src="default.jpg" alt="" class="profile-img" />
          <span>Account</span>
          <i class="bi bi-caret-down" id="icon"></i>
        </span>
        <ul class="account-stats" id="account-stats">
          <li>
            <a href="" class="first">
              <i class="bi bi-box-arrow-in-right"></i>Login
            </a>
          </li>
          <li>
            <a href="" class="last">
              <i class="bi bi-person-plus"></i>Register
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
