import React from "react";
import styled from "styled-components";

import Button from "./Button";
import DefaultPage from "./DefaultPage";

function EndingPage() {
  return (
    <DefaultPage>
      <Result>게임 결과</Result>
      <Winner>
        <span className="win">OO</span>의 <span className="win">승리</span>
        입니다
      </Winner>
      <WarpButton>
        <Button>처음으로 돌아가기</Button>
      </WarpButton>
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

const WarpButton = styled.div`
  text-align: center;
  margin-top: 120px;
`;

export default EndingPage;
