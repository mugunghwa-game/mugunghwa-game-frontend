import { partChannels } from "@tensorflow-models/posenet";
import React, { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";

import useStore from "../store/store";
import { socket } from "../utils/socket";
import Button from "./Button";

function EachParticipant({
  participantUser,
  touchDown,
  wildCard,
  handleLoser,
  countDownStart,
  handleCountDownStart,
  userVideo,
  // Video,
  userCanvas,
}) {
  const { fistParticipantPreparation, secondParticipantPreparation } =
    useStore();
  const [countDown, setCounDown] = useState(3);

  const handleIt = () => {
    wildCard(true);
    handleLoser(true);
  };
  useEffect(() => {
    let interval;
    if (countDownStart) {
      if (countDown > 1) {
        interval = setInterval(() => {
          setCounDown((prev) => prev - 1);
        }, 1000);
      }
    }

    setTimeout(() => {
      clearInterval(interval);
      setCounDown(3);
      handleCountDownStart(false);
    }, 3000);
  }, [countDownStart]);

  return (
    <>
      {touchDown && (
        <Button property="alram" handleClick={handleIt}>
          술래 등 때리기
        </Button>
      )}
      {countDownStart && <div className="countDown">{countDown}</div>}
      <span>
        {participantUser && participantUser[0] && (
          <span>
            {participantUser[0].id === socket.id ||
            participantUser[1].id === socket.id ? (
              <div>
                참가자
                <span>나 </span>
              </div>
            ) : (
              <div>참가자</div>
            )}
            {fistParticipantPreparation &&
              secondParticipantPreparation &&
              participantUser.map((item, index) => (
                <span>
                  {index}남은 기회의 수 {participantUser[index].opportunity}
                </span>
              ))}
            <></>
          </span>
        )}
      </span>
      {touchDown && <Button handleClick={handleIt}>술래 등 때리기</Button>}
    </>
  );
}

export default EachParticipant;
