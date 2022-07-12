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

function PrepareGame({ participantUser, handleMode, itUser }) {
  const {
    preStartFirstParticipantPose,
    preStartSecondparticipantPose,
    updateFirstParticipantPreparation,
    updateSecondParticipantPreparation,
  } = useStore();

  const [count, setCount] = useState(20);

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
      {itUser && participantUser && itUser[0] === socket.id && (
        <span className="color">
          참가자들이 위치로 갈 때까지 잠시만 기다려주세요
        </span>
      )}
      <div>{count}</div>
    </>
  );
}

export default PrepareGame;
