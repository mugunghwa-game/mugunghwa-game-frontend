import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import { RULE_DESCRIPTION } from "../constants/constants";
import { SOCKET } from "../constants/constants";
import useStore from "../store/store";
import { socket } from "../utils/socket";
import Button from "./Button";
import DefaultPage from "./DefaultPage";
import Modal from "./Modal";
import ModalContent from "./ModalContent";

function WaitingRoom() {
  const navigate = useNavigate();
  const { addPerson, people, removeAll, addParticipant, participant } =
    useStore();
  const hasIt = people.filter((item) => item.role === "it");
  const [shouldDisplayModal, setShouldDisplayModal] = useState(false);
  const [shouldDisplayDifficultyModal, setShouldDisplayDifficultyModal] =
    useState(false);
  const [socketId, setSocketId] = useState(null);
  const [itCount, setItCount] = useState(hasIt.length);
  const [participantCount, setParticipantCount] = useState(participant.length);
  const [shouldDisplayInfoModal, setShouldDisplayInfoModal] = useState(false);

  const handleRuleModal = () => {
    setShouldDisplayModal(true);
  };

  const handleDifficultyChoice = () => {
    if (itCount === 1) {
      setShouldDisplayInfoModal(true);
    } else {
      setShouldDisplayDifficultyModal(true);
    }
  };

  const handleGame = () => {
    socket.emit("run", true);
    navigate("/countdown");
  };

  const handleRole = () => {
    if (participant.length < 2) {
      socket.emit("user count", {
        id: socket.id,
        role: "participant",
      });
      addPerson({ person: socket.id, role: "participant" });
      addParticipant(socket.id);
    } else {
      setShouldDisplayInfoModal(true);
    }
  };

  useEffect(() => {
    socket.emit(SOCKET.JOIN_ROOM, "gameRoom");
    socket.on("socket-id", (id) => {
      setSocketId(id);
    });

    socket.on("role-count", (data) => {
      setItCount(data.it);
      setParticipantCount(data.participant);
    });

    socket.on("role-counts", (data) => {
      setItCount(data.it);
      setParticipantCount(data.participant);
    });

    socket.on("start", (data) => {
      if (data) {
        navigate("/countdown");
      }
    });

    return () => {
      socket.off("socket-id");
      socket.off("role-count");
      socket.off("role-counts");
      socket.off("start");
    };
  }, []);

  return (
    <DefaultPage>
      <Content>
        {shouldDisplayModal && (
          <Modal>
            <ModalContent
              modalTitle="게임 규칙"
              modalText={RULE_DESCRIPTION}
              handleModal={setShouldDisplayModal}
            />
          </Modal>
        )}
        {shouldDisplayDifficultyModal && hasIt && (
          <Modal property="difficulty">
            <ModalContent
              handleItCount={setItCount}
              modalTitle="난이도 선택"
              modalText={
                "난이도 선택은 술래만 할 수 있으며 한 번 선택하면 바꿀 수없습니다."
              }
              handleModal={setShouldDisplayDifficultyModal}
            />
          </Modal>
        )}
        {shouldDisplayInfoModal && (
          <Modal property="info">
            <ModalContent
              handleModal={setShouldDisplayInfoModal}
              modalTitle="알려드립니다"
              modalText="인원이 다 찼습니다"
            />
          </Modal>
        )}
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
    background-color: #fdf3ef;
    width: 80%;
    height: 80px;
    font-size: 30px;
    margin-top: 60px;
    margin-inline: auto;
    border-radius: 20px;
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
  margin-top: 40px;
  bottom: 10px;
  text-align: center;
`;

export default WaitingRoom;
