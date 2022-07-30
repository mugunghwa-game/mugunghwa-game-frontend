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
  const participantIndex = participantId.indexOf(
    peersRef.current[index].peerID
  );

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
              <span className="highlight"> 술래 </span>기회의 수{" "}
              <span className="highlight">{itCount}</span>
            </span>
          )}
          {participantId.includes(peersRef.current[index].peerID) && (
            <span className="role">
              <span className="highlight">
                참가자{peersRef.current[index].peerID}
              </span>{" "}
              기회의 수{" "}
              <span className="highlight">
                {participantUser[participantIndex].opportunity}
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
  margin-left: 20vh;
  width: 40vh;
  height: 30vh;
  margin-bottom: 2vh;

  .otherUser {
    width: 50vh;
    height: 30vh;
    float: right;
    object-fit: fill;
  }

  .role {
    position: absolute;
  }

  .highlight {
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
