import React, { useEffect } from "react";
import { useParams } from "react-router-dom";

import { SOCKET } from "../constants/constants";
import useStore from "../store/store";
import {
  distanceAdjustment,
  divisionChildAndAdult,
} from "../utils/motionDetection";
import { socket } from "../utils/socket";
import { socketApi } from "../utils/socket";

export default function useDistanceAdjustment(handleMode, participantUser) {
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
      const firstParticipantResult = distanceAdjustment(
        preStartFirstParticipantPose,
        participantUser[0].id,
        socket.id
      );

      if (firstParticipantResult) {
        const isItChild = divisionChildAndAdult(
          preStartFirstParticipantPose[0]
        );

        isItChild ? updateFirstChildParticipant() : null;

        socketApi.isReady(true, roomId);
      }

      const secondParticipantResult = distanceAdjustment(
        preStartSecondparticipantPose,
        participantUser[1].id,
        socket.id
      );

      if (secondParticipantResult) {
        const isItChild = divisionChildAndAdult(
          preStartSecondparticipantPose[0]
        );

        isItChild ? updateSecondChildParticipant() : null;

        socketApi.isReady(true, roomId);
      }
    }

    socket.on(SOCKET.PREPARED_GAME, (payload) => {
      updateFirstParticipantPreparation();
      updateSecondParticipantPreparation();
      handleMode("game");
    });

    return () => {
      socket.off(SOCKET.PREPARED_GAME);
    };
  }, [preStartFirstParticipantPose, preStartSecondparticipantPose]);
}
