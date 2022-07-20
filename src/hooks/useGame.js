import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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
  clickCount,
  itCount,
  hasStop,
  difficulty,
  countdownStart,
  handleCountDownStart
) {
  const navigate = useNavigate();

  const [countDown, setCounDown] = useState(3);
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
        socketApi.userMoved(socket.id);
      }

      if (firstResult) {
        setHasTouchDownButton(true);
      }
      console.log("첫번째사람 움직임", firstParticipantMoved, difficulty);
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
        socketApi.userMoved(socket.id);
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
      if (payload.count === 5) {
        if (
          payload.participant.filter((person) => person.opportunity === 0)
            .length === 2
        ) {
          addWinner("술래");
        } else {
          addWinner("참가자");
        }
        navigate("/ending");
      }

      handleParticipantUser(payload.participant);
      handleStop(false);
    });

    socket.on(SOCKET.GAME_END, (payload) => {
      //참가자 둘 다 기회가 0일때
      addWinner("술래");
      navigate("/ending");
    });

    return () => {
      socket.off(SOCKET.PARTICIPANT_REMAINING_OPPORTUNITY);
      socket.off(SOCKET.GAME_END);
      socket.off(SOCKET.POSEDETECTION_START);
    };
  }, [hasStop, winner]);

  console.log(clickCount, "clickCount", itCount);

  useEffect(() => {
    let interval;

    if (countdownStart) {
      if (countDown > 1) {
        interval = setInterval(() => {
          setCounDown((prev) => prev - 1);
        }, 1000);
      }
    }

    setTimeout(() => {
      clearInterval(interval);

      setCounDown(3);
      handleCountDownStart(false);
    }, 3000);
  }, [countdownStart]);

  useEffect(() => {
    if (isItLoser) {
      //등때리기 버튼 눌렀을 때
      socketApi.itLoser(true);
    }

    socket.on(SOCKET.IT_LOSER_GAME_END, (payload) => {
      //등때리기 버튼 눌렀을 때
      addWinner("참가자");
      navigate("/ending");
    });

    return () => {
      socket.off(SOCKET.IT_LOSER_GAME_END);
      socket.off(SOCKET.USER_LOSER);
    };
  }, [clickCount, isItLoser, itCount]);

  return {
    hasTouchDownButton,
    countdownStart,
    countDown,
    setIsItLoser,
  };
}
