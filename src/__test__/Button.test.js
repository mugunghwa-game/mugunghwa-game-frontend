import { render, screen } from "@testing-library/react";
import React from "react";
import { MemoryRouter } from "react-router-dom";

import Button from "../components/Button";

describe("Button component", () => {
  it("1. childrend으로 '멈춤'을 props로 넘겨주면 '멈춤'이라는 글자가 버튼에 나타나야한다.", () => {
    render(
      <MemoryRouter>
        <Button children="멈춤" />
      </MemoryRouter>
    );

    screen.getAllByRole("button");
    screen.getByText("멈춤");
  });

  it("2. '술래 등때리기'버튼의 background-color는 #f47676, font-size가 6vh여야 한다.", () => {
    const { container } = render(
      <MemoryRouter>
        <Button property="alram" />
      </MemoryRouter>
    );

    expect(container.firstChild).toHaveStyle("background-color: #f47676");
    expect(container.firstChild).toHaveStyle("font-size: 6vh");
  });
});
