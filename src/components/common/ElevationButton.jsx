import React from "react";
import { Link } from "react-router-dom";
import "../../styles/button.css";

const ElevationButton = (props) => {
  return (
    <div className="elementor-element elementor-element-8765072 elementor-widget elementor-widget-elementskit-creative-button">
      <div className="elementor-widget-container">
        <div className="ekit-wid-con">
          <div className="ekit-btn-wraper">
            <Link to="" className="ekit_creative_button ekit_position_aware">
              <span className="ekit_creative_button_text">Test Button</span>
              <span className="ekit_position_aware_bg"></span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ElevationButton;
