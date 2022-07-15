import React, { useEffect, useRef } from "react";
import styled from "styled-components";

import useStore from "../store/store";

export default function Video({
  index,
  peersRef,
  participantUser,
  itUser,
  peer,
  itCount,
}) {
  const { participantList } = useStore();
  const anotherUserRef = useRef();

  console.log(peersRef.current, participantList, participantUser);

  useEffect(() => {
    peer.on("stream", (stream) => {
      anotherUserRef.current.srcObject = stream;
    });
  }, []);

  const result = participantUser.map(
    (item, index) => participantUser[index].id
  );

  return (
    <VideoContainer>
      {peersRef.current[index].peerID === itUser[0] && (
        <span>술래{itCount}</span>
      )}
      {result.includes(peersRef.current[index].peerID) && (
        <span>
          {peersRef.current[index].peerID}
          {index}
        </span>
      )}
      {participantUser[0].id === peersRef.current[index].peerID ? (
        <span>
          {participantUser[0].opportunity}
          index{index}
        </span>
      ) : (
        <span>
          {participantUser[1].opportunity}
          index {index}
        </span>
      )}
      <video className="otherUser" playsInline autoPlay ref={anotherUserRef} />
    </VideoContainer>
  );
}

const VideoContainer = styled.div`
  display: grid;
  grid-template-columns: 220px;
  grid-template-rows: 220px;

  .otherUser {
    position: relative;
    width: 400px;
    height: 200px;
    float: right;
    object-fit: fill;
  }
`;
