import * as posenet from "@tensorflow-models/posenet";
import React, { useEffect, useRef, useState } from "react";
import Peer from "simple-peer";
import styled from "styled-components";

import useGame from "../hooks/useGame";
import useVideo from "../hooks/useVideo";
import useStore from "../store/store";
import { drawCanvas, videoReference } from "../utils/posenet";
import { socket, socketApi } from "../utils/socket";
import DefaultPage from "./DefaultPage";
import DistanceAdjustment from "./DistanceAdjustment";
import DescriptionContent from "./DscriptionContent";
import Event from "./Event";
import Game from "./Game";
import UserVideoRoom from "./UserVideoRoom";

function View() {
  const {
    addPreStartFirstParticipantPose,
    addPreStartSecondparticipantPose,
    addFirstParticipantPose,
    addSecondParticipantPose,
    fistParticipantPreparation,
    secondParticipantPreparation,
    participantList,
  } = useStore();
  const [isItLoser, setIsItLoser] = useState(false);
  const [hasStop, setHasStop] = useState(false);
  const [countDownStart, setCountDownStart] = useState(false);
  const userCanvas = useRef();
  const [hasTouchDownButton, setHasTouchDownButton] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [itCount, setItCount] = useState(5);
  const [mode, setMode] = useState("prepare");

  const {
    userVideo,
    participantUser,
    itUser,
    difficulty,
    isRedadyPoseDetection,
    peers,
    peersRef,
    setParticipantUser,
  } = useVideo();

  const runPosenet = async () => {
    const net = await posenet.load({
      inputResolution: { width: 640, height: 480 },
      scale: 0.8,
    });

    if (mode === "game" && hasStop) {
      const temp = setInterval(() => {
        detect(net);
      }, 1000);
      console.log("im here");
      setTimeout(() => {
        setClickCount((prev) => prev + 1),
          clearInterval(temp),
          console.log("done");
      }, 3000);
    }

    if (mode === "prepare" && itUser[0] !== socket.id) {
      const temp = setInterval(() => {
        detect(net);
      }, 3000);

      setTimeout(() => clearInterval(temp) && console.log("done"), 20000);
    }
  };

  useEffect(() => {
    if (
      mode === "prepare" &&
      isRedadyPoseDetection &&
      itUser[0] !== socket.id
    ) {
      runPosenet();
    }
    if (mode === "game" && hasStop) {
      console.log("game runposenet", hasStop);
      runPosenet();
      setCountDownStart(true);
      setHasStop(false);
    }
  }, [hasStop, isRedadyPoseDetection]);

  const detect = async (net) => {
    if (
      typeof userVideo.current !== "undefined" &&
      userVideo.current !== null &&
      userVideo.current.video.readyState === 4 &&
      userCanvas
    ) {
      const video = videoReference(userVideo);
      const pose = await net.estimateSinglePose(video);

      if (pose !== null && userCanvas.current !== null) {
        drawCanvas(pose, video, video.width, video.height, userCanvas);

        if (mode === "prepare") {
          if (participantList[0] === socket.id) {
            addPreStartFirstParticipantPose(pose);
          } else {
            addPreStartSecondparticipantPose(pose);
          }
        }
        if (mode === "game") {
          console.log(socket.id, participantUser);
          if (participantUser[0].id === socket.id) {
            addFirstParticipantPose(pose);
          } else {
            addSecondParticipantPose(pose);
          }
        }
      }
    }
  };

  // const { winner } = useGame(
  //   participantUser,
  //   difficulty,
  //   clickCount,
  //   isItLoser,
  //   hasStop,
  //   setHasTouchDownButton,
  //   setClickCount,
  //   setItCount,
  //   setHasTouchDownButton,
  //   setParticipantUser,
  //   itCount
  // );

  // if (winner) {
  //   addWinner(winner);
  //   navigator("/ending");
  // }

  return (
    <DefaultPage>
      <Description>
        {participantUser && (
          <DescriptionContent
            participantUser={participantUser}
            // isReadySingleMode={isReadySingleMode}
            // isSingleMode={isSingleMode}
          />
        )}
      </Description>
      <UserView>
        <UserCamera>
          {participantUser && (
            <UserVideoRoom
              itUser={itUser}
              itCount={itCount}
              participantUser={participantUser}
              userVideo={userVideo}
              userCanvas={userCanvas}
              peers={peers}
              peersRef={peersRef}
              participantList={participantList}
            />
          )}
          <Event
            participantUser={participantUser}
            touchDown={mode === "preapre" ? null : hasTouchDownButton}
            wildCard={mode === "preapre" ? null : setIsItLoser}
            handleLoser={mode === "preapre" ? null : setIsItLoser}
            countDownStart={countDownStart}
            handleCountDownStart={setCountDownStart}
          />
        </UserCamera>
      </UserView>
      {!fistParticipantPreparation && !secondParticipantPreparation && (
        <DistanceAdjustment handleMode={setMode} />
      )}
      {fistParticipantPreparation && secondParticipantPreparation && (
        <Game
          participantUser={participantUser}
          handleTouchDown={setHasTouchDownButton}
          handleItCount={setItCount}
          handleParticipantUser={setParticipantUser}
          handleStop={setHasStop}
          clickCount={clickCount}
          isItLoser={isItLoser}
          itCount={itCount}
          hasStop={hasStop}
          handleClickCount={setClickCount}
          difficulty={difficulty}
        />
      )}
    </DefaultPage>
  );
}

const Description = styled.div`
  margin-top: 10px;
  text-align: center;
  font-size: 20px;

  .color {
    color: #199816;
  }
`;

const UserView = styled.div`
  .opportunity {
    position: absolute;
  }

  .user {
    position: absolute;
    z-index: 9;
    width: 400px;
    height: 300px;
    object-fit: fill;
    transform: rotateY(180deg);
  }

  .anotherUser {
    height: 220px;
    width: 380px;
    object-fit: fill;
    background-color: aliceblue;
    justify-items: stretch;
  }

  .it {
    text-align: center;
  }

  .me {
    color: #f47676;
    font-size: 30px;
  }

  .stop {
    margin-top: 60px;
  }

  .countDown {
    z-index: 300;
    position: absolute;
    place-self: center;
    font-size: 400px;
    color: red;
  }
`;

const UserCamera = styled.div`
  display: grid;
  grid-template-columns: 500px 300px;
  grid-template-rows: 430px 250px;
  column-gap: 110px;
  margin-top: 50px;
  margin-left: 60px;

  .userRole {
    position: absolute;
  }

  .userVideo {
    position: absolute;
    width: 500px;
    height: 350px;
    align-items: center;
    object-fit: fill;
  }

  .userOpportunity {
    align-self: end;
    text-align: center;
  }

  .me {
    color: #f47676;
  }
`;

export default View;
