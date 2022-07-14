import React, { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";

import useStore from "../store/store";
export default function Video(props) {
  const { addVideoNumber, vidoeNumber, firstVideo } = useStore();

  const { stream } = props;
  const anotherUserRef = useRef();

  console.log(props.peer.streams[0].id, "props");
  console.log(stream.id, "이거는 내꺼");

  useEffect(() => {
    console.log(props.peer.streams[0].id === firstVideo[0]);
    props.peer.on("stream", (stream) => {
      console.log("다른 사람stream", stream);
      console.log("hereis");
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
