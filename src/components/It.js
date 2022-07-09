import React from "react";
import Webcam from "react-webcam";

import { SOCKET } from "../constants/constants";
import useStore from "../store/store";
import { socket } from "../utils/socket";
import Button from "./Button";

function It({ user, itCount, handleCount, userVideo }) {
  const { fistParticipantPreparation, secondParticipantPreparation } =
    useStore();

  const handleStopButton = () => {
    if (itCount > 0) {
      handleCount((prev) => prev - 1);
      socket.emit(SOCKET.MOTION_START, true);
    }
  };

  return (
    <>
      {user && (
        <>
          <div className="opportunity">
            {user[0] === socket.id ? (
              <div>
                나 <span>술래</span>
              </div>
            ) : (
              <span>술래</span>
            )}
            {fistParticipantPreparation && secondParticipantPreparation && (
              <span> 남은기회의 수{itCount}</span>
            )}
          </div>
          <div className="it">
            <Webcam className="itCam" muted ref={userVideo} />
          </div>
        </>
      )}
      {user &&
        user[0] === socket.id &&
        fistParticipantPreparation &&
        secondParticipantPreparation && (
          <div className="stop">
            <Button handleClick={handleStopButton}>멈춤</Button>
          </div>
        )}
    </>
  );
}

export default It;
