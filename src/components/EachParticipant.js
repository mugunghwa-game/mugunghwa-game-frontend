import React, { useEffect, useState } from "react";
import Webcam from "react-webcam";

import useStore from "../store/store";
import { socket } from "../utils/socket";
import Button from "./Button";

function EachParticipant({
  peers,
  participantUser,
  firstParticipantRef,
  secondParticipantRef,
  firstCanvas,
  secondCanvas,
  touchDown,
  wildCard,
  handleLoser,
  countDownStart,
  handleCountDownStart,
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
      {peers.map((peer, index) => (
        <span key={index}>
          {participantUser[index].id && (
            <span>
              {participantUser[index].id === socket.id ? (
                <span>
                  <span className="me">나 </span>
                  참가자
                </span>
              ) : (
                <span>참가자</span>
              )}
              {fistParticipantPreparation && secondParticipantPreparation ? (
                <span className="opportunity">
                  남은 기회의 수
                  <span className="count">
                    {participantUser[index].opportunity}
                  </span>
                </span>
              ) : null}
              <>
                <div className="participant">
                  <Webcam
                    className="one"
                    key={index}
                    peer={peer}
                    ref={
                      index === 0 ? firstParticipantRef : secondParticipantRef
                    }
                  />
                  <canvas
                    ref={index === 0 ? firstCanvas : secondCanvas}
                    className="one"
                  />
                </div>
              </>
            </span>
          )}
        </span>
      ))}
    </>
  );
}

export default EachParticipant;
