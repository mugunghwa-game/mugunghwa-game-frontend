import { render, screen } from "@testing-library/react";
import React from "react";
import { MemoryRouter } from "react-router-dom";

import NotFound from "./NotFound";

test("1. NotFound 페이지에 '처음으로 돌아가기'버튼과 꽃 이미지, '페이지를 찾지 못했습니다'가 보여져야 한다.", () => {
  render(
    <MemoryRouter>
      <NotFound />
    </MemoryRouter>
  );

  expect(screen.getAllByRole("img", { name: "notfoundflower.png" }));
  expect(screen.getAllByRole("button", { name: "처음으로 돌아가기" }));
  expect(screen.getByText("페이지를 찾지 못했습니다"));
});
