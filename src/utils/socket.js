import io from "socket.io-client";

import { SOCKET } from "../constants/constants";
export const socket = io.connect(process.env.REACT_APP_URL);
export const socketApi = {
  userCount: (id, role) => {
    socket.emit(SOCKET.USER_COUNT, {
      id,
      role,
    });
  },
  joinRoom: (roomName) => {
    socket.emit(SOCKET.JOIN_ROOM, roomName);
  },
  enterGameRoom: (enter) => {
    socket.emit(SOCKET.ENTER, enter);
  },
  sendSignalAnotherUser: (user, socketID, signal) => {
    socket.emit("sending signal", {
      userToSignal: user,
      callerID: socketID,
      signal: signal,
    });
  },
  isReady: (enter) => {
    socket.emit(SOCKET.IS_READY, enter);
  },
  userMoved: (user) => {
    socket.emit(SOCKET.MOVED, user);
  },
  countEnd: (state) => {
    socket.emit(SOCKET.COUNT_END, state);
  },
  itLoser: (state) => {
    socket.emit(SOCKET.IT_LOSER, state);
  },
};
