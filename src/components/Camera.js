import React, { useEffect, useRef } from "react";
import Webcam from "react-webcam";

import { socket } from "../utils/socket";

function Camera({ userVideo, userCanvas, itUser, peers }) {
  const anotherUserRef = useRef(null);

  const Video = (props) => {
    useEffect(() => {
      props.peer.on("stream", (stream) => {
        anotherUserRef.current.srcObject = stream;
      });
    }, []);

    return (
      <>
        <Webcam className="two" playsInline autoPlay ref={anotherUserRef} />
      </>
    );
  };

  return (
    <>
      <div>
        <Webcam className="one" ref={userVideo} autoPlay playsInline />
        {itUser && socket.id !== itUser[0] && (
          <canvas className="one" ref={userCanvas} />
        )}
      </div>
      <div>
        {peers && peers.map((peer, index) => <Video key={index} peer={peer} />)}
      </div>
    </>
  );
}

export default Camera;
