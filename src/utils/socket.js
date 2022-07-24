import io from "socket.io-client";

import { SOCKET } from "../constants/constants";

export const socket = io.connect(process.env.REACT_APP_URL);

export const socketApi = {
  userCount: (id, role, difficulty, roomId) => {
    socket.emit(SOCKET.USER_COUNT, {
      id,
      role,
      difficulty,
      roomId,
    });
  },
  joinRoom: (roomName) => {
    socket.emit(SOCKET.JOIN_ROOM, roomName);
  },
  leaveRoom: (user, roomId) => {
    socket.emit(SOCKET.LEAVE_ROOM, { user, roomId });
  },
  enterGameRoom: (enter, roomId) => {
    socket.emit(SOCKET.ENTER, { enter, roomId });
  },
  sendSignalAnotherUser: (payload) => {
    const { userToSignal, signal, callerID } = payload;

    socket.emit(SOCKET.SENDING_SIGNAL, { userToSignal, signal, callerID });
  },
  returningSignal: (payload) => {
    const { signal, callerID } = payload;
    socket.emit(SOCKET.RETURNING_SIGNAL, { signal, callerID });
  },
  isReady: (enter, roomId) => {
    socket.emit(SOCKET.IS_READY, { enter, roomId });
  },
  motionStart: (state, roomId) => {
    socket.emit(SOCKET.MOTION_START, { state, roomId });
  },
  userMoved: (user, state, roomId) => {
    socket.emit(SOCKET.MOVED, { user, state, roomId });
  },
  countEnd: (state) => {
    socket.emit(SOCKET.COUNT_END, state);
  },
  itLoser: (state, roomId) => {
    socket.emit(SOCKET.IT_LOSER, { state, roomId });
  },
};
