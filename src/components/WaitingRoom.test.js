import { render, screen } from "@testing-library/react";
import React from "react";
import { MemoryRouter } from "react-router-dom";

import WaitingRoom from "./WaitingRoom";

test("1. 게임 대기페이지에는 '나가기', '규칙알아보기'가 있으며, '술래, 참가자'가 있으며 '게임 참여하기'버튼이 존재한다.", () => {
  render(
    <MemoryRouter>
      <WaitingRoom />
    </MemoryRouter>
  );

  screen.getByText("나가기");
  screen.getByText("규칙알아보기");
  screen.getByText("게임참여하기");
  screen.getByText("술래");
  screen.getByText("참가자");
  screen.getByRole("button");
});

test("2. 역할을 아무도 선택하지 않았다면 게임시작 버튼은 비활성화 되어야한다.", () => {
  const { getByText } = render(
    <MemoryRouter>
      <WaitingRoom />
    </MemoryRouter>
  );

  expect(getByText(/게임시작/i)).toBeDisabled();
});
