import React, { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";

import useStore from "../store/store";

export default function Video(props) {
  const anotherUserRef = useRef();

  //   console.log(props.peer.streams[0].id, "props");

  useEffect(() => {
    props.peer.on("stream", (stream) => {
      anotherUserRef.current.srcObject = stream;
      console.log(anotherUserRef);
    });
    return () => {
      anotherUserRef.current = null;
    };
  }, []);

  return (
    <>
      <Webcam
        className="anotherUser"
        playsInline
        autoPlay
        ref={anotherUserRef}
      />
    </>
  );
}