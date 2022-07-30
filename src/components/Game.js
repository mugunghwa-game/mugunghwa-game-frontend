import PropTypes from "prop-types";
import React from "react";
import styled from "styled-components";

import useGame from "../hooks/useGame";
import useStore from "../store/store";
import { socket } from "../utils/socket";
import Button from "./Button";

function Game({
  participantUser,
  handleItCount,
  handleParticipantUser,
  handleStop,
  difficulty,
  countDownStart,
  handleCountDownStart,
}) {
  const { hasTouchDownButton, countdownStart, countDown, setIsItLoser } =
    useGame(
      participantUser,
      handleItCount,
      handleParticipantUser,
      handleStop,
      difficulty,
      countDownStart,
      handleCountDownStart
    );

  const { it } = useStore();

  const handleIt = () => {
    setIsItLoser(true);
  };

  return (
    <>
      <Description>
        {it[0] === socket.id ? (
          <>
            <div>
              <span className="highlight">무궁화 꽃이 피었습니다</span> 라고
              외친 후<span className="highlight"> 멈춤</span> 버튼을 눌러주세요
            </div>
            <div>
              버튼 누른 후 <span className="highlight"> 3초</span> 동안
              참가자들의 움직임이 감지됩니다
            </div>
          </>
        ) : (
          <div>
            술래가 <span className="highlight">무궁화 꽃이 피었습니다</span>를
            외치면
            <span className="highlight"> 3초</span>간 동작을 멈춰야합니다
          </div>
        )}
      </Description>
      <EventZone>
        {hasTouchDownButton && (
          <Button property="alram" handleClick={handleIt}>
            등 때리기
          </Button>
        )}
        {countdownStart && <div className="countDown">{countDown}</div>}
      </EventZone>
    </>
  );
}

const Description = styled.div`
  margin-top: 2.5vh;
  text-align: center;
  font-size: 3.7vh;

  .highlight {
    color: #199816;
  }
`;

const EventZone = styled.div`
  .countDown {
    position: absolute;
    margin-left: 80vh;
    z-index: 300;
    color: red;
    font-size: 400px;
  }
`;

Game.propTypes = {
  participantUser: PropTypes.array,
  handleItCount: PropTypes.func,
  handleParticipantUser: PropTypes.func,
  handleStop: PropTypes.func,
  difficulty: PropTypes.array,
  countDownStart: PropTypes.bool,
  handleCountDownStart: PropTypes.func,
};

export default Game;
