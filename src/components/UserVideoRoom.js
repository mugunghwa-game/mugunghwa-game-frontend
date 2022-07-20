import PropTypes from "prop-types";
import React from "react";
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
  participantList,
}) {
  console.log(peers);
  const { fistParticipantPreparation, secondParticipantPreparation } =
    useStore();

  const handleStopButton = () => {
    if (itCount > 0) {
      socketApi.motionStart(true);
    }
  };

  return (
    <>
      <div>
        <Webcam className="userVideo" ref={userVideo} autoPlay playsInline />
        <canvas ref={userCanvas} className="userVideo" />
      </div>
      <div className="userRole">
        <span className="me"> 나</span>
        {socket.id === itUser[0] ? (
          <span>술래{socket.id}</span>
        ) : (
          <span>참가자{socket.id}</span>
        )}
        {fistParticipantPreparation && secondParticipantPreparation && (
          <div className="userOpportunity">
            기회의 수
            {itUser && socket.id === itUser[0] && <span> {itCount}</span>}
            {participantUser.map(
              (person, index) =>
                person.id === socket.id && (
                  <span key={index}>{person.opportunity}</span>
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
            participantList={participantList}
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
  participantList: PropTypes.array,
};
