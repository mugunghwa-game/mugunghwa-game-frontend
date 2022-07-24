import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import { socket } from "../utils/socket";
import Button from "./Button";
import DefaultPage from "./DefaultPage";
import Modal from "./Modal";
import ModalContent from "./ModalContent";

export function RoomList() {
  const navigate = useNavigate();

  const [roomInfo, setRoomInfo] = useState({});

  const [shouldDisplayRoomCreateModal, setShouldDisplayRoomCreateModal] =
    useState(false);

  const handleCreateRoom = () => {
    setShouldDisplayRoomCreateModal(true);
  };

  const handleExit = () => {
    navigate("/");
  };

  useEffect(() => {
    socket.emit("roomList", true);

    socket.on("room-info", (payload) => {
      setRoomInfo(payload.rooms);
    });

    socket.on("new-room", (payload) => {
      setRoomInfo(payload);
    });

    return () => {
      socket.off("room-info");
      socket.off("new-room");
    };
  }, []);

  return (
    <DefaultPage>
      {shouldDisplayRoomCreateModal && (
        <Modal>
          <ModalContent
            handleModal={setShouldDisplayRoomCreateModal}
            modalTitle="역할 설정하기"
          />
        </Modal>
      )}
      <Exit onClick={handleExit}>나가기</Exit>
      <RoomInfo className="roomList">방 목록</RoomInfo>
      <List>
        {Object.keys(roomInfo).map((roomId, index) =>
          (roomInfo[roomId].it.length === 1 &&
            roomInfo[roomId].participant.length === 2) ||
          roomInfo[roomId].isProgress === true ? (
            ""
          ) : (
            <div key={roomId} className="room">
              <p
                onClick={() => {
                  socket.emit("join-room", roomId);
                  navigate(`/waitingRoom/${roomId}`);
                }}
              >
                {index}번방 {roomId} [
                {`술래 ${roomInfo[roomId].it.length}/참가자${roomInfo[roomId].participant.length}`}
                ]
              </p>
            </div>
          )
        )}
      </List>
      <ButtonWrap>
        <Button property="stop" handleClick={handleCreateRoom}>
          방 만들기
        </Button>
      </ButtonWrap>
    </DefaultPage>
  );
}

const Exit = styled.div`
  position: absolute;
  margin-left: 3vh;
  margin-top: 3vh;
  cursor: pointer;
`;

const RoomInfo = styled.div`
  margin-top: 2vh;
  text-align: center;
  font-size: 2.8vh;
`;

const List = styled.div`
  width: 80%;
  height: 70%;
  background-color: #fdf3ef;
  margin: auto;
  margin-top: 2vh;
  overflow: auto;
  border-radius: 2vh;

  .room {
    height: 6vh;
    text-align: center;
    background-color: #faafaf;
    margin-top: 4vh;
    line-height: 5.3vh;
    cursor: pointer;
  }
`;

const ButtonWrap = styled.div`
  text-align: center;
  margin-top: 3vh;
`;
