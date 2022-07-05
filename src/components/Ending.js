import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import useStore from "../store/store";
import Button from "./Button";
import DefaultPage from "./DefaultPage";

function Ending() {
  const navigate = useNavigate();
  const winner = useStore((state) => state.winner);

  const goHome = () => {
    navigate("/");
  };

  return (
    <DefaultPage>
      <Result>게임 결과</Result>
      <Winner>
        <span className="win">{winner}</span>의<span className="win">승리</span>
        입니다
      </Winner>
      <ButtonWarp>
        <Button handleClick={goHome}>처음으로 돌아가기</Button>
      </ButtonWarp>
    </DefaultPage>
  );
}

const Result = styled.div`
  font-size: 70px;
  text-align: center;
  margin-top: 40px;
`;

const Winner = styled.div`
  font-size: 45px;
  text-align: center;
  margin-top: 100px;

  .win {
    color: #f47676;
  }
`;

const ButtonWarp = styled.div`
  text-align: center;
  margin-top: 80px;
`;

export default Ending;
