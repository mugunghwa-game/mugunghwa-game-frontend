import React, { useEffect, useRef } from "react";
import styled from "styled-components";

export default function UserVideoRoom({
  index,
  peersRef,
  participantUser,
  itUser,
  peer,
  itCount,
}) {
  const anotherUserRef = useRef();
  const participantId = participantUser.map((person) => person.id);

  useEffect(() => {
    peer.on("stream", (stream) => {
      anotherUserRef.current.srcObject = stream;
    });
  }, []);

  return (
    <VideoContainer>
      {peersRef.current[index].peerID === itUser[0] && (
        <span>
          술래{itCount}
          {itUser[0]}
        </span>
      )}
      {participantId.includes(peersRef.current[index].peerID) && (
        <span>
          참가자{peersRef.current[index].peerID}
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
  grid-template-columns: 130px;
  grid-template-rows: 40px;

  .otherUser {
    position: relative;
    width: 400px;
    height: 200px;
    float: right;
    object-fit: fill;
  }
`;
