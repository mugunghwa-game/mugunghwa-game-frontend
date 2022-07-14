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
    <Container>
      <video className="otherUser" playsInline autoPlay ref={otherUserRef} />
    </Container>
  );
}

const Container = styled.div`
  padding: 20px;
  display: flex;
  height: 100vh;
  width: 90%;
  margin: auto;
  flex-wrap: wrap;
`;
