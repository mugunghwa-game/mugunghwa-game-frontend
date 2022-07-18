import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import { GAME, RULE_DESCRIPTION } from "../constants/constants";
import { SOCKET } from "../constants/constants";
import useStore from "../store/store";
import { socket, socketApi } from "../utils/socket";
import Button from "./Button";
import DefaultPage from "./DefaultPage";
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
  const [shouldDisplayProgressModal, setShouldDisplayProgressModal] =
    useState(false);

  const handleRuleModal = () => {
    setShouldDisplayModal(true);
  };

  const handleDifficultyChoice = () => {
    itCount === 1
      ? setShouldDisplayInfoModal(true)
      : setShouldDisplayDifficultyModal(true);
  };

  const handleGame = () => {
    // socket.emit(SOCKET.READY, true);

    navigate("/countDown");
  };

  const handleExist = () => {
    socketApi.leaveRoom(socket.id);
    updatePerson(socket.id);

    navigate("/");
  };

  const handleRole = () => {
    if (participantCount < 2) {
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
      setSocketId(payload.id);
      setItCount(payload.it);
      setParticipantCount(payload.participant);
      setShouldDisplayProgressModal(payload.isProgress);
    });

    socket.on(SOCKET.ROLE_COUNT, (payload) => {
      setItCount(payload.it);
      setParticipantCount(payload.participant);
    });

    socket.on(SOCKET.UPDATE_USER, (payload) => {
      setParticipantCount(payload.participant.length);
      setItCount(payload.it.length);
    });

    // socket.on(SOCKET.START, (payload) => {
    // payload ? navigate("/countDown") : null;
    // });

    return () => {
      socket.off(SOCKET.SOCKET_ID);
      socket.off(SOCKET.ROLE_COUNT);
      socket.off(SOCKET.UPDATE_USER);
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
        {shouldDisplayProgressModal && (
          <Modal property="info">
            <ModalContent
              handleModal={setShouldDisplayProgressModal}
              modalTitle={GAME.INFO_MODAL_TITLE}
              modalText={GAME.GAME_PROGRESS}
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
    </DefaultPage>
  );
}

const Content = styled.div`
  .exit {
    position: absolute;
    font-size: 4vh;
    margin: 0 2vh;
    cursor: pointer;
  }

  .rule {
    margin: 2vh 2vh;
    text-align: right;
    font-size: 4vh;
    cursor: pointer;
  }

  .participation {
    font-size: 6vh;
    text-align: center;
  }

  .it,
  .participant {
    width: 130vh;
    height: 12vh;
    margin-top: 5vh;
    margin-inline: auto;
    border-radius: 2vh;
    font-size: 3.5vh;
    background-color: #fdf3ef;
    cursor: pointer;

    .choice {
      padding-top: 2.3vh;
      margin: 0 3vh;
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
  margin-top: 10vh;
  text-align: center;
`;

export default WaitingRoom;
