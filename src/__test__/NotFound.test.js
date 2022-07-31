import { render, screen } from "@testing-library/react";
import React from "react";
import { MemoryRouter } from "react-router-dom";

import NotFound from "../components/NotFound";

describe("NotFound component", () => {
  beforeEach(() => {
    render(
      <MemoryRouter>
        <NotFound />
      </MemoryRouter>
    );
  });

  it("1. NotFound 페이지에 '처음으로 돌아가기'버튼과 꽃 이미지, '페이지를 찾지 못했습니다'가 보여져야 한다.", () => {
    expect(screen.getAllByRole("img", { name: "notfoundflower.png" }));
    expect(screen.getAllByRole("button", { name: "처음으로 돌아가기" }));
    expect(screen.getByText("페이지를 찾지 못했습니다"));
  });

  it("2. '처음으로 돌아가기'버튼은 활성화가 되어있어야한다.", () => {
    expect(screen.getByText(/처음으로 돌아가기/i)).not.toBeDisabled();
  });
});
