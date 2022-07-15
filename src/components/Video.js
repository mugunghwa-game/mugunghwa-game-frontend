import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";

export default function Video(props) {
  const anotherUserRef = useRef();

  useEffect(() => {
    props.peer.on("stream", (stream) => {
      anotherUserRef.current.srcObject = stream;
    });
  }, []);

  return (
    <VideoContainer>
      <video className="otherUser" playsInline autoPlay ref={anotherUserRef} />
    </VideoContainer>
  );
}

const VideoContainer = styled.div`
  display: grid;
  grid-template-columns: 220px;
  grid-template-rows: 250px;

  .otherUser {
    position: relative;
    width: 400px;
    height: 200px;
    float: right;
    object-fit: fill;
  }
`;
