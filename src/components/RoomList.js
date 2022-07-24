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
  const [shouldDisplayRoomCreateModal, setShouldDisplayRoomCreateModal] =
    useState(false);

  const handleCreateRoom = () => {
    setShouldDisplayRoomCreateModal(true);
  };
  const [roomInfo, setRoomInfo] = useState({});

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
      <List>
        {Object.keys(roomInfo).map((roomId, index) =>
          (roomInfo[roomId].it.length === 1 &&
            roomInfo[roomId].participant.length === 2) ||
          roomInfo[roomId].isProgress === true ? (
            ""
          ) : (
            <li key={roomId}>
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
            </li>
          )
        )}
      </List>
      <Button property="roomMaker" handleClick={handleCreateRoom}>
        방만들기
      </Button>
    </DefaultPage>
  );
}

const List = styled.div`
  width: 80%;
  height: 80%;
  background-color: aliceblue;
  margin: auto;
  margin-top: 2vh;
`;
