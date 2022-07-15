import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import DefaultPage from "./DefaultPage";

function GameMode() {
  const navigate = useNavigate();

  const handleExitButton = () => {
    navigate("/");
  };

  const handleSingleModeButton = () => {
    navigate("/singleGame");
  };

  const handleMultiModeButton = () => {
    navigate("/waitingRoom");
  };

  return (
    <DefaultPage>
      <Mode>
        <div className="exit" onClick={handleExitButton}>
          나가기
        </div>
        <div className="participation">게임 모드 선택</div>
        <div className="choice" onClick={handleSingleModeButton}>
          혼자 해보기
        </div>
        <div className="choice" onClick={handleMultiModeButton}>
          같이 해보기
        </div>
      </Mode>
    </DefaultPage>
  );
}

const Mode = styled.div`
  .exit {
    font-size: 20px;
    cursor: pointer;
  }

  .rule {
    margin-top: 20px;
    margin-right: 60px;
    text-align: right;
    font-size: 20px;
    cursor: pointer;
  }

  .participation {
    font-size: 40px;
    text-align: center;
  }

  .choice {
    width: 80%;
    height: 80px;
    margin-top: 100px;
    margin-inline: auto;
    border-radius: 20px;
    font-size: 30px;
    background-color: #fdf3ef;
    text-align: center;

    cursor: pointer;

    :hover {
      background-color: #ffe9e0;
      transform: translateY(-3px);
    }

    :active {
      transform: translateY(3px);
    }
  }
`;

export default GameMode;
