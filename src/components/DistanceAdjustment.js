import React, { useEffect } from "react";

import { SOCKET } from "../constants/constants";
import useStore from "../store/store";
import {
  divisionChildAndAdult,
  sholuderLengthinScreen,
} from "../utils/motionDetection";
import { socket } from "../utils/socket";
import { socketApi } from "../utils/socket";

function DistanceAdjustment({ handleSingleMode, handleMode }) {
  const {
    preStartFirstParticipantPose,
    preStartSecondparticipantPose,
    updateFirstParticipantPreparation,
    updateSecondParticipantPreparation,
    updateSecondChildParticipant,
    updateFirstChildParticipant,
    singleModeUserPose,
    participantList,
  } = useStore();

  useEffect(() => {
    if (singleModeUserPose.length !== 0) {
      const sholuderLength = sholuderLengthinScreen(singleModeUserPose[0]);
      console.log(sholuderLength, singleModeUserPose[0].score);
      if (0 < sholuderLength < 5 && singleModeUserPose[0].score > 0.8) {
        handleSingleMode(true);
      }
    }
  }, [singleModeUserPose]);

  useEffect(() => {
    if (participantList) {
      if (
        preStartFirstParticipantPose.length !== 0 &&
        participantList[0] === socket.id
      ) {
        const sholuderLength = sholuderLengthinScreen(
          preStartFirstParticipantPose[0]
        );
        const isItChild = divisionChildAndAdult(
          preStartFirstParticipantPose[0]
        );
        if (
          0 < sholuderLength < 5 &&
          preStartFirstParticipantPose[0].score > 0.8
        ) {
          console.log("heelllll here is one");
          isItChild ? updateFirstChildParticipant() : null;
          // socketApi.isReady(true);
        }
      }

      if (
        preStartSecondparticipantPose.length !== 0 &&
        participantList[1] === socket.id
      ) {
        const isItChild = divisionChildAndAdult(
          preStartSecondparticipantPose[0]
        );
        if (
          0 < sholuderLengthinScreen(preStartSecondparticipantPose[0]) <= 5 &&
          preStartSecondparticipantPose[0].score > 0.8
        ) {
          console.log("heelllll here is two");

          isItChild ? updateSecondChildParticipant() : null;
          // socketApi.isReady(true);
        }
      }
    }

    // socket.on(SOCKET.PREPARED_GAME, (payload) => {
    //   if (payload) {
    //     console.log("prepare");
    //     updateFirstParticipantPreparation();
    //     updateSecondParticipantPreparation();
    //     handleMode("game");
    //   }
    // });

    // socket.on(SOCKET.PREPARED, (payload) => {
    //   if (payload) {
    //     console.log("prepare");
    //     updateFirstParticipantPreparation();
    //     updateSecondParticipantPreparation();
    //     handleMode("game");
    //   }
    // });

    return () => {
      // socket.off(SOCKET.PREPARED_GAME);
      // socket.off(SOCKET.PREPARED);
    };
  }, [preStartFirstParticipantPose, preStartSecondparticipantPose]);

  return <></>;
}

export default DistanceAdjustment;
