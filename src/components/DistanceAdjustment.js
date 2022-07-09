import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

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
  } = useStore();

  const navigate = useNavigate();
  const [participantUser, setParticipantUser] = useState(null);

  useEffect(() => {
    if (participantUser) {
      if (
        preStartFirstParticipantPose.length === 3 &&
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
          preStartFirstParticipantPose[0].score > 0.8
        ) {
          isItChild ? updateFirstChildParticipant() : null;
          socket.emit("isReady", true);
        }
      }
      if (
        preStartSecondparticipantPose.length === 3 &&
        participantUser[1].id === socket.id
      ) {
        const isItChild = divisionChildAndAdult(
          preStartSecondparticipantPose[0]
        );
        if (
          0 < sholuderLengthinScreen(preStartSecondparticipantPose[0]) <= 5 &&
          preStartSecondparticipantPose[0].score > 0.8
        ) {
          isItChild ? updateSecondChildParticipant() : null;
          socket.emit("isReady", true);
        }
      }

      socket.on("prepared-game", (payload) => {
        if (payload) {
          updateFirstParticipantPreparation();
          updateSecondParticipantPreparation();
          navigate("/countdown");
        }
      });
    }

    socket.on("prepared", (payload) => {
      if (payload) {
        updateFirstParticipantPreparation();
        updateSecondParticipantPreparation();
        navigate("/countdown");
      }
    });

    return () => {
      socket.off("prepared-game");
      socket.off("prepared");
    };
  }, [preStartFirstParticipantPose, preStartSecondparticipantPose]);

  return (
    <View
      mode="prepare"
      setParticipantUser={setParticipantUser}
      participant={participantUser}
    />
  );
}

export default DistanceAdjustment;
