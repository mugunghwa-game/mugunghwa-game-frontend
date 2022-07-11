import React from "react";

import { SOCKET } from "../constants/constants";
import useStore from "../store/store";
import { socket } from "../utils/socket";
import Button from "./Button";

function It({ user, itCount, handleCount, isAllGameEnd }) {
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
