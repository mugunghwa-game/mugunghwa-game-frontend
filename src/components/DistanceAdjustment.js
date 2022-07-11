import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { SOCKET } from "../constants/constants";
import useStore from "../store/store";
import {
  divisionChildAndAdult,
  sholuderLengthinScreen,
} from "../utils/motionDetection";
import { socket } from "../utils/socket";
import View from "./View";

function DistanceAdjustment() {
  const {
    preStartFirstParticipantPose,
    preStartSecondparticipantPose,
    updateFirstChildParticipant,
    updateSecondChildParticipant,
    updateFirstParticipantPreparation,
    updateSecondParticipantPreparation,
    participantList,
  } = useStore();
  // console.log(preStartFirstParticipantPose);

  const navigate = useNavigate();
  const [participantUser, setParticipantUser] = useState(null);
  const [mode, setMode] = useState("prepare");

  useEffect(() => {
    if (participantUser) {
      console.log(preStartFirstParticipantPose, preStartSecondparticipantPose);

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
        console.log(isItChild, sholuderLength);
        if (
          0 < sholuderLength < 5 &&
          preStartFirstParticipantPose[0].score > 0.7
        ) {
          console.log("heelllll here is one");
          isItChild ? updateFirstChildParticipant() : null;
          socket.emit(SOCKET.IS_READY, true);
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
          socket.emit(SOCKET.IS_READY, true);
        }
      }
    }
    socket.on(SOCKET.PREPARED_GAME, (payload) => {
      if (payload) {
        console.log("prepare");
        updateFirstParticipantPreparation();
        updateSecondParticipantPreparation();
        setMode("game");
        // navigate("/countdown");
      }
    });
    socket.on(SOCKET.PREPARED, (payload) => {
      if (payload) {
        console.log("prepare");

        updateFirstParticipantPreparation();
        updateSecondParticipantPreparation();
        setMode("game");
        // navigate("/countdown");
      }
    });

    return () => {
      socket.off(SOCKET.PREPARED_GAME);
      socket.off(SOCKET.PREPARED);
    };
  }, [preStartFirstParticipantPose, preStartSecondparticipantPose, mode]);

  return (
    <>
      <View
        mode={mode}
        setParticipantUser={setParticipantUser}
        participant={participantUser}
      />
    </>
  );
}

export default DistanceAdjustment;
