import React, { useRef } from "react";
import Webcam from "react-webcam";
import styled from "styled-components";

import useCamera from "../hooks/useCamera";
import Video from "./Video";

export default function VideoRoom() {
  const { peers, userVideo } = useCamera();
  const userCanvas = useRef();

  return (
    <UserCamera>
      <Webcam className="userVideo" ref={userVideo} autoPlay playsInline />
      <canvas ref={userCanvas} className="userVideo" />
      {peers.map((peer, index) => {
        return <Video key={index} peer={peer} />;
      })}
    </UserCamera>
  );
}
const UserCamera = styled.div`
  .userVideo {
    position: absolute;
    width: 500px;
    height: 500px;
    align-items: center;
    object-fit: fill;
  }
`;
