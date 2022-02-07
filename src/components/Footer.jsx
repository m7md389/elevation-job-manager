import React from "react";

import "../styles/footer.css";

const Footer = () => {
  return (
    <footer className="page-footer font-small cyan darken-3">
      {/* <div className="container">
        <div className="row">
          <div className="col-md-12 py-5">
            <div className="mb-5 flex-center">
              <a className="fb-ic">
                <i className="fab fa-facebook-f fa-lg white-text mr-md-5 mr-3 fa-2x"></i>
              </a>
              <a className="tw-ic">
                <i className="fab fa-linkedin fa-lg white-text mr-md-5 mr-3 fa-2x"></i>
              </a>
            </div>
          </div>
        </div>
      </div> */}
      <div className="footer-copyright text-center py-3">
        © 2022 Copyright: <span className="team">xCoders</span>
      </div>
    </footer>
  );
};

export default Footer;
