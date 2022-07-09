import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { SOCKET } from "../constants/constants";
import useStore from "../store/store";
import { moveDetection, visibleButton } from "../utils/motionDetection";
import { socket } from "../utils/socket";
import View from "./View";

function Game() {
  const navigate = useNavigate();
  const [hasTouchDownButton, setHasTouchDownButton] = useState(false);
  const [hasStop, setHasStop] = useState(false);
  const [isItLoser, setIsItLoser] = useState(false);
  const [participantUser, setParticipantUser] = useState(null);
  const [itCount, setItCount] = useState(5);
  const [clickCount, setClickCount] = useState(0);
  const [isGameEnd, setIsGameEnd] = useState(false);
  const {
    addWinner,
    difficulty,
    firstParticipantPose,
    secondParticipantPose,
    isChildFirstParticipant,
    isChildSecondParticipant,
  } = useStore();

  useEffect(() => {
    if (
      firstParticipantPose.length === 3 &&
      participantUser[0].id === socket.id
    ) {
      const moved = moveDetection(
        firstParticipantPose[0],
        firstParticipantPose[2],
        difficulty,
        isChildFirstParticipant
      );

      const result = visibleButton(firstParticipantPose[0]);

      if (result) {
        setHasTouchDownButton(true);
      }

      if (moved) {
        socket.emit(SOCKET.MOVED, participantUser[0].id);
      }
    }
    if (
      secondParticipantPose.length === 3 &&
      participantUser[1].id === socket.id
    ) {
      const moved = moveDetection(
        secondParticipantPose[0],
        secondParticipantPose[2],
        difficulty,
        isChildSecondParticipant
      );

      const result = visibleButton(secondParticipantPose[0]);

      if (result) {
        setHasTouchDownButton(true);
      }
      if (moved) {
        socket.emit(SOCKET.MOVED, participantUser[1].id);
      }
    }
  }, [firstParticipantPose]);

  useEffect(() => {
    socket.on(SOCKET.START, (payload) => {
      if (payload) {
        setHasStop(true);
        setItCount((prev) => prev - 1);
      }
    });

    if (clickCount === 5) {
      socket.emit("count-end", true);
    }

    socket.on("it-end", (payload) => {
      if (payload) {
        setIsGameEnd(true);
      }
    });

    socket.on(SOCKET.PARTICIPANT_REMAINING_OPPORTUNITY, (payload) => {
      setParticipantUser(payload);
    });

    socket.on(SOCKET.PARTICIPANT_REMAINING_COUNT, (payload) => {
      setParticipantUser(payload);
    });

    socket.on(SOCKET.GAME_END, (payload) => {
      if (payload) {
        addWinner("술래");
        navigate("/ending");
      }
    });

    socket.on(SOCKET.ANOTHER_USER_END, (payload) => {
      if (payload) {
        addWinner("술래");
        navigate("/ending");
      }
    });

    return () => {
      socket.off(SOCKET.START);
      socket.off(SOCKET.PARTICIPANT_REMAINING_OPPORTUNITY);
      socket.off(SOCKET.PARTICIPANT_REMAINING_COUNT);
      socket.off(SOCKET.GAME_END);
      socket.off("it-end");
      socket.off(SOCKET.ANOTHER_USER_END);
    };
  }, [clickCount, isGameEnd]);

  useEffect(() => {
    if ((itCount === 0 && clickCount === 5) || (isGameEnd && itCount === 0)) {
      const reaminingUser = participantUser.filter(
        (item) => item.opportunity > 0
      );

      if (reaminingUser.length === 0) {
        addWinner("술래");
        navigate("/ending");
      } else {
        addWinner("참가자");
        navigate("/ending");
      }
    }

    if (isItLoser) {
      socket.emit("itLoser", true);
      addWinner("참가자");
      navigate("/ending");
    }

    socket.on("itLoser-gameEnd", (payload) => {
      if (payload) {
        addWinner("참가자");
        navigate("/ending");
      }
    });

    return () => {
      socket.off("itLoser-gameEnd");
    };
  }, [clickCount, isItLoser, isGameEnd]);

  return (
    <View
      setParticipantUser={setParticipantUser}
      participant={participantUser}
      mode="game"
      setItCount={setItCount}
      itCount={itCount}
      hasStop={hasStop}
      setHasStop={setHasStop}
      touchDown={hasTouchDownButton}
      handleLoser={setIsItLoser}
      handleClickCount={setClickCount}
      clickCount={clickCount}
    />
  );
}

export default Game;
