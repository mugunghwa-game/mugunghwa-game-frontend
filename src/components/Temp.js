import React, { useEffect, useRef, useState } from "react";
import Peer from "simple-peer";
import io from "socket.io-client";
import styled from "styled-components";

import { socket } from "../utils/socket";

const Container = styled.div`
  padding: 20px;
  display: flex;
  height: 100vh;
  width: 90%;
  margin: auto;
  flex-wrap: wrap;
`;

const StyledVideo = styled.video`
  height: 40%;
  width: 50%;
`;

const Video = (props) => {
  const ref = useRef();
  console.log(props);
  const canvasRef = useRef();
  useEffect(() => {
    props.peer.on("stream", (stream) => {
      console.log(stream, "다른사람거");
      ref.current.srcObject = stream;
    });
  }, []);

  return (
    <>
      <StyledVideo playsInline autoPlay ref={ref} />
      <canvas ref={canvasRef}></canvas>
    </>
  );
};

const videoConstraints = {
  height: window.innerHeight / 2,
  width: window.innerWidth / 2,
};
const Temp = (props) => {
  const [peers, setPeers] = useState([]);
  const socketRef = useRef();
  const userVideo = useRef();
  const peersRef = useRef([]);
  const roomID = "11";

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: videoConstraints, audio: true })
      .then((stream) => {
        console.log(stream, "mystream");
        userVideo.current.srcObject = stream;
        // console.log(socket);

        socket.emit("join room", roomID);
        socket.on("all users", (users) => {
          const peers = [];
          users.forEach((userID) => {
            const peer = createPeer(userID, socket.id, stream);
            peersRef.current.push({
              peerID: userID,
              peer,
            });
            peers.push(peer);
            console.log("1", peer);
          });
          setPeers(peers);
        });
        console.log(peers, "2");

        socket.on("user joined", (payload) => {
          const peer = addPeer(payload.signal, payload.callerID, stream);
          console.log(peer, "im here");

          peersRef.current.push({
            peerID: payload.callerID,
            peer,
          });
          console.log("3", peersRef);

          setPeers((users) => [...users, peer]);
        });
        console.log(peers, "4");

        socket.on("receiving returned signal", (payload) => {
          const item = peersRef.current.find((p) => p.peerID === payload.id);
          item.peer.signal(payload.signal);
        });
      })
      .then((err) => console.log(err));
  }, []);

  function createPeer(userToSignal, callerID, stream) {
    console.log(
      userToSignal,
      "~에게 보내줘",
      callerID,
      "~얘가 들어왔대",
      stream
    );
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream,
    });

    peer.on("signal", (signal) => {
      console.log("보낼 시그널", signal);
      socket.emit("sending signal", {
        userToSignal,
        callerID,
        signal,
      });
    });

    return peer;
  }

  function addPeer(incomingSignal, callerID, stream) {
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream,
    });

    peer.on("signal", (signal) => {
      socket.emit("returning signal", { signal, callerID });
    });

    peer.signal(incomingSignal);

    return peer;
  }

  return (
    <Container>
      <StyledVideo muted ref={userVideo} autoPlay playsInline />
      {peers.map((peer, index) => {
        console.log("peer", peer);
        return <Video key={index} peer={peer} />;
      })}
    </Container>
  );
};

export default Temp;
