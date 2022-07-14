import React, { useEffect, useRef, useState } from "react";
import Peer from "simple-peer";

import useStore from "../store/store";
import { socket, socketApi } from "../utils/socket";

const videoConstraints = {
  height: window.innerHeight / 2,
  width: window.innerWidth / 2,
};

export default function useCamera() {
  const userVideo = useRef();
  const [peers, setPeers] = useState([]);
  const peersRef = useRef([]);
  console.log("hehe useCamera");
  console.log(peers);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({
        video: videoConstraints,
        audio: true,
      })
      .then((stream) => {
        userVideo.current.srcObject = stream;

        socketApi.enterGameRoom(true);

        socket.on("all-info", (payload) => {
          const peers = [];

          payload.socketInRoom.forEach((user) => {
            const peer = new Peer({
              initiator: true,
              trickle: false,
              stream,
            });

            peer.on("signal", (signal) => {
              console.log("this is signal", signal);
              socket.emit("sending signal", {
                userToSignal: user,
                callerID: socket.id,
                signal,
              });
            });

            peersRef.current.push({
              peerID: user,
              peer,
            });
            peers.push(peer);
          });
          setPeers(peers);
        });

        socket.on("user joined", (payload) => {
          const peer = addPeer(payload.signal, payload.callerID, stream);
          peersRef.current.push({
            peerID: payload.callerID,
            peer,
          });

          setPeers((users) => [...users, peer]);
        });

        socket.on("receiving-returned-signal", (payload) => {
          const item = peersRef.current.find((p) => p.peerID === payload.id);
          item.peer.signal(payload.signal);
        });
      });
    return () => {};
  }, []);

  function addPeer(incomingSignal, callerID, stream) {
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream,
    });

    peer.on("signal", (signal) => {
      console.log(signal, "누가 들어왓대", callerID, "<-얘가 왔대");
      socket.emit("returning signal", { signal, callerID });
    });
    console.log("this is incomingSignal", incomingSignal);
    peer.signal(incomingSignal);

    return peer;
  }

  return {
    peers,
    userVideo,
  };
}
