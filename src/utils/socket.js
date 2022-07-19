import io from "socket.io-client";

import { SOCKET } from "../constants/constants";

export const socket = io.connect("http://localhost:8080");

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
  leaveRoom: (user) => {
    socket.emit(SOCKET.LEAVE_ROOM, user);
  },
  enterGameRoom: (enter) => {
    socket.emit(SOCKET.ENTER, enter);
  },
  sendSignalAnotherUser: (user, socketID, signal) => {
    socket.emit(SOCKET.SENDING_SIGNAL, {
      userToSignal: user,
      callerID: socketID,
      signal: signal,
    });
  },
  returningSignal: (signal, id) => {
    socket.emit(SOCKET.RETURNING_SIGNAL, { signal, id });
  },
  isReady: (enter) => {
    socket.emit(SOCKET.IS_READY, enter);
  },
  motionStart: (state) => {
    socket.emit(SOCKET.MOTION_START, state);
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
