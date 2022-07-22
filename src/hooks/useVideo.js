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

            peers.push({
              peerID: user,
              peer: peer,
            });
          });

          setPeers(peers);
        });

        socket.on(SOCKET.USER_JOINED, (payload) => {
          const peer = addPeer(payload.signal, payload.callerID, stream);

          const peerObj = {
            peerID: payload.callerID,
            peer: peer,
          };

          peersRef.current.push(peerObj);

          setPeers((users) => [...users, peerObj]);
        });

        socket.on(SOCKET.RECEIVING_RETURNED_SIGNAL, (payload) => {
          const item = peersRef.current.find((p) => p.peerID === payload.id);
          item.peer.signal(payload.signal);
        });

        socket.on(SOCKET.USER_LEFT, (payload) => {
          const peerObj = peersRef.current.find(
            (peer) => peer.peerID === payload
          );

          const peers = peersRef.current.filter(
            (peer) => peer.peerID !== payload
          );

          peersRef.current = peers;

          if (peerObj) {
            peerObj.peer.destroy();
          }

          setPeers((peers) => peers.filter((peer) => peer.peerID !== payload));
        });
      });

    return () => {
      userVideo.current = null;

      socket.off(SOCKET.USER);
      socket.off(SOCKET.USER_JOINED);
      socket.off(SOCKET.RECEIVING_RETURNED_SIGNAL);
      socket.off(SOCKET.USER_LEFT);
    };
  }, []);

  function addPeer(incomingSignal, callerID, stream) {
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream,
    });

    peer.on("signal", (signal) => {
      socketApi.returningSignal({ signal, callerID });
    });

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
