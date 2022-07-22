import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createMemoryHistory } from "history";
import React from "react";
import { MemoryRouter } from "react-router-dom";

import Ending from "../components/Ending";

test("1. 엔딩 페이지에 '게임 결과'가 나와야 하며 '처음으로 돌아가기'버튼이 있어야 한다", () => {
  render(
    <MemoryRouter>
      <Ending />
    </MemoryRouter>
  );

  expect(screen.getByText("게임 결과"));
  expect(screen.getByText("처음으로 돌아가기"));
  expect(screen.getByRole("button"));
});

test("2. 처음으로 돌아가기 버튼은 활성화 되어있어야 한다.", () => {
  const { getByText } = render(
    <MemoryRouter>
      <Ending />
    </MemoryRouter>
  );

  expect(getByText(/처음으로 돌아가기/i)).not.toBeDisabled();
});

test("3. 처음으로 돌아가기 버튼을 누르면 첫화면으로 돌아간다.", () => {
  const history = createMemoryHistory();

  render(
    <MemoryRouter>
      <Ending />
    </MemoryRouter>
  );

  userEvent.click(screen.getByText(/처음으로 돌아가기/i));

  expect(history.location.pathname).toEqual("/");
});
