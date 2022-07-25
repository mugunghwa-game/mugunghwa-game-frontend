import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";

import useStore from "../store/store";
import { socket, socketApi } from "../utils/socket";
import Button from "./Button";

export default function DifficultyChoice({ modalTitle, handleModal }) {
  const { roomId } = useParams();
  const navigate = useNavigate();

  const {
    addIt,
    addDifficulty,
    addPerson,
    deleteParticipantList,
    participantList,
  } = useStore();

  const handleDifficulty = (event) => {
    participantList.includes(socket.id)
      ? deleteParticipantList(socket.id)
      : null;
    addIt(socket.id);
    addPerson({ person: socket.id, role: "it" });
    addDifficulty(event.target.innerText);

    if (modalTitle === "역할 설정하기") {
      socketApi.createGameRoom(
        socket.id,
        socket.id,
        "it",
        event.target.innerText
      );

      navigate(`/waitingRoom/${socket.id}`);
    } else {
      socketApi.userCount(socket.id, "it", event.target.innerText, roomId);

      handleModal(false);
    }
  };

  return (
    <Difficulty>
      <span className="buttonWarp">
        <span className="easy">
          <Button handleClick={handleDifficulty}>쉬움</Button>
        </span>
        <span className="difficult">
          <Button handleClick={handleDifficulty}>어려움</Button>
        </span>
      </span>
    </Difficulty>
  );
}

const Difficulty = styled.div`
  .buttonWarp {
    width: ${(props) => (props.modalTitle === "역할 설정하기" ? "105%" : null)};
    display: flex;
    justify-content: space-around;
    margin-left: 2vh;
    margin-top: ${(props) =>
      props.modalTitle === "역할 설정하기" ? null : "5vh"};
  }

  .easy {
    margin-right: ${(props) =>
      props.modalTitle === "역할 설정하기" ? "2vh" : null};
  }
`;
