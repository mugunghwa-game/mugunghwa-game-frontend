import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import { SOCKET } from "../constants/constants";
import useStore from "../store/store";
import { moveDetection, visibleButton } from "../utils/motionDetection";
import { socketApi } from "../utils/socket";
import { socket } from "../utils/socket";
import Button from "./Button";

function Game({
  participantUser,
  handleTouchDown,
  handleItCount,
  handleParticipantUser,
  handleStop,
  clickCount,
  isItLoser,
  itCount,
  hasStop,
  difficulty,
  touchDown,
  wildCard,
  countDownStart,
  handleCountDownStart,
}) {
  const navigate = useNavigate();

  const {
    firstParticipantPose,
    secondParticipantPose,
    isChildFirstParticipant,
    isChildSecondParticipant,
    addWinner,
    winner,
    it,
  } = useStore();

  useEffect(() => {
    if (
      firstParticipantPose.length === 3 &&
      participantUser[0].id === socket.id
    ) {
      const firstParticipantMoved = moveDetection(
        firstParticipantPose[0],
        firstParticipantPose[2],
        difficulty[0],
        isChildFirstParticipant
      );

      const firstResult = visibleButton(firstParticipantPose[0]);

      if (firstResult) {
        handleTouchDown(true);
      }
      console.log("첫번째사람 움직임", firstParticipantMoved, difficulty);
      if (firstParticipantMoved) {
        socketApi.userMoved(socket.id);
      }
    }
    if (
      secondParticipantPose.length === 3 &&
      participantUser[1].id === socket.id
    ) {
      const secondParticipantMoved = moveDetection(
        secondParticipantPose[0],
        secondParticipantPose[2],
        difficulty[0],
        isChildSecondParticipant
      );

      const secondParticipantResult = visibleButton(secondParticipantPose[0]);

      if (secondParticipantResult) {
        handleTouchDown(true);
      }
      if (secondParticipantMoved) {
        socketApi.userMoved(socket.id);
      }
    }
  }, [firstParticipantPose, secondParticipantPose]);

  useEffect(() => {
    socket.on(SOCKET.POSEDETECTION_START, (payload) => {
      if (payload) {
        handleStop(true);
        handleItCount((prev) => prev - 1);
      }
    });

    socket.on(SOCKET.PARTICIPANT_REMAINING_OPPORTUNITY, (payload) => {
      if (payload.count === 6) {
        if (
          payload.participant.filter((person) => person.opportunity === 0)
            .length === 2
        ) {
          addWinner("술래");
        } else {
          addWinner("참가자");
        }
        navigate("/ending");
      }

      handleParticipantUser(payload.participant);
      handleStop(false);
    });

    socket.on(SOCKET.GAME_END, (payload) => {
      if (payload) {
        addWinner("술래");
        navigate("/ending");
      }
    });

    return () => {
      socket.off(SOCKET.PARTICIPANT_REMAINING_OPPORTUNITY);
      socket.off(SOCKET.GAME_END);
      socket.off(SOCKET.POSEDETECTION_START);
    };
  }, [clickCount, hasStop, winner]);

  const [countDown, setCounDown] = useState(3);

  const handleIt = () => {
    wildCard(true);
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

  useEffect(() => {
    if (itCount === 0 && clickCount === 5) {
      socket.on(SOCKET.USER_LOSER, (payload) => {
        addWinner("술래");
        navigate("/ending");
      });
    }

    if (isItLoser) {
      socketApi.itLoser(true);
    }

    socket.on(SOCKET.IT_LOSER_GAME_END, (payload) => {
      if (payload) {
        addWinner("참가자");
        navigate("/ending");
      }
    });

    return () => {
      socket.off(SOCKET.IT_LOSER_GAME_END);
      socket.off(SOCKET.USER_LOSER);
    };
  }, [clickCount, isItLoser]);

  return (
    <>
      <Description>
        {it[0] === socket.id ? (
          <>
            <div>
              <span className="color">무궁화 꽃이 피었습니다</span> 라고 외친 후
              <span className="color"> 멈춤</span> 버튼을 눌러주세요
            </div>
            <div>
              버튼 누른 후 <span className="color"> 3초</span> 동안 참가자들의
              움직임이 감지됩니다
            </div>
          </>
        ) : (
          <div>
            술래가 <span className="color">무궁화 꽃이 피었습니다</span>를
            외치면
            <span className="color"> 3초</span>간 동작을 멈춰야합니다
          </div>
        )}
      </Description>
      <EventZone>
        {touchDown && (
          <Button property="alram" handleClick={handleIt}>
            술래 등 때리기
          </Button>
        )}
        {countDownStart && <div className="countDown">{countDown}</div>}
      </EventZone>
    </>
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

const EventZone = styled.div`
  .countDown {
    z-index: 300;
    position: absolute;
    margin-left: 80vh;
    font-size: 400px;
    color: red;
  }
`;

// Game.propTypes = {
//   touchDown: PropTypes.bool,
//   wildCard: PropTypes.func,
//   handleLoser: PropTypes.func,
//   countDownStart: PropTypes.bool,
//   handleCountDownStart: PropTypes.func,
// };
export default Game;
