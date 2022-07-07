import React from "react";
import Webcam from "react-webcam";

import { socket } from "../utils/socket";

function EachParticipant({
  peers,
  participantUser,
  firstParticipantRef,
  secondParticipantRef,
  firstCanvas,
  secondCanvas,
}) {
  return (
    <>
      {peers.map((peer, index) => (
        <span key={index}>
          {participantUser[index].id && (
            <span>
              {participantUser[index].id === socket.id ? (
                <span>나 </span>
              ) : null}
              {index}남은 기회의 수 {participantUser[index].opportunity}
              <>
                <div className="participant">
                  <Webcam
                    className="one"
                    key={index}
                    peer={peer}
                    ref={
                      index === 0 ? firstParticipantRef : secondParticipantRef
                    }
                  />
                  <canvas
                    ref={index === 0 ? firstCanvas : secondCanvas}
                    className="one"
                  />
                </div>
              </>
            </span>
          )}
        </span>
      ))}
    </>
  );
}

export default EachParticipant;
