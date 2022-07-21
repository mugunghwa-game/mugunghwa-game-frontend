import React from "react";
import styled from "styled-components";

import useDistanceAdjustment from "../hooks/useDistanceAdjustment";
import useStore from "../store/store";
import { socket } from "../utils/socket";

export default function DistanceAdustment({ handleMode, mode }) {
  const { it } = useStore();

  const { gameMode } = useDistanceAdjustment(mode, handleMode);
  console.log(window.innerWidth);

  return (
    <>
      <Description>
        {it[0] === socket.id ? (
          <>
            <span className="color">
              참가자들이 위치로 갈 때까지 잠시만 기다려주세요
            </span>
          </>
        ) : (
          <span className="color">카메라 앞에서 10 발자국 뒤로 물러서세요</span>
        )}
      </Description>
    </>
  );
}

const Description = styled.div`
  margin-top: 2.5vh;
  text-align: center;
  font-size: 3.7vh;

  .color {
    color: #199816;
  }
`;
