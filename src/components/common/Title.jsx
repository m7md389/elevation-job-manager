import React, { useEffect, useState } from "react";
import "../../styles/title.css";

const Footer = (props) => {
  const { text } = props;

  return (
    <div className='course-title'>
      <h1>{text}</h1>
    </div>
  );
};

export default Footer;
