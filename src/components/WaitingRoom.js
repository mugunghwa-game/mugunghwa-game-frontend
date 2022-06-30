import React from "react";
import styled from "styled-components";

import Button from "./Button";
import DefaultPage from "./DefaultPage";

function WaitingRoom() {
  return (
    <DefaultPage>
      <Content>
        <div className="rule">규칙알아보기</div>
        <div className="participation">게임참여하기</div>
        <div className="it">
          <p className="choice">
            술래 <span className="count">/1명</span>
          </p>
        </div>
        <div className="participant">
          <p className="choice">
            참가자 <span className="count">/2명</span>
          </p>
        </div>
      </Content>
      <ButtonWrap>
        <Button>게임시작</Button>
      </ButtonWrap>
    </DefaultPage>
  );
}

const Content = styled.div`
  .rule {
    margin-top: 20px;
    margin-right: 60px;
    text-align: right;
    font-size: 20px;
  }

  .participation {
    font-size: 40px;
    text-align: center;
  }

  .it,
  .participant {
    background-color: #fdf3ef;
    width: 80%;
    height: 80px;
    font-size: 30px;
    margin-top: 60px;
    margin-inline: auto;
    border-radius: 20px;

    .choice {
      padding-top: 15px;
      margin-left: 20px;
    }
  }

  .count {
    float: right;
    margin-right: 30px;
  }
`;

const ButtonWrap = styled.div`
  margin-top: 40px;
  bottom: 10px;
  text-align: center;
`;

export default WaitingRoom;
