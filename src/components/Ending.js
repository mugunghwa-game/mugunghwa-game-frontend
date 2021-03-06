import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import useStore from "../store/store";
import Button from "./Button";
import DefaultPage from "./DefaultPage";

function Ending() {
  const navigate = useNavigate();

  const { removeAll, winner } = useStore();

  useEffect(() => {
    removeAll();

    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => stream.getTracks().forEach((track) => track.stop()))
      .catch((err) => console.log(err));
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
  font-size: 10vh;
  text-align: center;
`;

const Winner = styled.div`
  margin-top: 13vh;
  font-size: 7vh;
  text-align: center;

  .win {
    color: #f47676;
  }
`;

const ButtonWarp = styled.div`
  margin-top: 15vh;
  text-align: center;
`;

export default Ending;
