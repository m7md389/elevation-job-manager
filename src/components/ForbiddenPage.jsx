import React from "react";

import "../styles/PageNotFound.css";

const ForbiddenPage = () => {
  return (
    <div className="d-flex justify-content-center align-items-center" id="main">
      <h1 className="me-3 pe-3 border-end align-top inline-block align-content-center">
        403
      </h1>
      <div className="inline-block align-middle">
        <h2 className="font-weight-normal lead" id="desc">
          Access forbidden.
        </h2>
      </div>
    </div>
  );
};

export default ForbiddenPage;
