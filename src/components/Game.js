import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { SOCKET } from "../constants/constants";
import useStore from "../store/store";
import { moveDetection, visibleButton } from "../utils/motionDetection";
import { socketApi } from "../utils/socket";
import { socket } from "../utils/socket";

function Game({
  participantUser,
  handleTouchDown,
  handleItCount,
  handleParticipantUser,
  handleStop,
  clickCount,
  isItLoser,
  itCount,
  hasStop,
  difficulty,
}) {
  const navigate = useNavigate();
  const [isGameEnd, setIsGameEnd] = useState(false);
  const {
    firstParticipantPose,
    secondParticipantPose,
    isChildFirstParticipant,
    isChildSecondParticipant,
    addWinner,
  } = useStore();

  useEffect(() => {
    if (
      firstParticipantPose.length === 3 &&
      participantUser[0].id === socket.id
    ) {
      const firstParticipantMoved = moveDetection(
        firstParticipantPose[0],
        firstParticipantPose[2],
        difficulty[0],
        isChildFirstParticipant
      );

      const firstResult = visibleButton(firstParticipantPose[0]);

      if (firstResult) {
        handleTouchDown(true);
      }
      console.log("첫번째사람 움직임", firstParticipantMoved, difficulty);
      if (firstParticipantMoved) {
        socketApi.userMoved(socket.id);
      }
    }
    if (
      secondParticipantPose.length === 3 &&
      participantUser[1].id === socket.id
    ) {
      const secondParticipantMoved = moveDetection(
        secondParticipantPose[0],
        secondParticipantPose[2],
        difficulty[0],
        isChildSecondParticipant
      );
      const secondParticipantResult = visibleButton(secondParticipantPose[0]);

      if (secondParticipantResult) {
        handleTouchDown(true);
      }
      if (secondParticipantMoved) {
        socketApi.userMoved(socket.id);
      }
    }
  }, [firstParticipantPose, secondParticipantPose]);

  useEffect(() => {
    socket.on("poseDetection-start", (payload) => {
      console.log("술래 빼고 다 들어와야함", payload);
      if (payload) {
        handleStop(true);
        handleItCount((prev) => prev - 1);
      }
    });

    if (clickCount === 5) {
      socketApi.countEnd(true);
    }

    socket.on(SOCKET.IT_END, (payload) => {
      if (payload) {
        setIsGameEnd(true);
      }
    });

    socket.on(SOCKET.PARTICIPANT_REMAINING_OPPORTUNITY, (payload) => {
      console.log("얘 움직였어", payload);
      handleParticipantUser(payload);
      handleStop(false);
    });

    socket.on(SOCKET.PARTICIPANT_REMAINING_COUNT, (payload) => {
      console.log("얘 움직였어", payload);

      handleParticipantUser(payload);
      handleStop(false);
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
      socket.off(SOCKET.IT_END);
      socket.off(SOCKET.ANOTHER_USER_END);
      socket.off("poseDetection-start");
    };
  }, [clickCount, isGameEnd, hasStop]);

  useEffect(() => {
    if ((itCount === 0 && clickCount === 5) || (isGameEnd && itCount === 0)) {
      const reaminingUser = participantUser.filter(
        (item) => item.opportunity > 0
      );

      if (reaminingUser.length === 0) {
        addWinner("술래");
      } else {
        addWinner("참가자");
      }
      navigate("/ending");
    }

    if (isItLoser) {
      socketApi.itLoser(true);
      addWinner("참가자");
      navigate("/ending");
    }

    socket.on(SOCKET.IT_LOSER_GAME_END, (payload) => {
      if (payload) {
        addWinner("참가자");
        navigate("/ending");
      }
    });

    return () => {
      socket.off(SOCKET.IT_LOSER_GAME_END);
    };
  }, [clickCount, isItLoser, isGameEnd]);

  return <></>;
}

export default Game;
