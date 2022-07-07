export function moveDetection(firstPose, secondPose) {
  if (firstPose.score < 0.2 || secondPose.score < 0.2) {
    return true;
  }

  const firstResult = helpDetection(firstPose);
  const secondResult = helpDetection(secondPose);
  const shoulderLength = sholuderLengthinScreen(firstPose);

  if (shoulderLength > 26) {
    const rightShoulderElbowResult = differenceAngle(
      firstResult.rightShoulderElbow,
      secondResult.rightShoulderElbow,
      1
    );
    const leftShoulderElbowResult = differenceAngle(
      firstResult.leftShoulderElbow,
      secondResult.leftShoulderElbow,
      1
    );
    const rightLeftEyeResult = differenceAngle(
      firstResult.rightleftEye,
      secondResult.rightleftEye,
      1
    );
    const leftHipKneeResult = differenceAngle(
      firstResult.leftHipKnee,
      secondResult.leftHipKnee,
      1
    );
    const rightHipKneeResult = differenceAngle(
      firstResult.rightHipKnee,
      secondResult.rightHipKnee,
      1
    );
    if (
      rightShoulderElbowResult ||
      leftShoulderElbowResult ||
      rightLeftEyeResult ||
      leftHipKneeResult ||
      rightHipKneeResult
    ) {
      return true;
    }
  } else if (shoulderLength <= 26 && shoulderLength > 5) {
    const rightShoulderElbowResult = differenceAngle(
      firstResult.rightShoulderElbow,
      secondResult.rightShoulderElbow,
      4
    );
    const leftShoulderElbowResult = differenceAngle(
      firstResult.leftShoulderElbow,
      secondResult.leftShoulderElbow,
      4
    );
    const rightLeftEyeResult = differenceAngle(
      firstResult.rightleftEye,
      secondResult.rightleftEye,
      4
    );
    const leftHipKneeResult = differenceAngle(
      firstResult.leftHipKnee,
      secondResult.leftHipKnee,
      4
    );
    const rightHipKneeResult = differenceAngle(
      firstResult.rightHipKnee,
      secondResult.rightHipKnee,
      4
    );
    if (
      rightShoulderElbowResult ||
      leftShoulderElbowResult ||
      rightLeftEyeResult ||
      leftHipKneeResult ||
      rightHipKneeResult
    ) {
      return true;
    }
  } else if (shoulderLength <= 5) {
    const rightShoulderElbowResult = differenceAngle(
      firstResult.rightShoulderElbow,
      secondResult.rightShoulderElbow,
      20
    );
    const leftShoulderElbowResult = differenceAngle(
      firstResult.leftShoulderElbow,
      secondResult.leftShoulderElbow,
      20
    );
    const rightLeftEyeResult = differenceAngle(
      firstResult.rightleftEye,
      secondResult.rightleftEye,
      20
    );
    const leftHipKneeResult = differenceAngle(
      firstResult.leftHipKnee,
      secondResult.leftHipKnee,
      20
    );
    const rightHipKneeResult = differenceAngle(
      firstResult.rightHipKnee,
      secondResult.rightHipKnee,
      20
    );
    if (
      rightShoulderElbowResult ||
      leftShoulderElbowResult ||
      rightLeftEyeResult ||
      leftHipKneeResult ||
      rightHipKneeResult
    ) {
      return true;
    }
  }
  return false;
}

export function differenceAngle(first, second, distance) {
  if (first && second) {
    const difference = Math.abs(second - first);
    if (difference > distance) {
      return true;
    }
  }
}

export function keyword(poses, keyword) {
  const result = poses.keypoints.find((keypoint) => keypoint.part === keyword);
  return result;
}

export function helpDetection(pose) {
  const rightEye = keyword(pose, "rightEye");
  const leftEye = keyword(pose, "leftEye");
  const leftShoulder = keyword(pose, "leftShoulder");
  const rightShoulder = keyword(pose, "rightShoulder");
  const leftElbow = keyword(pose, "leftElbow");
  const rightElbow = keyword(pose, "rightElbow");
  const leftHip = keyword(pose, "leftHip");
  const rightHip = keyword(pose, "rightHip");
  const leftKnee = keyword(pose, "leftKnee");
  const rightKnee = keyword(pose, "rightKnee");

  let leftHipKnee;
  let rightHipKnee;
  let leftShoulderElbow;
  let rightShoulderElbow;
  let rightleftEye;

  if (
    rightKnee.score > 0.5 &&
    rightHip.score > 0.5 &&
    leftKnee.score > 0.5 &&
    leftHip.score > 0.5
  ) {
    leftHipKnee = getAngle(
      leftHip.position.y,
      leftKnee.position.y,
      leftHip.position.x,
      leftKnee.position.x
    );
    rightHipKnee = getAngle(
      rightHip.position.y,
      rightHip.position.y,
      rightHip.position.x,
      rightKnee.position.x
    );
  }

  if (
    rightShoulder.score > 0.5 &&
    rightElbow.score > 0.5 &&
    leftShoulder.score > 0.5 &&
    leftElbow.score > 0.5
  ) {
    leftShoulderElbow = getAngle(
      leftShoulder.position.y,
      leftElbow.position.y,
      leftShoulder.position.x,
      leftElbow.position.x
    );

    rightShoulderElbow = getAngle(
      rightShoulder.position.y,
      rightElbow.position.y,
      rightShoulder.position.x,
      rightElbow.position.x
    );
  }

  if (rightEye.score > 0.5 && leftEye.score > 0.5) {
    rightleftEye = getAngle(
      rightEye.position.y,
      leftEye.position.y,
      rightEye.position.x,
      leftEye.position.x
    );
  }

  return {
    leftHipKnee: leftHipKnee,
    rightHipKnee: rightHipKnee,
    leftShoulderElbow: leftShoulderElbow,
    rightShoulderElbow: rightShoulderElbow,
    rightleftEye: rightleftEye,
  };
}

export function getAngle(y1, y2, x1, x2) {
  const tan = Math.atan2(y2 - y1, x2 - x1);
  let angle = (tan * 180) / Math.PI;

  if (angle < 0) {
    angle += 2 * Math.PI;
  }

  return angle;
}

export function sholuderLengthinScreen(pose) {
  const leftResult = keyword(pose, "leftShoulder");
  const rightResult = keyword(pose, "rightShoulder");
  const result =
    ((leftResult.position.x - rightResult.position.x) * 100) /
    window.innerWidth;

  return result;
}

export function visibleButton(video) {
  const shoulderLength = sholuderLengthinScreen(video);

  if (shoulderLength >= 18) {
    return true;
  }
}
