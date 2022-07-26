import PropTypes from "prop-types";
import React, { useState } from "react";
import { MdClose } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import flowericon from "../asset/flowericon.jpeg";
import { socket, socketApi } from "../utils/socket";
import DifficultyChoice from "./DifficultyChoice";

function ModalContent({ modalText, modalTitle, handleModal }) {
  const navigate = useNavigate();

  const [hasIt, setHasIt] = useState(false);

  const handleClick = () => {
    handleModal(false);
  };

  const handleRole = () => {
    socketApi.createGameRoom(socket.id, socket.id, "participant");

    navigate(`/waitingRoom/${socket.id}`);
  };

  const handleItRole = () => {
    setHasIt(true);
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
        <DifficultyChoice handleModal={handleModal} modalTitle={modalTitle} />
      )}
      {modalTitle === "역할 설정하기" && (
        <RoleWarp>
          <Role onClick={handleItRole}>술래</Role>
          {hasIt && (
            <DifficultyChoice
              handleModal={handleModal}
              modalTitle={modalTitle}
            />
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
`;

const RoleWarp = styled.div`
  height: 50vh;
`;

const Role = styled.div`
  width: 100%;
  height: 15vh;
  text-align: center;
  margin-top: 8vh;
  font-size: 4vh;
  background-color: #fdf3ef;
`;

ModalContent.propTypes = {
  modalText: PropTypes.any,
  modalTitle: PropTypes.string,
  handleModal: PropTypes.func,
  handleItCount: PropTypes.func,
};

export default ModalContent;
