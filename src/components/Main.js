import React from "react";
import styled from "styled-components";

import main from "../asset/main.gif";
import Button from "./Button";
import DefaultPage from "./DefaultPage";

function Main() {
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
        <a href="/waitingRoom">
          <Button>게임참여하기</Button>
        </a>
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
