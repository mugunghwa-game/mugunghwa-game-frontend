import { fireEvent, render, screen, wait } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createMemoryHistory } from "history";
import React from "react";
import { MemoryRouter } from "react-router-dom";

import App from "../App";
import Main from "../components/Main";

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

// test("2. 메인페이지에 게임참여하기 버튼을 누르면 waitingRoom으로 이동한다.", async () => {
//   const history = createMemoryHistory();

//   const { getByText } = render(
//     <MemoryRouter history={history}>
//       <App />
//     </MemoryRouter>
//   );

//   fireEvent.click(getByText(/게임참여하기/i));

//   expect(getByText("술래"));
//   expect(getByText("참가자"));
//   expect(getByText("게임시작"));
// });
