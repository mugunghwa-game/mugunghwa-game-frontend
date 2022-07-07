import Peer from "simple-peer";

import { SOCKET } from "../constants/constants";
import { socket } from "./socket";

export function createPeer(userToSignal, callerID, stream) {
  const peer = new Peer({
    initiator: true,
    trickle: false,
    stream,
  });

  peer.on("signal", (signal) => {
    socket.emit(SOCKET.SENDING_SIGNAL, {
      userToSignal,
      callerID,
      signal,
    });
  });

  return peer;
}

export function moveDetection(firstPose, secondPose) {
  if (secondPose.score < 0.2) {
    return true;
  }

  const firstResult = helpDetection(firstPose);
  const secondResult = helpDetection(secondPose);

  console.log("result", firstResult);
  //두 포즈의 값이 들어왔고 이제 이걸 비교해야함.
}

export function helpDetection(pose) {
  const leftShoulder = pose.keypoints.find(
    (keypoint) => keypoint.part === "leftShoulder"
  );
  const rightShoulder = pose.keypoints.find(
    (keypoint) => keypoint.part === "rightShoulder"
  );
  const leftElbow = pose.keypoints.find(
    (keypoint) => keypoint.part === "leftElbow"
  );
  const rightElbow = pose.keypoints.find(
    (keypoint) => keypoint.part === "rightElbow"
  );
  const leftHip = pose.keypoints.find(
    (keypoint) => keypoint.part === "leftHip"
  );
  const rightHip = pose.keypoints.find(
    (keypoint) => keypoint.part === "rightHip"
  );
  const leftKnee = pose.keypoints.find(
    (keypoint) => keypoint.part === "leftKnee"
  );
  const rightKnee = pose.keypoints.find(
    (keypoint) => keypoint.part === "rightKnee"
  );
  const leftAnkle = pose.keypoints.find(
    (keypoint) => keypoint.part === "leftAnkle"
  );
  const rightAnkle = pose.keypoints.find(
    (keypoint) => keypoint.part === "rightAnkle"
  );
  const currentPositions = [
    {
      x: leftShoulder.position.x,
      y: leftShoulder.position.y,
      movementThreshold: 15,
    },
    {
      x: rightShoulder.position.x,
      y: rightShoulder.position.y,
      movementThreshold: 15,
    },
    {
      x: leftElbow.position.x,
      y: leftElbow.position.y,
      movementThreshold: 20,
    },
    {
      x: rightElbow.position.x,
      y: rightElbow.position.y,
      movementThreshold: 20,
    },
    {
      x: leftHip.position.x,
      y: leftHip.position.y,
      movementThreshold: 100,
    },
    {
      x: rightHip.position.x,
      y: rightHip.position.y,
      movementThreshold: 100,
    },
    {
      x: leftKnee.position.x,
      y: leftKnee.position.y,
      movementThreshold: 100,
    },
    {
      x: rightKnee.position.x,
      y: rightKnee.position.y,
      movementThreshold: 100,
    },
    {
      x: leftAnkle.position.x,
      y: leftAnkle.position.y,
      movementThreshold: 100,
    },
    {
      x: rightAnkle.position.x,
      y: rightAnkle.position.y,
      movementThreshold: 100,
    },
  ];
  return currentPositions;
}
