import { render, screen } from "@testing-library/react";
import React from "react";
import { act } from "react-dom/test-utils";
import { MemoryRouter } from "react-router-dom";

import Countdown from "./Countdown";

test("1. CountDown이 실행되면 '잠시 후 게임이 시작됩니다'글자가 보여져야 한다.", () => {
  render(
    <MemoryRouter>
      <Countdown />
    </MemoryRouter>
  );

  expect(screen.getByText("잠시 후 게임이 시작됩니다"));
});

test("2. countDown이 실행되면 처음에 꽃 5개가 나타나야 한다.", () => {
  jest.useFakeTimers();

  render(
    <MemoryRouter>
      <Countdown />
    </MemoryRouter>
  );

  act(() => {
    jest.advanceTimersByTime(0);
  });

  expect(screen.getByAltText("flower1.png")).toBeInTheDocument();
  expect(screen.getByAltText("flower2.png")).toBeInTheDocument();
  expect(screen.getByAltText("flower3.png")).toBeInTheDocument();
  expect(screen.getByAltText("flower4.png")).toBeInTheDocument();
  expect(screen.getByAltText("flower5.png")).toBeInTheDocument();
});

test("3. countDown이 실행되고 3초가 흐르면 꽃 이미지가 2개 존재해야한다.", () => {
  jest.useFakeTimers();

  render(
    <MemoryRouter>
      <Countdown />
    </MemoryRouter>
  );

  act(() => {
    jest.advanceTimersByTime(3000);
  });

  expect(screen.getByAltText("flower1.png")).toBeInTheDocument();
  expect(screen.getByAltText("flower2.png")).toBeInTheDocument();
});
