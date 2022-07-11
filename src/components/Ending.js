import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import { SOCKET } from "../constants/constants";
import useStore from "../store/store";
import { socket } from "../utils/socket";
import Button from "./Button";
import DefaultPage from "./DefaultPage";

function Ending() {
  const navigate = useNavigate();
  const { removeAll, winner } = useStore();

  useEffect(() => {
    socket.emit(SOCKET.INFO_INITIALIZATION, true);
    removeAll();
  }, []);

  const goHome = () => {
    navigate("/");
  };

  return (
    <DefaultPage>
      <Result>게임 결과</Result>
      <Winner>
        <span className="win">{winner}</span>의
        <span className="win"> 승리</span>
        입니다
      </Winner>
      <ButtonWarp>
        <Button handleClick={goHome}>처음으로 돌아가기</Button>
      </ButtonWarp>
    </DefaultPage>
  );
}

const Result = styled.div`
  margin-top: 40px;
  font-size: 70px;
  text-align: center;
`;

const Winner = styled.div`
  margin-top: 100px;
  font-size: 45px;
  text-align: center;

  .win {
    color: #f47676;
  }
`;

const ButtonWarp = styled.div`
  margin-top: 80px;
  text-align: center;
`;

export default Ending;
