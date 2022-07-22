import { render, screen } from "@testing-library/react";
import React from "react";
import { MemoryRouter } from "react-router-dom";

import DistanceAdjustment from "../components/DistanceAdjustment";

test("1. 준비모드일 때, 적절한 문구가 화면에 나타나야 한다.", () => {
  render(
    <MemoryRouter>
      <DistanceAdjustment mode="prepare" />
    </MemoryRouter>
  );

  expect(screen.getByText("참가자들이 위치로 갈 때까지 잠시만 기다려주세요"));
});
