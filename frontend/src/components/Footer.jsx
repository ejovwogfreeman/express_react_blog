import React from "react";

const Footer = () => {
  return (
    <footer style={{ textAlign: "center" }}>
      &copy; {new Date().getFullYear()} NewsBlog
    </footer>
  );
};

export default Footer;
