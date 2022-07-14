import React, { useEffect, useState } from "react";

import { SOCKET } from "../constants/constants";
import useStore from "../store/store";
import {
  divisionChildAndAdult,
  moveDetection,
  sholuderLengthinScreen,
  visibleButton,
} from "../utils/motionDetection";
import { socket } from "../utils/socket";
import { socketApi } from "../utils/socket";

function DistanceAdjustment({
  handleSingleMode,
  participantUser,
  handleMode,
  itUser,
}) {
  const {
    preStartFirstParticipantPose,
    preStartSecondparticipantPose,
    updateFirstParticipantPreparation,
    updateSecondParticipantPreparation,
    updateSecondChildParticipant,
    updateFirstChildParticipant,
    singleModeUserPose,
  } = useStore();

  const [count, setCount] = useState(20);

  useEffect(() => {
    if (singleModeUserPose.length !== 0) {
      const sholuderLength = sholuderLengthinScreen(singleModeUserPose[0]);
      console.log(sholuderLength, singleModeUserPose[0].score);
      if (0 < sholuderLength < 5 && singleModeUserPose[0].score > 0.7) {
        handleSingleMode(true);
      }
    }
  }, [singleModeUserPose]);

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
          0 < sholuderLength < 5 &&
          preStartFirstParticipantPose[0].score > 0.7
        ) {
          console.log("heelllll here is one");
          isItChild ? updateFirstChildParticipant() : null;
          socketApi.isReady(true);
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
          0 < sholuderLengthinScreen(preStartSecondparticipantPose[0]) <= 5 &&
          preStartSecondparticipantPose[0].score > 0.7
        ) {
          console.log("heelllll here is two");

          isItChild ? updateSecondChildParticipant() : null;
          socketApi.isReady(true);
        }
      }
    }

    socket.on(SOCKET.PREPARED_GAME, (payload) => {
      if (payload) {
        console.log("prepare");
        updateFirstParticipantPreparation();
        updateSecondParticipantPreparation();
        handleMode("game");
      }
    });

    socket.on(SOCKET.PREPARED, (payload) => {
      if (payload) {
        console.log("prepare");
        updateFirstParticipantPreparation();
        updateSecondParticipantPreparation();
        handleMode("game");
      }
    });

    return () => {
      socket.off(SOCKET.PREPARED_GAME);
      socket.off(SOCKET.PREPARED);
    };
  }, [preStartFirstParticipantPose, preStartSecondparticipantPose]);

  return (
    <>
      <div>{count}</div>
    </>
  );
}

export default DistanceAdjustment;
