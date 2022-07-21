import { render, screen } from "@testing-library/react";
import React from "react";
import { MemoryRouter } from "react-router-dom";

import DefaultPage from "../components/DefaultPage";

test("1. defaultPage에 children으로 props를 내려주면 그대로 보여져야 한다.", () => {
  render(
    <MemoryRouter>
      <DefaultPage children={<div>hello</div>} />
    </MemoryRouter>
  );

  expect(screen.getByText("hello"));
});
