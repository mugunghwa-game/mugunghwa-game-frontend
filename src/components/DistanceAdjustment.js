import React, { useEffect, useState } from "react";
import styled from "styled-components";

import { SOCKET } from "../constants/constants";
import useStore from "../store/store";
import {
  divisionChildAndAdult,
  sholuderLengthinScreen,
} from "../utils/motionDetection";
import { socket, socketApi } from "../utils/socket";

export default function DistanceAdustment({ handleMode }) {
  const {
    preStartFirstParticipantPose,
    preStartSecondparticipantPose,
    updateFirstParticipantPreparation,
    updateSecondParticipantPreparation,
    updateSecondChildParticipant,
    updateFirstChildParticipant,
    singleModeUserPose,
    participantList,
    it,
  } = useStore();

  console.log(preStartFirstParticipantPose, preStartSecondparticipantPose);

  //   useEffect(() => {
  //     if (singleModeUserPose.length !== 0) {
  //       const sholuderLength = sholuderLengthinScreen(singleModeUserPose[0]);

  //       if (0 < sholuderLength < 5 && singleModeUserPose[0].score > 0.8) {
  //         handleSingleMode(true);
  //       }
  //     }
  //   }, [singleModeUserPose]);

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
          socketApi.isReady(true);
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
          isItChild ? updateSecondChildParticipant() : null;
          socketApi.isReady(true);
        }
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

    return () => {
      socket.off(SOCKET.PREPARED_GAME);
      socket.off(SOCKET.PREPARED);
    };
  }, [preStartFirstParticipantPose, preStartFirstParticipantPose]);

  return (
    <>
      <Description>
        {it[0] === socket.id ? (
          <>
            <span className="color">
              참가자들이 위치로 갈 때까지 잠시만 기다려주세요
            </span>
          </>
        ) : (
          <span className="color">카메라 앞에서 10 발자국 뒤로 물러서세요</span>
        )}
      </Description>
    </>
  );
}

const Description = styled.div`
  margin-top: 2.5vh;
  text-align: center;
  font-size: 3.7vh;

  .color {
    color: #199816;
  }
`;
