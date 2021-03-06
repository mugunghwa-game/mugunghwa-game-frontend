import PropTypes from "prop-types";
import React from "react";
import { useParams } from "react-router-dom";
import Webcam from "react-webcam";

import useStore from "../store/store";
import { socket, socketApi } from "../utils/socket";
import Button from "./Button";
import Video from "./Video";

export default function UserVideoRoom({
  itUser,
  itCount,
  userVideo,
  userCanvas,
  participantUser,
  peers,
  peersRef,
  hasStop,
}) {
  const { roomId } = useParams();

  const { firstParticipantPreparation, secondParticipantPreparation } =
    useStore();

  const handleStopButton = () => {
    if (itCount > 0 && hasStop) {
      socketApi.motionStart(true, roomId);
    }
  };

  return (
    <>
      <div>
        <Webcam className="userVideo" ref={userVideo} autoPlay playsInline />
        <canvas ref={userCanvas} className="userVideo" />
      </div>
      <div className="userRole">
        <span className="me"> 나 </span>
        {socket.id === itUser[0] ? <span>술래</span> : <span>참가자</span>}
        {firstParticipantPreparation && secondParticipantPreparation && (
          <div
            className={
              socket.id === itUser[0]
                ? "userOpportunity"
                : "participantUserOpportunity"
            }
          >
            기회의 수{"  "}
            {itUser && socket.id === itUser[0] && <span> {itCount}</span>}
            {participantUser.map(
              (person) =>
                person.id === socket.id && (
                  <span key={person.id}>{person.opportunity}</span>
                )
            )}
            {socket.id === itUser[0] && (
              <Button handleClick={handleStopButton}>멈춤</Button>
            )}
          </div>
        )}
      </div>
      <div>
        {peers.map((peer, index) => (
          <Video
            key={peer.peerID}
            index={index}
            peer={peer.peer}
            peersRef={peersRef}
            itUser={itUser}
            itCount={itCount}
            participantUser={participantUser}
          />
        ))}
      </div>
    </>
  );
}

UserVideoRoom.propTypes = {
  itUser: PropTypes.array,
  itCount: PropTypes.number,
  userVideo: PropTypes.object,
  userCanvas: PropTypes.object,
  participantUser: PropTypes.array,
  peers: PropTypes.array,
  peersRef: PropTypes.object,
};
