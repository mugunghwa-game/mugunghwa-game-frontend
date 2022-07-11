export function moveDetection(firstPose, secondPose, difficult, isChild) {
  if (firstPose.score < 0.2 || secondPose.score < 0.2) {
    return true;
  }

  const firstResult = helpDetection(firstPose);
  const secondResult = helpDetection(secondPose);
  const shoulderLength = sholuderLengthinScreen(firstPose);

  console.log(firstResult, secondResult, shoulderLength);
  //가장가까울때, 중간일때, 가장 멀때를 체크해주고 함수를만들어 넘겨줌
  //아이가 아니고 difficulty가 어려움이라면 이거의 1.8배 높게 적용
  //아이일때는 이거 적용

  if (!isChild && difficult === "어려움") {
    if (shoulderLength > 26) {
      console.log("26");
      return compareAngle(firstResult, secondResult, 0.8);
    } else if (5 < shoulderLength <= 26) {
      //중간정도일때
      console.log("5~26");
      return compareAngle(firstResult, secondResult, 4);
    } else if (shoulderLength <= 5) {
      //가장멀때
      console.log("5");
      return compareAngle(firstResult, secondResult, 16);
      //각도 차 20일때 움직임이라고 체크하기
    }
  }

  if (isChild || difficult === "쉬움")
    if ((isChild && shoulderLength > 16) || shoulderLength > 26) {
      console.log("26");
      return compareAngle(firstResult, secondResult, 1);
    } else if (
      (isChild && 3 < shoulderLength <= 16) ||
      5 < shoulderLength <= 26
    ) {
      //중간정도일때
      console.log("5~26");
      return compareAngle(firstResult, secondResult, 7);
    } else if ((isChild && shoulderLength <= 3) || shoulderLength <= 5) {
      //가장멀때
      console.log("5");
      return compareAngle(firstResult, secondResult, 20);
    }
  //두 포즈의 값이 들어왔고 이제 이걸 비교해야함.
  //두 각도의 차가 20이상이면(3m거리일때) 움직임이라고 체크하기
  //중간거리쯤에있을때는 4정도차이나면 움직인거라고하기
}

export function differenceAngle(first, second, distance) {
  if (first && second) {
    const difference = Math.abs(second - first);

    if (distance === 1 && difference > 0.5) {
      return true;
    }
    if (distance !== 1 && difference > distance) {
      return true;
    }
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

  //왼쪽 엉덩이(sholuder), 무릎(elbow) 각도
  //오른쪽 엉덩이, 무릎 각도
  //왼쪽 어깨, 팔꿈치 각도
  //오른쪽 어깨, 팔꿈치 각도
  //오른쪽 왼쪽 눈 각도

  return {
    leftHipKnee: leftHipKnee,
    rightHipKnee: rightHipKnee,
    leftShoulderElbow: leftShoulderElbow,
    rightShoulderElbow: rightShoulderElbow,
    rightleftEye: rightleftEye,
  };
  //각각의 각도를 구해서 왼쪽은 왼쪽끼리
  //오른쪽은 오른쪽끼리
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

  if (shoulderLength >= 8) {
    return true;
  }
}

export function divisionChildAndAdult(video) {
  //왼쪽어깨x-오른쪽 어깨x X 왼쪽어깨y -왼쪽힙
  const leftShoulder = keyword(video, "leftShoulder");
  const rightShoulder = keyword(video, "rightShoulder");
  const leftHip = keyword(video, "leftHip");
  const childStandardBodyWidth = 6000;

  const sholuderLength = sholuderLengthinScreen(video);

  const userBodyWidth =
    Math.abs(leftShoulder.position.x - rightShoulder.position.x) *
    Math.abs(leftShoulder.position.y - leftHip.position.y);

  sholuderLength <= 4 && userBodyWidth < childStandardBodyWidth ? true : false;
}
