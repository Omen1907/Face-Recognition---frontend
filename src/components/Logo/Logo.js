import React from "react";
import Tilt from "react-parallax-tilt";
import Brain from "./Brain.png"; // Make sure the file extension is correct

const Logo = () => {
  return (
    <div className='ma4 mt0 tl'>
      {" "}
      {/* Aligns it to the left */}
      <Tilt tiltMaxAngleX={2} tiltMaxAngleY={2} tiltReverse={true}>
        <div
          className='br3 pa3 shadow-5 flex items-center justify-center '
          style={{
            height: "80px",
            width: "100px",
            background:
              "linear-gradient(90deg, rgb(253, 182, 154) 0%, rgba(255,0,174,0.6208858543417367) 48%, rgba(77,9,121,1) 100%)",
            boxShadow: "0px 5px 15px rgba(0,0,0,0.3)",
            borderRadius: "20px",
          }}
        >
          <img src={Brain} alt='Brain' width='150' height='80' />
        </div>
      </Tilt>
      <a
        href='https://www.vecteezy.com/free-png/brain-logo'
        style={{ fontSize: "8px", textDecoration: "none" }}
      >
        Brain Logo PNGs by Vecteezy
      </a>
    </div>
  );
};

export default Logo;
