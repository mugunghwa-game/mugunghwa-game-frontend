import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { SOCKET } from "../constants/constants";
import useStore from "../store/store";
import { moveDetection, visibleButton } from "../utils/motionDetection";
import { socketApi } from "../utils/socket";
import { socket } from "../utils/socket";

export default function useGame(
  participantUser,
  handleItCount,
  handleParticipantUser,
  handleStop,
  difficulty,
  countdownStart,
  handleCountDownStart
) {
  const navigate = useNavigate();
  const { roomId } = useParams();

  const [countDown, setCountDown] = useState(3);
  const [isItLoser, setIsItLoser] = useState(false);
  const [hasTouchDownButton, setHasTouchDownButton] = useState(false);

  const {
    firstParticipantPose,
    secondParticipantPose,
    isChildFirstParticipant,
    isChildSecondParticipant,
    addWinner,
    winner,
  } = useStore();

  useEffect(() => {
    let interval;

    if (countdownStart) {
      if (countDown > 1) {
        interval = setInterval(() => {
          setCountDown((prev) => prev - 1);
        }, 1000);
      }
    }

    setTimeout(() => {
      clearInterval(interval);

      setCountDown(3);
      handleCountDownStart(false);
    }, 3000);
  }, [countdownStart]);

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

      if (firstParticipantMoved) {
        socketApi.userMoved(socket.id, true, roomId);
      } else {
        socketApi.userMoved(socket.id, false, roomId);
      }

      if (firstResult) {
        setHasTouchDownButton(true);
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

      if (secondParticipantMoved) {
        socketApi.userMoved(socket.id, true, roomId);
      } else {
        socketApi.userMoved(socket.id, false, roomId);
      }

      if (secondParticipantResult) {
        setHasTouchDownButton(true);
      }
    }
  }, [firstParticipantPose, secondParticipantPose]);

  useEffect(() => {
    socket.on(SOCKET.POSEDETECTION_START, (payload) => {
      handleStop(true);
      handleItCount((prev) => prev - 1);
    });

    socket.on(SOCKET.PARTICIPANT_REMAINING_OPPORTUNITY, (payload) => {
      handleParticipantUser(payload.participant);
      handleStop(false);
    });

    socket.on(SOCKET.GAME_END, (payload) => {
      addWinner("술래");
      navigate("/ending");
    });

    return () => {
      socket.off(SOCKET.PARTICIPANT_REMAINING_OPPORTUNITY);
      socket.off(SOCKET.GAME_END);
      socket.off(SOCKET.POSEDETECTION_START);
    };
  }, [winner]);

  useEffect(() => {
    if (isItLoser) {
      socketApi.itLoser(true, roomId);
    }

    socket.on(SOCKET.IT_LOSER_GAME_END, (payload) => {
      addWinner("참가자");
      navigate("/ending");
    });

    socket.on(SOCKET.CLICK_COUNT_NONE, (payload) => {
      payload.filter((person) => person.opportunity !== 0).length > 0
        ? addWinner("참가자")
        : addWinner("술래");

      navigate("/ending");
    });

    return () => {
      socket.off(SOCKET.IT_LOSER_GAME_END);
      socket.off(SOCKET.USER_LOSER);
      socket.off(SOCKET.CLICK_COUNT_NONE);
    };
  }, [isItLoser]);

  return {
    hasTouchDownButton,
    countdownStart,
    countDown,
    setIsItLoser,
  };
}
