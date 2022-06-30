import React from "react";
import styled from "styled-components";

import DefaultPage from "./DefaultPage";

function Participant() {
  return (
    <DefaultPage>
      <Description>
        <div>
          술래가 무궁화 꽃이 피었습니다를 외치면
          <span className="color">3초</span>간 동작을 멈춰야합니다
        </div>
      </Description>
      <Participants>
        <div className="participants"></div>
        <div className="participants"></div>
      </Participants>
      <It>
        <div className="opportunity">남은기회의 수</div>
        <div className="it"></div>
      </It>
    </DefaultPage>
  );
}
const Participants = styled.div`
  display: grid;
  grid-template-columns: 400px 400px;
  grid-template-rows: 250px;
  column-gap: 40px;
  margin-top: 20px;
  justify-content: center;

  .participants {
    background-color: white;
  }
`;

const Description = styled.div`
  margin-top: 20px;
  text-align: center;
  font-size: 20px;
  .color {
    color: #199816;
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

export default Participant;
