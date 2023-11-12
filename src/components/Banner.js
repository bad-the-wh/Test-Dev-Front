import React from "react";

const Banner = ({ location }) => {
  return (
    <div>
      <div className="banner">
        <div className="icon">
          <img src={location.icon} alt={location.name} width="50" height="50" />
        </div>
        <div className="infos">
          <h4>{location.name}</h4>
          <p>
            {location.type} - {location.address}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Banner;
