import React from "react";
import "./FaceRecognitionStyle.css";

const FaceRecognition = ({ imageURL, box }) => {
  return (
    <div className='center ma'>
      <div className='absolute mt2'>
        <img
          id='inputImage'
          src={imageURL}
          alt='face'
          width='500px'
          height='auto'
        />
        <div
          className='bounding-box'
          style={{
            top: box.topRow,
            right: box.rightCol,
            bottom: box.bottomRow,
            left: box.leftCol,
          }}
        ></div>
      </div>
    </div>
  );
  // https://m.media-amazon.com/images/M/MV5BMzY0Y2YzOTctNTE3Ny00N2E3LWJmZTMtOGE1MzhlNWFiOWJlXkEyXkFqcGdeQXJoYW5uYWg@._V1_.jpg
};

export default FaceRecognition;
