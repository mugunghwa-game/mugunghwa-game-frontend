import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";

import { GAME, RULE_DESCRIPTION } from "../constants/constants";
import { SOCKET } from "../constants/constants";
import useStore from "../store/store";
import { socket, socketApi } from "../utils/socket";
import Button from "./Button";
import Countdown from "./Countdown";
import DefaultPage from "./DefaultPage";
import Modal from "./Modal";
import ModalContent from "./ModalContent";

function WaitingRoom() {
  const navigate = useNavigate();
  const { roomId } = useParams();

  const { it } = useStore();

  const [shouldDisplayModal, setShouldDisplayModal] = useState(false);
  const [shouldDisplayDifficultyModal, setShouldDisplayDifficultyModal] =
    useState(false);
  const [itCount, setItCount] = useState(it.length);
  const [participantCount, setParticipantCount] = useState(0);
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
    setIsReady(true);
  };

  const handleExist = () => {
    socketApi.leaveRoom(socket.id, roomId);

    navigate("/roomList");
  };

  const handleRole = () => {
    if (participantCount < 2) {
      socketApi.userCount(socket.id, "participant", null, roomId);
    } else {
      setShouldDisplayInfoModal(true);
    }
  };

  useEffect(() => {
    socketApi.joinRoom(roomId);

    socket.on(SOCKET.SOCKET_ID, (payload) => {
      setItCount(payload.it);
      setParticipantCount(payload.participant);
    });

    socket.on(SOCKET.ROLE_COUNT, (payload) => {
      setItCount(payload.it);
      setParticipantCount(payload.participant);
    });

    socket.on(SOCKET.UPDATE_USER, (payload) => {
      setParticipantCount(payload.participant.length);
      setItCount(payload.it.length);
    });

    return () => {
      socket.off(SOCKET.SOCKET_ID);
      socket.off(SOCKET.ROLE_COUNT);
      socket.off(SOCKET.UPDATE_USER);
    };
  }, [participantCount, itCount]);

  return (
    <DefaultPage>
      {!isReady && (
        <>
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
            {shouldDisplayDifficultyModal && (
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
                  modalTitle={GAME.INFO_MODAL_TITLE}
                  modalText={GAME.INFO_MODAL_TEXT}
                  handleModal={setShouldDisplayInfoModal}
                />
              </Modal>
            )}
            <div className="exit" onClick={handleExist}>
              ?????????
            </div>
            <div className="rule" onClick={handleRuleModal}>
              ??????????????????
            </div>
            <div className="participation">??????????????????</div>
            <div className="it">
              <p className="choice" onClick={handleDifficultyChoice}>
                ?????? <span className="count">{itCount}/1???</span>
              </p>
            </div>
            <div className="participant" onClick={handleRole}>
              <p className="choice">
                ????????? <span className="count">{participantCount}/2???</span>
              </p>
            </div>
          </Content>
          <ButtonWrap>
            <Button
              property={
                itCount !== 1 || participantCount !== 2 ? "disabled" : null
              }
              handleClick={handleGame}
            >
              ????????????
            </Button>
          </ButtonWrap>
        </>
      )}
      {isReady && <Countdown />}
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
