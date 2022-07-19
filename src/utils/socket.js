import io from "socket.io-client";

import { SOCKET } from "../constants/constants";

export const socket = io.connect(process.env.REACT_APP_URL);

export const socketApi = {
  userCount: (id, role, difficulty) => {
    socket.emit(SOCKET.USER_COUNT, {
      id,
      role,
      difficulty,
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
  sendSignalAnotherUser: (payload) => {
    const { userToSignal, signal, callerID } = payload;

    socket.emit(SOCKET.SENDING_SIGNAL, { userToSignal, signal, callerID });
  },
  returningSignal: (payload) => {
    const { signal, callerID } = payload;
    socket.emit(SOCKET.RETURNING_SIGNAL, { signal, callerID });
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
