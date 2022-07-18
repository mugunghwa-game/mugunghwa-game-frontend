import PropTypes from "prop-types";
import React from "react";
import { MdClose } from "react-icons/md";
import styled from "styled-components";

import flowericon from "../asset/flowericon.jpeg";
import { SOCKET } from "../constants/constants";
import useStore from "../store/store";
import { socket } from "../utils/socket";
import Button from "./Button";

function ModalContent({ modalText, modalTitle, handleModal, handleItCount }) {
  const { addIt, addPerson } = useStore();

  const handleClick = () => {
    handleModal(false);
  };

  const handleDifficulty = (event) => {
    socket.emit(SOCKET.USER_COUNT, {
      id: socket.id,
      role: "it",
      difficulty: event.target.innerText,
    });

    addIt(socket.id);
    addPerson({ person: socket.id, role: "it" });

    handleItCount((prev) => prev + 1);
    handleModal(false);
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
          <div className="none" />
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
  }
`;

ModalContent.propTypes = {
  modalText: PropTypes.string,
  modalTitle: PropTypes.string,
  handleModal: PropTypes.func,
  handleItCount: PropTypes.func,
};

export default ModalContent;
