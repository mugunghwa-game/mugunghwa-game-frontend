import React, { useRef } from "react";
import Webcam from "react-webcam";
import styled from "styled-components";

import useCamera from "../hooks/useCamera";
import Video from "./Video";

export default function VideoRoom() {
  const { peers, userVideo } = useCamera();
  console.log(userVideo);
  const userCanvas = useRef();

  return (
    <>
      <UserCamera>
        <div>
          <Webcam className="userVideo" ref={userVideo} autoPlay playsInline />
          <canvas ref={userCanvas} className="userVideo" />
        </div>
        <div>
          {peers.map((peer, index) => {
            return <Video key={index} peer={peer} />;
          })}
        </div>
      </UserCamera>
    </>
  );
}

const UserCamera = styled.div`
  display: grid;
  grid-template-columns: 500px 300px;
  grid-template-rows: 250px 250px;
  /* column-gap: 80px; */
  margin-top: 20px;
  margin-left: 60px;

  .userVideo {
    position: absolute;
    width: 500px;
    height: 350px;
    align-items: center;
    object-fit: fill;
  }
`;
