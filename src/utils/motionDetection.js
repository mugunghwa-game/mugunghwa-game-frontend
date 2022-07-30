export function moveDetection(firstPose, secondPose, difficult, isChild) {
  if (firstPose.score < 0.2 || secondPose.score < 0.2) {
    return true;
  }

  const firstResult = helpDetection(firstPose);
  const secondResult = helpDetection(secondPose);
  const shoulderLength = sholuderLengthinScreen(firstPose);

  if (!isChild && difficult === "어려움") {
    if (shoulderLength > 26) {
      return compareAngle(firstResult, secondResult, 0.8);
    } else if (5 < shoulderLength <= 23) {
      return compareAngle(firstResult, secondResult, 4);
    } else if (shoulderLength <= 5) {
      return compareAngle(firstResult, secondResult, 16);
    }
  }
  if (isChild || difficult === "쉬움")
    if ((isChild && shoulderLength > 16) || shoulderLength > 26) {
      return compareAngle(firstResult, secondResult, 1);
    } else if (
      (isChild && 3 < shoulderLength <= 16) ||
      5 < shoulderLength <= 26
    ) {
      return compareAngle(firstResult, secondResult, 7);
    } else if ((isChild && shoulderLength <= 3) || shoulderLength <= 5) {
      return compareAngle(firstResult, secondResult, 20);
    }
}

export function differenceAngle(first, second, distance) {
  if (first && second) {
    const difference = Math.abs(second - first);

    return (
      (distance === 1 && difference > 0.5) ||
      (distance !== 1 && difference > distance)
    );
  }
}

export function compareAngle(firstPoint, secondPoint, degree) {
  if (firstPoint && secondPoint) {
    const rightShoulderElbowResult = differenceAngle(
      firstPoint.rightShoulderElbow,
      secondPoint.rightShoulderElbow,
      degree
    );

    const leftShoulderElbowResult = differenceAngle(
      firstPoint.leftShoulderElbow,
      secondPoint.leftShoulderElbow,
      degree
    );

    const rightLeftEyeResult = differenceAngle(
      firstPoint.rightleftEye,
      secondPoint.rightleftEye,
      degree
    );

    const leftHipKneeResult = differenceAngle(
      firstPoint.leftHipKnee,
      firstPoint.leftHipKnee,
      degree
    );

    const rightHipKneeResult = differenceAngle(
      firstPoint.rightHipKnee,
      firstPoint.rightHipKnee,
      degree
    );

    if (
      rightShoulderElbowResult ||
      leftShoulderElbowResult ||
      rightLeftEyeResult ||
      leftHipKneeResult ||
      rightHipKneeResult
    ) {
      return true;
    } else {
      return false;
    }
  }
}

export function keyword(poses, keyword) {
  return poses.keypoints.find((keypoint) => keypoint.part === keyword);
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

  function help(firstPoint, secondPoint) {
    if (firstPoint.score > 0.5 && secondPoint.score > 0.5) {
      const result = getAngle(
        firstPoint.position.y,
        secondPoint.position.y,
        firstPoint.position.x,
        secondPoint.position.x
      );

      return result;
    }
  }

  const leftHipKnee = help(leftHip, leftKnee);
  const rightHipKnee = help(rightHip, rightKnee);
  const leftShoulderElbow = help(leftShoulder, leftElbow);
  const rightShoulderElbow = help(rightShoulder, rightElbow);
  const rightleftEye = help(rightEye, leftEye);

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

  return (
    (Math.abs(rightResult.position.x - leftResult.position.x) * 100) /
    window.innerWidth
  );
}

export function visibleButton(video) {
  const shoulderLength = sholuderLengthinScreen(video);

  return shoulderLength >= 8;
}

export function divisionChildAndAdult(video) {
  const leftShoulder = keyword(video, "leftShoulder");
  const rightShoulder = keyword(video, "rightShoulder");
  const leftHip = keyword(video, "leftHip");
  const childStandardBodyWidth = 6000;

  const sholuderLength = sholuderLengthinScreen(video);

  const userBodyWidth =
    Math.abs(leftShoulder.position.x - rightShoulder.position.x) *
    Math.abs(leftShoulder.position.y - leftHip.position.y);

  return sholuderLength <= 4 && userBodyWidth < childStandardBodyWidth;
}

export function distanceAdjustment(pose, user, id) {
  if (pose.length !== 0 && user === id) {
    const sholuderLength = sholuderLengthinScreen(pose[0]);

    return 0 < sholuderLength <= 5 && pose[0].score > 0.8;
  }
}
