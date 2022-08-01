import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import { GAME, SOCKET } from "../constants/constants";
import { socket, socketApi } from "../utils/socket";
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
    socketApi.roomList("roomList", true);

    socket.on(SOCKET.ROOM_INFO, (payload) => {
      setRoomInfo(payload.rooms);
    });

    socket.on(SOCKET.NEW_ROOM, (payload) => {
      setRoomInfo(payload);
    });

    return () => {
      socket.off(SOCKET.ROOM_INFO);
      socket.off(SOCKET.NEW_ROOM);
    };
  }, []);

  return (
    <DefaultPage>
      {shouldDisplayRoomCreateModal && (
        <Modal>
          <ModalContent
            modalTitle={GAME.ROLE_CHOICE}
            handleModal={setShouldDisplayRoomCreateModal}
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
                  socketApi.joinRoom(roomId);
                  navigate(`/waitingRoom/${roomId}`);
                }}
              >
                {index}번방 [
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
  margin: auto;
  margin-top: 2vh;
  overflow: auto;
  border-radius: 2vh;
  background-color: #fdf3ef;

  .room {
    height: 6vh;
    text-align: center;
    margin-top: 4vh;
    line-height: 5.3vh;
    background-color: #faafaf;
    cursor: pointer;
  }
`;

const ButtonWrap = styled.div`
  margin-top: 3vh;
  text-align: center;
`;
