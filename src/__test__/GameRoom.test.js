import { render, screen } from "@testing-library/react";
import React from "react";
import { MemoryRouter } from "react-router-dom";

import GameRoom from "../components/GameRoom";
import navigator from "./__mock__/getMediaMock";

// navigator.mediaDevices.getUserMedia = () => {
//   return new Promise((resolve) => {
//     resolve();
//   });
// };
// navigator.mediaDevices.getUserMedia = () => {
//   return new Promise((resolve) => {
//     resolve();
//   });
// };

test("1. ", () => {
  render(
    <MemoryRouter>
      <GameRoom />
    </MemoryRouter>
  );

  screen.debug();
  navigator.mediaDevices.mockMediaDevices;
  console.log(navigator);
});
