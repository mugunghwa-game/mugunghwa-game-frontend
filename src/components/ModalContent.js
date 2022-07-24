import PropTypes from "prop-types";
import React, { useState } from "react";
import { MdClose } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";

import flowericon from "../asset/flowericon.jpeg";
import useStore from "../store/store";
import { socket } from "../utils/socket";
import Button from "./Button";

function ModalContent({ modalText, modalTitle, handleModal }) {
  const {
    addIt,
    addDifficulty,
    addPerson,
    deleteParticipantList,
    participantList,
  } = useStore();

  const navigate = useNavigate();
  const { roomId } = useParams();

  const [hasIt, setHasIt] = useState(false);

  const handleClick = () => {
    handleModal(false);
  };

  const handleRole = () => {
    socket.emit("createGame", {
      roomId: socket.id,
      id: socket.id,
      role: "participant",
    });

    navigate(`/waitingRoom/${socket.id}`);
  };

  const handleItRole = () => {
    setHasIt(true);
  };

  const handleDifficulty = (event) => {
    participantList.includes(socket.id)
      ? deleteParticipantList(socket.id)
      : null;
    addIt(socket.id);
    addPerson({ person: socket.id, role: "it" });
    addDifficulty(event.target.innerText);

    if (modalTitle === "역할 설정하기") {
      socket.emit("createGame", {
        roomId: socket.id,
        id: socket.id,
        role: "it",
        difficulty: event.target.innerText,
      });

      navigate(`/waitingRoom/${socket.id}`);
    } else {
      socket.emit("user-count", {
        id: socket.id,
        role: "it",
        difficulty: event.target.innerText,
        roomId: roomId,
      });
      handleModal(false);
    }
  };

  return (
    <Content modalTitle={modalTitle}>
      <h3>
        <MdClose onClick={handleClick} />
      </h3>
      <h2>
        <img className="icon" src={flowericon} />
        {modalTitle}
      </h2>
      <hr />
      <h2 className="description"> {modalText}</h2>
      {modalTitle === "난이도 선택" && (
        <>
          <span className="buttonWarp">
            <span className="easy">
              <Button handleClick={handleDifficulty}>쉬움</Button>
            </span>
            <span className="difficult">
              <Button handleClick={handleDifficulty}>어려움</Button>
            </span>
          </span>
        </>
      )}
      {modalTitle === "역할 설정하기" && (
        <RoleWarp>
          <Role onClick={handleItRole}>술래</Role>
          {hasIt && (
            <>
              <span className="buttonWarpper">
                <span className="easy">
                  <Button handleClick={handleDifficulty}>쉬움</Button>
                </span>
                <span className="difficult">
                  <Button handleClick={handleDifficulty}>어려움</Button>
                </span>
              </span>
            </>
          )}
          <Role onClick={handleRole}>참가자</Role>
        </RoleWarp>
      )}
    </Content>
  );
}

const Content = styled.div`
  font-size: 2.2vh;

  .icon {
    width: 8vh;
    height: 9vh;
    vertical-align: middle;
    margin-right: 5px;
  }

  .none {
    height: 14vh;
  }

  .description {
    margin-top: ${(props) =>
      props.modalTitle === "난이도 선택"
        ? "10vh"
        : props.modalTitle === "알려드립니다"
        ? "70px"
        : "4px"};
    line-height: 7.5vh;
  }

  h3 {
    text-align: end;
    cursor: pointer;
  }

  hr {
    margin-top: 20px;
  }

  .buttonWarp {
    display: flex;
    justify-content: space-around;
    margin-left: 2vh;
    margin-top: 10vh;
  }
`;

const RoleWarp = styled.div`
  height: 50vh;

  .buttonWarpper {
    width: 105%;
  }

  .easy {
    margin-right: 2vh;
  }
`;

const Role = styled.div`
  width: 100%;
  height: 13vh;
  text-align: center;
  border-radius: 2vh;
  margin-top: 80vh;
  font-size: 4vh;
  background-color: #fdf3ef;
`;

ModalContent.propTypes = {
  modalText: PropTypes.string,
  modalTitle: PropTypes.string,
  handleModal: PropTypes.func,
  handleItCount: PropTypes.func,
};

export default ModalContent;
