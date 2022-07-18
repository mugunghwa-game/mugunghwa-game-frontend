import * as posenet from "@tensorflow-models/posenet";
import React, { useEffect, useRef, useState } from "react";

import useStore from "../store/store";
import { drawCanvas, videoReference } from "../utils/posenet";
import { socket } from "../utils/socket";

export default function usePosenet(
  mode,
  setClickCount,
  hasStop,
  itUser,
  isRedadyPoseDetection,
  userVideo,
  userCanvas,
  participantUser
) {
  const {
    addPreStartFirstParticipantPose,
    addPreStartSecondparticipantPose,
    addFirstParticipantPose,
    addSecondParticipantPose,
  } = useStore();

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
          if (participantUser[0].id === socket.id) {
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
  return { hasStop };
}
