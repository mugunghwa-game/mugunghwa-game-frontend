import PropTypes from "prop-types";
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
  const { firstParticipantPreparation, secondParticipantPreparation } =
    useStore();

  const participantId = participantUser.map((person) => person.id);
  const anotherUserRef = useRef();

  useEffect(() => {
    peer.on("stream", (stream) => {
      anotherUserRef.current.srcObject = stream;
    });
  }, []);

  return (
    <VideoContainer>
      {firstParticipantPreparation && secondParticipantPreparation && (
        <>
          {peersRef.current[index].peerID === itUser[0] && (
            <span className="role">
              술래
              {itUser[0]}
              <span className="count">{itCount}</span>
            </span>
          )}
          {participantId.includes(peersRef.current[index].peerID) && (
            <span className="role">
              참가자
              <span className="count">
                {participantUser[index].opportunity}
              </span>
            </span>
          )}
        </>
      )}
      <video className="otherUser" playsInline autoPlay ref={anotherUserRef} />
    </VideoContainer>
  );
}

const VideoContainer = styled.div`
  margin-left: 30vh;
  width: 30vh;
  height: 30vh;
  line-height: 2vh;
  margin-bottom: 2vh;

  .otherUser {
    width: 50vh;
    height: 30vh;
    float: right;
    object-fit: fill;
  }

  .role {
    position: absolute;
    font-size: 1.5vh;
  }

  .count {
    color: #f47676;
  }
`;

Video.propTypes = {
  index: PropTypes.number,
  peersRef: PropTypes.object,
  participantUser: PropTypes.array,
  itUser: PropTypes.array,
  peer: PropTypes.object,
  itCount: PropTypes.number,
};
