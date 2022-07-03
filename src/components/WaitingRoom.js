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
  const [shoulDisplayModal, setShouldDisplayModal] = useState(false);
  const [shoulDisplayDifficultyModal, setShouldDisplayDifficultyModal] =
    useState(false);
  const [socketId, setSocketId] = useState(null);
  const navigate = useNavigate();
  const { people, addPerson } = useStore();

  const handleRuleModal = () => {
    setShouldDisplayModal(true);
  };

  const handleDifficultyChoice = () => {
    setShouldDisplayDifficultyModal(true);
  };

  const handleGame = () => {
    navigate("/countdown");
  };

  const handleRole = () => {
    addPerson({ person: socket.id, role: "participant" });
  };

  useEffect(() => {
    socket.emit(SOCKET.JOIN_ROOM, "gameRoom");
    socket.on("socket-id", (id) => {
      setSocketId(id);
    });

    return () => {
      socket.off("socket-id");
    };
  }, []);

  useEffect(() => {
    socket.on("all users", (data) => {});

    return () => {
      socket.off("all users");
    };
  }, []);

  return (
    <DefaultPage>
      <Content>
        {shoulDisplayModal && (
          <Modal>
            <ModalContent
              modalTitle="게임 규칙"
              modalText={RULE_DESCRIPTION}
              handleModal={setShouldDisplayModal}
            />
          </Modal>
        )}
        {shoulDisplayDifficultyModal && (
          <Modal property="difficulty">
            <ModalContent
              modalTitle="난이도 선택"
              modalText={
                "난이도 선택은 술래만 할 수 있으며 한 번 선택하면 바꿀 수없습니다."
              }
              handleModal={setShouldDisplayDifficultyModal}
            />
          </Modal>
        )}
        <div className="rule" onClick={handleRuleModal}>
          규칙알아보기
        </div>
        <div className="participation">게임참여하기</div>
        <div className="it">
          <p className="choice" onClick={handleDifficultyChoice}>
            술래 <span className="count">/1명</span>
          </p>
        </div>
        <div className="participant" onClick={handleRole}>
          <p className="choice">
            참가자 <span className="count">/2명</span>
          </p>
        </div>
      </Content>
      <ButtonWrap>
        <Button handleClick={handleGame}>게임시작</Button>
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
