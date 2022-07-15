import React from "react";

import { SOCKET } from "../constants/constants";
import useStore from "../store/store";
import { socket } from "../utils/socket";
import Button from "./Button";

function It({ itCount, handleCount, isAllGameEnd }) {
  const { it, fistParticipantPreparation, secondParticipantPreparation } =
    useStore();

  const handleStopButton = () => {
    if (itCount > 0) {
      handleCount((prev) => prev - 1);
      socket.emit(SOCKET.MOTION_START, true);
    }
  };

  return (
    <>
      {it &&
        it[0] === socket.id &&
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
