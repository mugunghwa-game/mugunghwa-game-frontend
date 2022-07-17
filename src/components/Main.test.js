import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { MemoryRouter } from "react-router-dom";

import Main from "./Main";

test("1. 메인페이지에 '게임참여하기'버튼과, gif파일이 보여져야한다.", () => {
  render(
    <MemoryRouter>
      <Main />
    </MemoryRouter>
  );

  expect(screen.getAllByRole("button", { name: "게임참여하기" }));
  expect(screen.getAllByRole("img", { name: "main.gif" }));
  expect(screen.getByText("꽃"));
});

test("2. 게임참여하기 버튼을 누르면 게임모드 선택 페이지로 넘어간다.", async () => {
  render(
    <MemoryRouter>
      <Main />
    </MemoryRouter>
  );

  const button = screen.getByRole("button");

  fireEvent.click(button);

  //   await waitFor(() => expect(location.pathname).toBe("/ready"));
});
