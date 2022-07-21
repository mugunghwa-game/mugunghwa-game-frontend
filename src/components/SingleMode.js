import * as posenet from "@tensorflow-models/posenet";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Webcam from "react-webcam";
import styled from "styled-components";

import useStore from "../store/store";
import { moveDetection, visibleButton } from "../utils/motionDetection";
import { drawCanvas, videoReference } from "../utils/posenet";
import Button from "./Button";
import DefaultPage from "./DefaultPage";

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

  const handleButton = () => {};
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
      <Description>
        {!isReadySingleMode && (
          <span className="color">카메라 앞에서 10 발자국 뒤로 물러서세요</span>
        )}
        {isReadySingleMode && (
          <div>
            술래가 <span className="color">무궁화 꽃이 피었습니다</span>를
            외치면
            <span className="color"> 3초</span>간 동작을 멈춰야합니다
          </div>
        )}
      </Description>

      <UserCamera>
        <div className="stop">
          <Button handleClick={handleButton}>멈춤</Button>
        </div>
        <Webcam className="userVideo" autoPlay ref={userVideo} />
        <canvas className="userVideo" ref={userCanvas} />
      </UserCamera>
    </DefaultPage>
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

const UserCamera = styled.div`
  .userVideo {
    position: absolute;
    width: 500px;
    height: 500px;
    align-items: center;
    object-fit: fill;
    margin-left: 3rem;
    margin-top: 1rem;
  }

  .stop {
    float: right;
    margin-right: 3rem;
  }
`;

export default SingleMode;
