import PropTypes from "prop-types";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";

import { GAME } from "../constants/constants";
import useStore from "../store/store";
import { socket, socketApi } from "../utils/socket";
import Button from "./Button";

export default function DifficultyChoice({ modalTitle, handleModal }) {
  const { roomId } = useParams();
  const navigate = useNavigate();

  const { addIt, addDifficulty, deleteParticipantList, participantList } =
    useStore();

  const handleDifficulty = (event) => {
    participantList.includes(socket.id)
      ? deleteParticipantList(socket.id)
      : null;
    addIt(socket.id);
    addDifficulty(event.target.innerText);

    if (modalTitle === GAME.ROLE_CHOICE) {
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
    width: ${(props) =>
      props.modalTitle === GAME.ROLE_CHOICE ? "105%" : null};
    display: flex;
    justify-content: space-around;
    margin-left: 2vh;
    margin-top: ${(props) =>
      props.modalTitle === GAME.ROLE_CHOICE ? null : "5vh"};
  }

  .easy {
    margin-right: ${(props) =>
      props.modalTitle === GAME.ROLE_CHOICE ? "2vh" : null};
  }
`;

DifficultyChoice.propTypes = {
  modalTitle: PropTypes.string,
  handleModal: PropTypes.func,
};
