import * as posenet from "@tensorflow-models/posenet";
import React, { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import Peer from "simple-peer";
import styled from "styled-components";

import { drawCanvas, videoReference } from "../utils/posenet";
import { socket } from "../utils/socket";

const Container = styled.div`
  padding: 20px;
  display: flex;
  height: 100vh;
  width: 90%;
  margin: auto;
  flex-wrap: wrap;
`;

const Video = (props) => {
  const ref = useRef();
  const otherUserRef = useRef();

  useEffect(() => {
    props.peer.on("stream", (stream) => {
      ref.current.srcObject = stream;
    });
  }, []);

  return (
    <>
      <video className="otherUser" playsInline autoPlay ref={ref} />
      <canvas className="otherUser" ref={otherUserRef} />
    </>
  );
};

const videoConstraints = {
  height: window.innerHeight / 2,
  width: window.innerWidth / 2,
};

const Temp = () => {
  const [peers, setPeers] = useState([]);
  const userCanvas = useRef();

  const userVideo = useRef();
  const peersRef = useRef([]);
  const roomID = "11";

  const runPosenet = async () => {
    const net = await posenet.load({
      inputResolution: { width: 640, height: 480 },
      scale: 0.8,
    });

    const temp = setInterval(() => {
      detect(net);
    }, 1000);

    setTimeout(() => {
      clearInterval(temp), console.log("done");
    }, 30000);
  };

  const detect = async (net) => {
    if (
      typeof userVideo.current !== "undefined" &&
      userVideo.current !== null &&
      userVideo.current.video.readyState === 4
    ) {
      const video = videoReference(userVideo);
      const pose = await net.estimateSinglePose(video);

      if (pose !== null && userCanvas.current !== null) {
        drawCanvas(pose, video, video.width, video.height, userCanvas);
      }
    }
  };

  useEffect(() => {
    runPosenet();
  }, []);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: videoConstraints, audio: true })
      .then((stream) => {
        userVideo.current.srcObject = stream;

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

        socket.on("receiving returned signal", (payload) => {
          const item = peersRef.current.find((p) => p.peerID === payload.id);
          item.peer.signal(payload.signal);
        });
      })
      .then((err) => console.log(err));
  }, []);

  function createPeer(userToSignal, callerID, stream) {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream,
    });

    peer.on("signal", (signal) => {
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
      <UserCamera>
        <Webcam
          muted
          className="userVideo"
          ref={userVideo}
          autoPlay
          playsInline
        />
        <canvas ref={userCanvas} className="userVideo" />
      </UserCamera>
      {peers.map((peer, index) => (
        <Video key={index} peer={peer} />
      ))}
    </Container>
  );
};

const UserCamera = styled.div`
  .userVideo {
    position: absolute;
    width: 500px;
    height: 500px;
    align-items: center;
    object-fit: fill;
  }
`;

export default Temp;
