import * as posenet from "@tensorflow-models/posenet";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Webcam from "react-webcam";
import styled from "styled-components";

import useStore from "../store/store";
import { moveDetection, visibleButton } from "../utils/motionDetection";
import { drawCanvas, videoReference } from "../utils/posenet";
import DefaultPage from "./DefaultPage";
import DistanceAdjustment from "./DistanceAdjustment";
import DescriptionContent from "./DscriptionContent";
import Event from "./Event";

function SingleMode() {
  const navigate = useNavigate();
  const { addSingleModeUserPose, singleModeUserPose, addWinner } = useStore();
  const userVideo = useRef();
  const userCanvas = useRef();
  const [countDownStart, setCountDownStart] = useState(false);
  const [isSingleMode, setSingMode] = useState(true);
  const [isReadySingleMode, setIsReadySingleMode] = useState(false);
  const [userOpportunity, setUserOpportunity] = useState(3);
  const [gameMode, setGameMode] = useState(false);
  const difficulty = "쉬움";
  const [touchDown, setTouchDown] = useState(false);
  const [isItLoser, setIsItLoser] = useState(false);
  const [hasStop, setHasStop] = useState(false);

  if (isReadySingleMode) {
    setGameMode(true);
    setIsReadySingleMode(false);
  }

  if (isItLoser) {
    addWinner("참가자");
    navigate("/ending");
  }

  const runPosenet = async () => {
    const net = await posenet.load({
      inputResolution: { width: 640, height: 480 },
      scale: 0.8,
    });

    if (!isReadySingleMode) {
      const temp = setInterval(() => {
        detect(net);
      }, 1000);

      setTimeout(() => {
        clearInterval(temp), console.log("done");
      }, 20000);
    }
    if (isReadySingleMode && hasStop) {
      const temp = setInterval(() => {
        detect(net);
      }, 1000);

      setTimeout(() => {
        clearInterval(temp), console.log("done");
      }, 20000);
    }
  };

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

        addSingleModeUserPose(pose);
      }
    }
  };

  useEffect(() => {
    runPosenet();
  }, []);

  useEffect(() => {
    if (singleModeUserPose.length === 3 && hasStop) {
      const moved = moveDetection(
        singleModeUserPose[0],
        singleModeUserPose[2],
        difficulty
      );

      const result = visibleButton(singleModeUserPose[0]);

      if (moved) {
        setUserOpportunity((prev) => prev - 1);
        if (userOpportunity === 0) {
          addWinner("술래");
          navigate("/ending");
        }
      }
      if (result) {
        setTouchDown(true);
      }
    }
  }, [singleModeUserPose]);

  return (
    <DefaultPage>
      <DescriptionContent
        isSingleMode={isSingleMode}
        isReadySingleMode={isReadySingleMode}
      />
      <UserCamera>
        <Webcam className="userVideo" autoPlay ref={userVideo} />
        <canvas className="userVideo" ref={userCanvas} />
      </UserCamera>
      {!isReadySingleMode && (
        <DistanceAdjustment handleSingleMode={setIsReadySingleMode} />
      )}
      {isReadySingleMode && (
        <Event
          touchDown={touchDown}
          handleCountDownStart={setCountDownStart}
          handleLoser={setIsItLoser}
        />
      )}
    </DefaultPage>
  );
}

const UserCamera = styled.div`
  .userVideo {
    position: absolute;
    width: 500px;
    height: 500px;
    align-items: center;
    object-fit: fill;
  }
`;

export default SingleMode;
