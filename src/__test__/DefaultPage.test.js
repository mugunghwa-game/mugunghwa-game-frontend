import { render, screen } from "@testing-library/react";
import React from "react";
import { MemoryRouter } from "react-router-dom";

import DefaultPage from "../components/DefaultPage";

describe("DefaultPage component", () => {
  beforeEach(() => {
    render(
      <MemoryRouter>
        <DefaultPage children={<div>hello</div>} />
      </MemoryRouter>
    );
  });

  it("1. defaultPage에 children으로 props를 내려주면 그대로 보여져야 한다.", () => {
    expect(screen.getByText("hello"));
  });

  it("2. defaultPage는 배경화면 색깔 '#fdf3ef', position은 'absolute'로 설정 되어있어야한다.", () => {
    const { container } = render(
      <MemoryRouter>
        <DefaultPage />
      </MemoryRouter>
    );

    expect(container.style.backgroundColor.match("#fdf3ef"));
    expect(container.style.position.match("absolute"));
  });
});
