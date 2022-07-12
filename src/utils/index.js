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
    console.log(
      signal,
      socket.id,
      "socketid가 들어온사람",
      userToSignal,
      "userTosignal은 받는사람"
    );
    socket.emit(SOCKET.SENDING_SIGNAL, {
      userToSignal: userToSignal,
      callerID: socket.id,
      signal: signal,
    });
  });

  return peer;
}

export function addPeer(incomingSignal, callerID, stream) {
  const peer = new Peer({
    initiator: false,
    trickle: false,
    stream,
  });

  peer.on("signal", (signal) => {
    console.log(signal, "누가 들어왓대", callerID, "<-얘가 왔대");
    socket.emit("returning signal", { signal, callerID });
  });

  peer.signal(incomingSignal);

  return peer;
}
