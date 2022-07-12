import React, { useEffect, useRef, useState } from "react";

import Button from "./Button";

function Event({
  participantUser,
  touchDown,
  wildCard,
  handleLoser,
  countDownStart,
  handleCountDownStart,
}) {
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
    </>
  );
}

export default Event;