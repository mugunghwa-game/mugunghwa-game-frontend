import * as posenet from "@tensorflow-models/posenet";
import React, { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import styled from "styled-components";

import { SOCKET } from "../constants/constants";
import useCamera from "../hooks/useCamera";
import useStore from "../store/store";
import { drawCanvas, videoReference } from "../utils/posenet";
import { socket, socketApi } from "../utils/socket";
import DefaultPage from "./DefaultPage";
import DistanceAdjustment from "./DistanceAdjustment";
import DescriptionContent from "./DscriptionContent";
import Event from "./Event";
import Game from "./Game";
import It from "./It";
import Video from "./Video";
import VideoRoom from "./VideoRoom";

function View() {
  const [itUser, setItUser] = useState(null);
  const [isItLoser, setIsItLoser] = useState(false);
  const [hasStop, setHasStop] = useState(false);
  const [countDownStart, setCountDownStart] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const userCanvas = useRef();

  const {
    addPreStartFirstParticipantPose,
    addPreStartSecondparticipantPose,
    addFirstParticipantPose,
    addSecondParticipantPose,
    fistParticipantPreparation,
    secondParticipantPreparation,
    participantList,
    it,
  } = useStore();
  const [hasTouchDownButton, setHasTouchDownButton] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [itCount, setItCount] = useState(5);
  const [participantUser, setParticipantUser] = useState(null);
  const [mode, setMode] = useState("prepare");
  const { peers, userVideo } = useCamera();

  const runPosenet = async () => {
    const net = await posenet.load({
      inputResolution: { width: 640, height: 480 },
      scale: 0.8,
    });

    if (mode === "game") {
      const temp = setInterval(() => {
        detect(net);
      }, 1000);
      console.log("im here");
      setTimeout(() => {
        clearInterval(temp),
          setClickCount((prev) => prev + 1),
          console.log("done");
      }, 3000);
    }

    if (mode === "prepare" && socket.id !== it[0]) {
      const temp = setInterval(() => {
        detect(net);
      }, 3000);

      setTimeout(() => clearInterval(temp) && console.log("done"), 20000);
    }
  };

  useEffect(() => {
    if (mode === "prepare") {
      runPosenet();
    }
    if (mode === "game" && hasStop) {
      runPosenet();
      setCountDownStart(true);
      setHasStop(false);
    }
  }, [hasStop]);

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
          if (participantList[0] === socket.id) {
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
      <Description>
        <DescriptionContent />
      </Description>
      <UserView>
        <UserCamera>
          <Webcam className="userVideo" ref={userVideo} autoPlay playsInline />
          <canvas ref={userCanvas} className="userVideo" />
          {socket.id === it[0] ? (
            <div className="userRole">술래</div>
          ) : (
            <div className="userRole">참가자</div>
          )}
          {/* {socket.id === it[0] && (
            <div className="userOpportunity">기회의 수 {itCount}</div>
          )} */}
          <div className="userOpportunity">기회의 수 {itCount}</div>
          <div>
            {socket.id === it[0] ? (
              <div className="userRole">술래</div>
            ) : (
              <div className="userRole">참가자</div>
            )}
            {peers.map((peer, index) => {
              return <Video key={index} peer={peer} />;
            })}
          </div>
        </UserCamera>
        <It itCount={itCount} handleCount={setItCount} />
        <Event
          peers={peers}
          participantUser={participantUser}
          touchDown={mode === "preapre" ? null : hasTouchDownButton}
          wildCard={mode === "preapre" ? null : setIsItLoser}
          handleLoser={mode === "preapre" ? null : setIsItLoser}
          countDownStart={countDownStart}
          handleCountDownStart={setCountDownStart}
        />
      </UserView>
      {!fistParticipantPreparation &&
        participantUser &&
        !secondParticipantPreparation && (
          <DistanceAdjustment
            participantUser={participantUser}
            handleMode={setMode}
            itUser={it}
          />
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
    font-size: 200px;
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
`;

export default View;
