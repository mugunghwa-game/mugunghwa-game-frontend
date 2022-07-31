import { fireEvent, render, screen } from "@testing-library/react";
import { createMemoryHistory } from "history";
import React from "react";
import { MemoryRouter } from "react-router-dom";

import App from "../App";
import Main from "../components/Main";

describe("Main component", () => {
  it("1. 메인페이지에 '게임참여하기'버튼과, gif파일이 보여져야한다.", () => {
    render(
      <MemoryRouter>
        <Main />
      </MemoryRouter>
    );

    expect(screen.getAllByRole("button", { name: "게임참여하기" }));
    expect(screen.getAllByRole("img", { name: "main.gif" }));
    expect(screen.getByText("꽃"));
  });

  it("2. 메인페이지에 게임참여하기 버튼을 누르면 RoomList로 이동한다.", async () => {
    const history = createMemoryHistory();

    const { getByText } = render(
      <MemoryRouter history={history}>
        <App />
      </MemoryRouter>
    );

    fireEvent.click(getByText(/게임참여하기/i));

    expect(getByText("나가기"));
    expect(getByText("방 목록"));
    expect(getByText("방 만들기"));
  });
});
