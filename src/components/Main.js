import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import main from "../asset/main.gif";
import { socket } from "../utils/socket";
import Button from "./Button";
import DefaultPage from "./DefaultPage";

function Main() {
  const navigate = useNavigate();

  const handleGowaitingRoom = () => {
    navigate("/waitingRoom");
  };

  return (
    <DefaultPage>
      <Sentence>
        <p>
          무궁화
          <span className="flower">
            <br /> 꽃
          </span>
          이
          <br /> 피었습니다
        </p>
        <img src={main} alt={main} loop="infinite" />
      </Sentence>
      <WrapButton>
        <Button handleClick={handleGowaitingRoom}>게임참여하기</Button>
      </WrapButton>
    </DefaultPage>
  );
}

const Sentence = styled.div`
  text-align: left;
  font-size: 65px;
  margin-left: 150px;

  .flower {
    color: #f47676;
  }

  p {
    position: absolute;
    margin-top: 70px;
  }

  img {
    position: relative;
    width: 570px;
    float: right;
    margin-right: 100px;
  }
`;

const WrapButton = styled.div`
  position: absolute;
  bottom: 60px;
  margin-left: 150px;
`;

export default Main;
