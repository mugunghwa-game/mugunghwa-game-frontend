import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import main from "../asset/main.gif";
import useStore from "../store/store";
import Button from "./Button";
import DefaultPage from "./DefaultPage";

function Main() {
  const navigate = useNavigate();

  const {
    resetPreparation,
    firstParticipantPreparation,
    secondParticipantPreparation,
  } = useStore();

  console.log(firstParticipantPreparation, secondParticipantPreparation);
  useEffect(() => {
    resetPreparation();
  }, []);

  const handleGowaitingRoom = () => {
    navigate("/gameMode");
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
        <img src={main} alt={main} />
      </Sentence>
      <WrapButton>
        <Button handleClick={handleGowaitingRoom}>게임참여하기</Button>
      </WrapButton>
    </DefaultPage>
  );
}

const Sentence = styled.div`
  text-align: left;
  font-size: 10vh;
  margin-left: 13vh;
  margin-top: 2vh;

  .flower {
    color: #f47676;
  }

  p {
    position: absolute;
    margin-top: 70px;
  }

  img {
    position: relative;
    width: 72vh;
    float: right;
    margin-right: 14vh;
  }
`;

const WrapButton = styled.div`
  position: absolute;
  bottom: 8vh;
  margin-left: 50vh;
`;

export default Main;
