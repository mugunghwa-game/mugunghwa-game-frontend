import React from "react";
import Webcam from "react-webcam";

import useCamera from "../hooks/useCamera";
import Video from "./Video";

export default function VideoRoom() {
  const { peers, userVideo } = useCamera();

  return (
    <>
      <Webcam className="it" ref={userVideo} autoPlay playsInline />
      {peers.map((peer, index) => {
        console.log(peer);
        return <Video key={index} peer={peer} />;
      })}
    </>
  );
}
