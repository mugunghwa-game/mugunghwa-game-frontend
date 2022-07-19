import React, { useEffect, useRef, useState } from "react";
import Peer from "simple-peer";

import { SOCKET } from "../constants/constants";
import { socket, socketApi } from "../utils/socket";

export default function useVideo() {
  const [peers, setPeers] = useState([]);
  const userVideo = useRef();
  const peersRef = useRef([]);
  const [itUser, setItUser] = useState(null);
  const [participantUser, setParticipantUser] = useState(null);
  const [isRedadyPoseDetection, setIsReadyPoseDetection] = useState(false);
  const [difficulty, setDifficulty] = useState(null);

  const videoConstraints = {
    height: window.innerHeight / 2,
    width: window.innerWidth / 2,
  };

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({
        video: videoConstraints,
        audio: true,
      })
      .then((stream) => {
        if (userVideo.current) {
          userVideo.current.srcObject = stream;
        }

        socketApi.enterGameRoom(true);

        socket.on(SOCKET.USER, (payload) => {
          setItUser(payload.it);
          setParticipantUser(payload.participant);
          setDifficulty(payload.difficulty);
          setIsReadyPoseDetection(true);

          const peers = [];

          payload.socketInRoom.forEach((user) => {
            const peer = new Peer({
              initiator: true,
              trickle: false,
              stream,
            });

            peer.on("signal", (signal) => {
              console.log(socket.id);
              socketApi.sendSignalAnotherUser({
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

        socket.on(SOCKET.USER_JOINED, (payload) => {
          console.log("userJoined", payload);
          const peer = addPeer(payload.signal, payload.callerID, stream);

          peersRef.current.push({
            peerID: payload.callerID,
            peer,
          });

          setPeers((users) => [...users, peer]);
        });

        socket.on(SOCKET.RECEIVING_RETURNED_SIGNAL, (payload) => {
          console.log("receivings", payload);
          const item = peersRef.current.find((p) => p.peerID === payload.id);
          item.peer.signal(payload.signal);
        });
      });

    return () => {
      userVideo.current = null;

      socket.off(SOCKET.USER);
      socket.off(SOCKET.USER_JOINED);
      socket.off(SOCKET.RECEIVING_RETURNED_SIGNAL);
    };
  }, []);

  function addPeer(incomingSignal, callerID, stream) {
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream,
    });

    peer.on("signal", (signal) => {
      console.log(signal, "누가 들어왓대", callerID, "<-얘가 왔대");
      socketApi.returningSignal({ signal, callerID });
    });

    console.log("this is incomingSignal", incomingSignal);
    peer.signal(incomingSignal);

    return peer;
  }

  return {
    userVideo,
    participantUser,
    itUser,
    difficulty,
    isRedadyPoseDetection,
    peers,
    peersRef,
    setParticipantUser,
  };
}
