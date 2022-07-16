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
      console.log(clickCount);

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

    socket.on(SOCKET.PARTICIPANT_REMAINING_OPPORTUNITY, (payload) => {
      if (payload.count === 6) {
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
      if (payload) {
        addWinner("술래");
        navigate("/ending");
      }
    });

    return () => {
      socket.off(SOCKET.PARTICIPANT_REMAINING_OPPORTUNITY);
      socket.off(SOCKET.GAME_END);
      socket.off("poseDetection-start");
    };
  }, [clickCount, hasStop, winner]);

  useEffect(() => {
    if (itCount === 0 && clickCount === 5) {
      socket.on("user-loser", (payload) => {
        console.log("user loser", payload);
        addWinner("술래");
        navigate("/ending");
      });
    }

    if (isItLoser) {
      socketApi.itLoser(true);
    }

    socket.on(SOCKET.IT_LOSER_GAME_END, (payload) => {
      if (payload) {
        addWinner("참가자");
        navigate("/ending");
      }
    });

    return () => {
      socket.off(SOCKET.IT_LOSER_GAME_END);
      socket.off("user-loser");
    };
  }, [clickCount, isItLoser]);

  return <></>;
}

export default Game;
