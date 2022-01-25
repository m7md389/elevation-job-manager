import ModeEditOutlineOutlinedIcon from "@mui/icons-material/ModeEditOutlineOutlined";
import React, { useEffect, useState } from "react";
import "../styles/interview-row.css";
function processRow(props) {
  const interview = props.inter;
  return (
    <div className="interviews">
      <p>{interview.type}</p>
      <p>{interview.date}</p>
      <p>{interview.status}</p>
      <p>{interview.description}</p>
      <div className="link">
        <a href="">link</a>
        <div className="edit-icon">
          <ModeEditOutlineOutlinedIcon style={{ color: "#2196f3" }} />
        </div>
      </div>
      {/* <p>{interview.link}</p> */}
    </div>
  );
}

export default processRow;
