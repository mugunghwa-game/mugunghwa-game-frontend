import * as posenet from "@tensorflow-models/posenet";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Webcam from "react-webcam";
import styled from "styled-components";

import bgm from "../asset/bgm.mp3";
import useStore from "../store/store";
import {
  moveDetection,
  sholuderLengthinScreen,
  visibleButton,
} from "../utils/motionDetection";
import { drawCanvas, videoReference } from "../utils/posenet";
import Button from "./Button";
import DefaultPage from "./DefaultPage";

function SingleMode() {
  const {
    addSingleModeUserPose,
    singleModeUserPose,
    addWinner,
    difficulty,
    singleModeUserGamePoese,
    addSingleModeUserGamePose,
  } = useStore();

  const navigate = useNavigate();

  const userVideo = useRef();
  const userCanvas = useRef();
  const [countDownStart, setCountDownStart] = useState(false);
  const [countDown, setCountDown] = useState(null);
  const [isReadySingleMode, setIsReadySingleMode] = useState(false);
  const [gameMode, setGameMode] = useState("prepare");
  const [touchDown, setTouchDown] = useState(false);
  const [hasStop, setHasStop] = useState(false);
  const [itCount, setItCount] = useState(5);
  const [participantCount, setParticipantCount] = useState(3);
  const [clickCount, setClickCount] = useState(0);
  const [isButtonClick, setIsButtonClick] = useState(true);
  const audio = new Audio(bgm);

  const handleButton = () => {
    if (isButtonClick) {
      setCountDownStart(true);
      setHasStop(true);
      setItCount((prev) => prev - 1);
      setIsButtonClick(false);
      setCountDown(3);
    }
  };

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

    if (hasStop) {
      const temp = setInterval(() => {
        detect(net);
      }, 990);

      setTimeout(() => {
        clearInterval(temp), console.log("done");
        setHasStop(false);
        setIsButtonClick(true);
      }, 3000);
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
        if (gameMode === "prepare") {
          addSingleModeUserPose(pose);
        }
        if (gameMode === "game") {
          addSingleModeUserGamePose(pose);
        }
      }
    }
  };

  useEffect(() => {
    runPosenet();
    audio.play();
  }, [hasStop]);

  useEffect(() => {
    if (singleModeUserPose.length !== 0) {
      const sholuderLength = sholuderLengthinScreen(singleModeUserPose[0]);

      if (0 < sholuderLength < 2.8 && singleModeUserPose[0].score > 0.8) {
        setIsReadySingleMode(true);
        setGameMode("game");
      }
    }
  }, [singleModeUserPose]);

  useEffect(() => {
    if (singleModeUserGamePoese.length === 3) {
      const moved = moveDetection(
        singleModeUserGamePoese[0],
        singleModeUserGamePoese[2],
        difficulty
      );

      setClickCount((prev) => prev + 1);

      const result = visibleButton(singleModeUserGamePoese[0]);

      if (result) {
        setTouchDown(true);
      }

      if (moved) {
        setParticipantCount((prev) => prev - 1);
      }
    }
  }, [singleModeUserGamePoese]);

  useEffect(() => {
    if (participantCount === 0 && itCount > 0) {
      addWinner("술래");
      navigate("/ending");
    }

    if (clickCount === 5) {
      if (participantCount === 1) {
        addWinner("참가자");
        navigate("/ending");
      } else {
        addWinner("술래");
        navigate("/ending");
      }
    }
  }, [itCount, participantCount, clickCount]);

  const handleIt = () => {
    addWinner("참가자");
    navigate("/ending");
  };

  useEffect(() => {
    let interval;

    if (countDownStart) {
      if (countDown === 0) {
        setCountDown(null);
        setCountDownStart(false);
      }
      if (!countDown) {
        return;
      }

      interval = setInterval(() => {
        setCountDown((prev) => prev - 1);
      }, 1000);
    }

    return () => {
      clearInterval(interval);
    };
  }, [countDownStart, countDown]);

  return (
    <DefaultPage>
      <Description>
        <div>{difficulty} 모드</div>
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
      {isReadySingleMode && touchDown && (
        <Button property="alram" handleClick={handleIt}>
          술래 등때리기
        </Button>
      )}
      <CountDown>
        {countDownStart && <div className="countDown">{countDown}</div>}
      </CountDown>
      <UserCamera>
        <div className="video">
          <Webcam className="userVideo" autoPlay ref={userVideo} />
          <canvas className="userVideo" ref={userCanvas} />
        </div>
        {isReadySingleMode && (
          <div className="stop">
            <div className="participantCount">
              참가자 기회의 수 {participantCount}
            </div>
            <Button handleClick={handleButton}>멈춤</Button>
            <div className="itCount">술래 기회의 수 {itCount}</div>
          </div>
        )}
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

const CountDown = styled.div`
  .countDown {
    z-index: 300;
    position: absolute;
    font-size: 30vh;
    color: red;
    margin-left: 80vh;
  }
`;

const UserCamera = styled.div`
  display: grid;
  grid-template-columns: 70vh 60vh;
  grid-template-rows: 80vh 80vh;
  justify-content: center;
  margin-top: 2vh;

  .userVideo {
    position: absolute;
    width: 50vh;
    height: 65vh;
    align-items: center;
    object-fit: fill;
    margin-left: 3rem;
    margin-top: 1rem;
  }

  .stop {
    text-align: center;
    align-self: center;
  }

  .itCount,
  .participantCount {
    font-size: 3vh;
    margin-top: 3vh;
  }

  .participantCount {
    margin-bottom: 10vh;
  }
`;

export default SingleMode;
