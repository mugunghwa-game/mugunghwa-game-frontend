import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { SOCKET } from "../constants/constants";
import useStore from "../store/store";
import { moveDetection, visibleButton } from "../utils/motionDetection";
import { socketApi } from "../utils/socket";
import { socket } from "../utils/socket";

export default function useGame(
  participantUser,
  difficulty,
  clickCount,
  isItLoser,
  hasStop,
  itCount
) {
  const navigate = useNavigate();
  const [isGameEnd, setIsGameEnd] = useState(false);
  const {
    firstParticipantPose,
    secondParticipantPose,
    isChildFirstParticipant,
    isChildSecondParticipant,
    // addWinner,
    // winner,
  } = useStore();

  const [winner, setWinner] = useState("");

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
        // socketApi.userMoved(socket.id);
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
        // socketApi.userMoved(socket.id);
      }
    }
  }, [firstParticipantPose, secondParticipantPose]);

  useEffect(() => {
    // socket.on("poseDetection-start", (payload) => {
    //   console.log("술래 빼고 다 들어와야함", payload);
    //   if (payload) {
    //     handleStop(true);
    //     handleItCount((prev) => prev - 1);
    //   }
    // });

    // socket.on(SOCKET.PARTICIPANT_REMAINING_OPPORTUNITY, (payload) => {
    //   if (payload.count === 6) {
    //     if (
    //       payload.participant.filter((person) => person.opportunity === 0)
    //         .length === 2
    //     ) {
    //       setWinner("술래");
    //     } else {
    //       setWinner("참가자");
    //     }
    //   }

    //   handleParticipantUser(payload.participant);
    //   handleStop(false);
    // });

    // socket.on(SOCKET.GAME_END, (payload) => {
    //   if (payload) {
    //     addWinner("술래");
    //   }
    // });

    return () => {
      // socket.off(SOCKET.START);
      // socket.off(SOCKET.PARTICIPANT_REMAINING_OPPORTUNITY);
      // socket.off(SOCKET.GAME_END);
      // socket.off(SOCKET.IT_END);
      // socket.off("poseDetection-start");
    };
  }, [clickCount, hasStop, winner]);

  useEffect(() => {
    if (itCount === 0 && clickCount === 5) {
      // socket.on("user-loser", (payload) => {
      //   console.log("user loser", payload);
      //   setWinner("술래");
      // });
    }

    if (isItLoser) {
      // socketApi.itLoser(true);
    }

    // socket.on(SOCKET.IT_LOSER_GAME_END, (payload) => {
    //   if (payload) {
    //     setWinner("참가자");
    //   }
    // });

    return () => {
      // socket.off(SOCKET.IT_LOSER_GAME_END);
    };
  }, [clickCount, isItLoser]);

  return { winner };
}
