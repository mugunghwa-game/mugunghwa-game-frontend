import React from "react";
import Webcam from "react-webcam";

import useCamera from "../hooks/useCamera";
import { socket } from "../utils/socket";
import Video from "./Video";

export default function VideoRoom() {
  const { peers, userVideo } = useCamera();
  console.log("here is video Room");
  console.log("userVideo", userVideo);
  return (
    <>
      <p>{socket.id}</p>
      <Webcam className="it" ref={userVideo} autoPlay playsInline />
      {peers.map((peer, index) => {
        console.log(peer, "here is peer in videoRoom");
        return <Video key={index} peer={peer} />;
      })}
    </>
  );
}
