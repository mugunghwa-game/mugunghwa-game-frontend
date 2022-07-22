import { render, screen } from "@testing-library/react";
import React from "react";
import { MemoryRouter } from "react-router-dom";

import NotFound from "../components/NotFound";

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

test("2. '처음으로 돌아가기'버튼은 활성화가 되어있어야한다.", () => {
  const { getByText } = render(
    <MemoryRouter>
      <NotFound />
    </MemoryRouter>
  );

  expect(getByText(/처음으로 돌아가기/i)).not.toBeDisabled();
});
