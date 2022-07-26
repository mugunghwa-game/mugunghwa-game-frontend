import * as posenet from "@tensorflow-models/posenet";
import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";

import bgm from "../asset/bgm.mp3";
import useVideo from "../hooks/useVideo";
import useStore from "../store/store";
import { drawCanvas, videoReference } from "../utils/posenet";
import { socket } from "../utils/socket";
import DefaultPage from "./DefaultPage";
import DistanceAdjustment from "./DistanceAdjustment";
import Game from "./Game";
import UserVideoRoom from "./UserVideoRoom";

function GameRoom() {
  const { roomId } = useParams();

  const [hasStop, setHasStop] = useState(false);
  const [countDownStart, setCountDownStart] = useState(false);
  const [itCount, setItCount] = useState(5);
  const [mode, setMode] = useState("prepare");
  const userCanvas = useRef();
  const audio = new Audio(bgm);

  const {
    addPreStartFirstParticipantPose,
    addPreStartSecondparticipantPose,
    addFirstParticipantPose,
    addSecondParticipantPose,
    firstParticipantPreparation,
    secondParticipantPreparation,
  } = useStore();

  const {
    userVideo,
    participantUser,
    itUser,
    difficulty,
    isRedadyPoseDetection,
    peers,
    peersRef,
    setParticipantUser,
  } = useVideo(roomId);

  useEffect(() => {
    audio.play();

    return () => {
      audio.pause();
    };
  }, []);

  const runPosenet = async () => {
    const net = await posenet.load({
      inputResolution: { width: 640, height: 480 },
      scale: 0.8,
    });

    if (mode === "game" && hasStop) {
      const detection = setInterval(() => {
        if (socket.id !== itUser[0]) {
          detect(net);
        }
      }, 1000);

      setTimeout(() => {
        clearInterval(detection), console.log("done");
      }, 3000);
    }

    if (mode === "prepare" && itUser[0] !== socket.id) {
      const detection = setInterval(() => {
        detect(net);
      }, 3000);

      setTimeout(() => clearInterval(detection) && console.log("done"), 20000);
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
          if (participantUser[0].id === socket.id) {
            addPreStartFirstParticipantPose(pose);
          } else {
            addPreStartSecondparticipantPose(pose);
          }
        }

        if (mode === "game") {
          if (participantUser[0].id === socket.id) {
            addFirstParticipantPose(pose);
          } else {
            addSecondParticipantPose(pose);
          }
        }
      }
    }
  };

  return (
    <DefaultPage>
      {!firstParticipantPreparation && !secondParticipantPreparation && (
        <DistanceAdjustment
          mode={mode}
          handleMode={setMode}
          participantUser={participantUser}
        />
      )}
      {firstParticipantPreparation && secondParticipantPreparation && (
        <Game
          participantUser={participantUser}
          handleParticipantUser={setParticipantUser}
          countDownStart={countDownStart}
          handleCountDownStart={setCountDownStart}
          handleItCount={setItCount}
          hasStop={hasStop}
          handleStop={setHasStop}
          difficulty={difficulty}
        />
      )}
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
            />
          )}
        </UserCamera>
      </UserView>
    </DefaultPage>
  );
}

const UserView = styled.div`
  .opportunity {
    position: absolute;
  }

  .user {
    position: absolute;
    z-index: 9;
    width: 10em;
    height: 5em;
    object-fit: fill;
    transform: rotateY(180deg);
  }

  .anotherUser {
    height: 20em;
    width: 20em;
    object-fit: fill;
    justify-items: stretch;
    background-color: aliceblue;
  }

  .it {
    text-align: center;
  }

  .me {
    color: #f47676;
    font-size: 3vh;
  }

  .stop {
    margin-top: 60px;
  }
`;

const UserCamera = styled.div`
  display: grid;
  grid-template-columns: 70vh 70vh;
  grid-template-rows: 32vh 32vh;
  column-gap: 110px;
  margin-top: 5vh;
  justify-content: center;
  font-size: 3vh;

  .userVideo {
    position: absolute;
    width: 65vh;
    height: 45vh;
    margin-left: 5vh;
    object-fit: fill;
  }

  .userRole {
    position: absolute;
    margin-left: 17vh;
    font-size: 3vh;
  }

  .userOpportunity {
    margin-top: 42vh;
    align-self: end;
    text-align: center;
    font-size: 2em;
  }

  .me {
    color: #f47676;
    vertical-align: center;
  }
`;

export default GameRoom;
