import Peer from "simple-peer";

import { SOCKET } from "../constants/constants";
import { socket } from "./socket";

export function createPeer(userToSignal, callerID, stream) {
  const peer = new Peer({
    initiator: true,
    trickle: false,
    stream,
  });

  peer.on("signal", (signal) => {
    socket.emit(SOCKET.SENDING_SIGNAL, {
      userToSignal,
      callerID,
      signal,
    });
  });

  return peer;
}
