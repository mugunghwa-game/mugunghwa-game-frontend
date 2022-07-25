import React, { useEffect } from "react";
import { useParams } from "react-router-dom";

import { SOCKET } from "../constants/constants";
import useStore from "../store/store";
import {
  divisionChildAndAdult,
  sholuderLengthinScreen,
} from "../utils/motionDetection";
import { socket } from "../utils/socket";
import { socketApi } from "../utils/socket";

export default function useDistanceAdjustment(
  gameMode,
  handleMode,
  participantUser
) {
  const { roomId } = useParams();

  const {
    preStartFirstParticipantPose,
    preStartSecondparticipantPose,
    updateFirstParticipantPreparation,
    updateSecondParticipantPreparation,
    updateSecondChildParticipant,
    updateFirstChildParticipant,
  } = useStore();

  useEffect(() => {
    if (participantUser) {
      if (
        preStartFirstParticipantPose.length !== 0 &&
        participantUser[0].id === socket.id
      ) {
        const sholuderLength = sholuderLengthinScreen(
          preStartFirstParticipantPose[0]
        );

        const isItChild = divisionChildAndAdult(
          preStartFirstParticipantPose[0]
        );
        if (
          0 < sholuderLength < 20 &&
          preStartFirstParticipantPose[0].score > 0.1
        ) {
          isItChild ? updateFirstChildParticipant() : null;
          socketApi.isReady(true, roomId);
        }
      }

      if (
        preStartSecondparticipantPose.length !== 0 &&
        participantUser[1].id === socket.id
      ) {
        const isItChild = divisionChildAndAdult(
          preStartSecondparticipantPose[0]
        );

        if (
          0 < sholuderLengthinScreen(preStartSecondparticipantPose[0]) <= 20 &&
          preStartSecondparticipantPose[0].score > 0.1
        ) {
          isItChild ? updateSecondChildParticipant() : null;
          socketApi.isReady(true, roomId);
        }
      }

      socket.on(SOCKET.PREPARED_GAME, (payload) => {
        if (payload) {
          updateFirstParticipantPreparation();
          updateSecondParticipantPreparation();
          handleMode("game");
        }
      });

      socket.on(SOCKET.PREPARED, (payload) => {
        if (payload) {
          updateFirstParticipantPreparation();
          updateSecondParticipantPreparation();
          handleMode("game");
        }
      });
    }

    return () => {
      socket.off(SOCKET.PREPARED_GAME);
      socket.off(SOCKET.PREPARED);
    };
  }, [preStartFirstParticipantPose, preStartSecondparticipantPose]);

  return {
    gameMode,
  };
}
