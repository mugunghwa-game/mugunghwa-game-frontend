import React from "react";
import styled from "styled-components";

import Button from "./Button";
import DefaultPage from "./DefaultPage";

function ItPage() {
  return (
    <DefaultPage>
      <Description>
        <div>
          <span className="color">무궁화 꽃이 피었습니다</span> 라고 외친 후
          <span className="color"> 멈춤</span> 버튼을 눌러주세요
        </div>
        <div>
          버튼 누른 후 <span className="color"> 3초</span> 동안 다른 참가자들의
          움직임이 감지됩니다
        </div>
      </Description>
      <Participant>
        <div className="participants"></div>
        <div className="participants"></div>
      </Participant>
      <It>
        <div className="opportunity">남은기회의 수</div>
        <div className="it"></div>
        <div className="stop">
          <Button property="stop">멈춤</Button>
        </div>
      </It>
    </DefaultPage>
  );
}

const Description = styled.div`
  margin-top: 20px;
  text-align: center;
  font-size: 20px;
  .color {
    color: #199816;
  }
`;

const Participant = styled.div`
  display: grid;
  grid-template-columns: 400px 400px;
  grid-template-rows: 250px;
  column-gap: 40px;
  margin-top: 10px;
  justify-content: center;

  .participants {
    background-color: white;
  }
`;

const It = styled.div`
  margin-top: 10px;
  display: grid;
  grid-template-columns: 260px 260px 260px;
  grid-template-rows: 180px;
  justify-content: center;
  column-gap: 40px;

  .opportunity {
    align-self: center;
    text-align: -webkit-center;
  }

  .it {
    background-color: white;
  }

  .stop {
    align-self: center;
  }
`;

export default ItPage;
