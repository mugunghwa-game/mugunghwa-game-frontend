import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import { GAME, RULE_DESCRIPTION } from "../constants/constants";
import { SOCKET } from "../constants/constants";
import useStore from "../store/store";
import { socket, socketApi } from "../utils/socket";
import Button from "./Button";
import DefaultPage from "./DefaultPage";
import Game from "./Game";
import Modal from "./Modal";
import ModalContent from "./ModalContent";

function WaitingRoom() {
  const navigate = useNavigate();
  const {
    addPerson,
    people,
    addParticipant,
    participantList,
    addParticipantList,
    participant,
    updatePerson,
  } = useStore();
  const hasIt = people.filter((item) => item.role === "it");
  const [shouldDisplayModal, setShouldDisplayModal] = useState(false);
  const [shouldDisplayDifficultyModal, setShouldDisplayDifficultyModal] =
    useState(false);
  const [socketId, setSocketId] = useState(null);
  const [itCount, setItCount] = useState(hasIt.length);
  const [participantCount, setParticipantCount] = useState(
    participantList.length
  );
  const [shouldDisplayInfoModal, setShouldDisplayInfoModal] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const handleRuleModal = () => {
    setShouldDisplayModal(true);
  };

  const handleDifficultyChoice = () => {
    itCount === 1
      ? setShouldDisplayInfoModal(true)
      : setShouldDisplayDifficultyModal(true);
  };

  const handleGame = () => {
    navigate("/game");
  };

  const handleExist = () => {
    socket.emit("leaveRoom", socket.id);
    updatePerson(socket.id);
    navigate("/");
  };

  const handleRole = () => {
    if (participantCount < 1) {
      socketApi.userCount(socket.id, "participant");
      addPerson({ person: socket.id, role: "participant" });
      addParticipant(socket.id);
      addParticipantList(socket.id);
    } else {
      setShouldDisplayInfoModal(true);
    }
  };

  useEffect(() => {
    socketApi.joinRoom("gameRoom");
    socket.on(SOCKET.SOCKET_ID, (payload) => {
      console.log(socket.id, payload);
      setSocketId(payload.id);

      setItCount(payload.it);

      setParticipantCount(payload.participant);
    });

    socket.on(SOCKET.ROLE_COUNT, (payload) => {
      console.log(payload);
      setItCount(payload.it);
      setParticipantCount(payload.participant);
    });

    socket.on("updateUser", (payload) => {
      console.log("update", payload);
      setParticipantCount(payload.participant.length);
      setItCount(payload.it.length);
    });

    return () => {
      socket.off(SOCKET.SOCKET_ID);
      socket.off(SOCKET.ROLE_COUNT);
      socket.off("updateUser");
    };
  }, [participant, people, itCount]);

  return (
    <DefaultPage>
      <Content>
        {shouldDisplayModal && (
          <Modal>
            <ModalContent
              modalTitle={GAME.RULE}
              modalText={RULE_DESCRIPTION}
              handleModal={setShouldDisplayModal}
            />
          </Modal>
        )}
        {shouldDisplayDifficultyModal && hasIt && (
          <Modal property="difficulty">
            <ModalContent
              handleItCount={setItCount}
              modalTitle={GAME.DIFFICULTY_CHOICE}
              modalText={GAME.DIFFICULTY_CHOICE_DESCRIPTION}
              handleModal={setShouldDisplayDifficultyModal}
            />
          </Modal>
        )}
        {shouldDisplayInfoModal && (
          <Modal property="info">
            <ModalContent
              handleModal={setShouldDisplayInfoModal}
              modalTitle={GAME.INFO_MODAL_TITLE}
              modalText={GAME.INFO_MODAL_TEXT}
            />
          </Modal>
        )}
        <div className="exit" onClick={handleExist}>
          나가기
        </div>
        <div className="rule" onClick={handleRuleModal}>
          규칙알아보기
        </div>
        <div className="participation">게임참여하기</div>
        <div className="it">
          <p className="choice" onClick={handleDifficultyChoice}>
            술래 <span className="count">{itCount}/1명</span>
          </p>
        </div>
        <div className="participant" onClick={handleRole}>
          <p className="choice">
            참가자 <span className="count">{participantCount}/2명</span>
          </p>
        </div>
      </Content>
      <ButtonWrap>
        <Button
          property={itCount !== 1 || participantCount !== 2 ? "disabled" : null}
          handleClick={handleGame}
        >
          게임시작
        </Button>
      </ButtonWrap>
      {isReady && <Game />}
    </DefaultPage>
  );
}

const Content = styled.div`
  .exit {
    font-size: 20px;
    cursor: pointer;
  }

  .rule {
    margin-top: 20px;
    margin-right: 60px;
    text-align: right;
    font-size: 20px;
    cursor: pointer;
  }

  .participation {
    font-size: 40px;
    text-align: center;
  }

  .it,
  .participant {
    width: 80%;
    height: 80px;
    margin-top: 60px;
    margin-inline: auto;
    border-radius: 20px;
    font-size: 30px;
    background-color: #fdf3ef;
    cursor: pointer;

    .choice {
      padding-top: 15px;
      margin-left: 20px;
    }

    .count {
      float: right;
      margin-right: 30px;
    }

    :hover {
      background-color: #ffe9e0;
      transform: translateY(-3px);
    }

    :active {
      transform: translateY(3px);
    }
  }
`;

const ButtonWrap = styled.div`
  bottom: 10px;
  margin-top: 40px;
  text-align: center;
`;

export default WaitingRoom;
