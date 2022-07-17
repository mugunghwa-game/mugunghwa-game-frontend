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
