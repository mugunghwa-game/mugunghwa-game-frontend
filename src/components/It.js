import * as posenet from "@tensorflow-models/posenet";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Webcam from "react-webcam";
import Peer from "simple-peer";
import styled from "styled-components";

import { drawKeypoints, drawSkeleton } from "../utils/posenet";
import { socket } from "../utils/socket";
import Button from "./Button";
import DefaultPage from "./DefaultPage";

function It() {
  const navigate = useNavigate();
  const [peers, setPeers] = useState([]);
  const userVideo = useRef();
  const peersRef = useRef([]);
  const canvasRef = useRef(null);
  const [itUser, setItUser] = useState(null);

  let userInfo;

  useEffect(() => {
    socket.emit("enter", true);
    socket.on("user", (data) => {
      userInfo = data;
      setItUser(data.room.it);
    });

    navigator.mediaDevices
      .getUserMedia({ video: videoConstraints, audio: true })
      .then((stream) => {
        userVideo.current.srcObject = stream;

        const peers = [];

        userInfo.participant.forEach((user) => {
          const peer = createPeer(user, socket.id, userVideo.current.srcObject);
          peersRef.current.push({
            peerID: user,
            peer,
          });

          peers.push(peer);
        });
        setPeers(peers);

        socket.on("receiving returned signal", (payload) => {
          const item = peersRef.current.find((p) => p.peerID === payload.id);
          item.peer.signal(payload.signal);
        });
      });

    return () => {
      socket.off("user");
    };
  }, [socket]);

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

  const runPosenet = async () => {
    const net = await posenet.load({
      inputResolution: { width: 640, height: 480 },
      scale: 0.5,
    });

    if (userVideo.current !== null) {
      const temp = setInterval(() => {
        detect(net);
      }, 1000);
      setTimeout(() => clearInterval(temp) & console.log("done"), 40000);
    }
  };

  const detect = async (net) => {
    if (
      typeof userVideo.current !== "undefined" &&
      userVideo.current !== null &&
      userVideo.current.video.readyState === 4
    ) {
      const video = userVideo.current.video;
      const videoWidth = userVideo.current.video.videoWidth;
      const videoHeight = userVideo.current.video.videoHeight;

      userVideo.current.video.width = videoWidth;
      userVideo.current.video.height = videoHeight;

      const pose = await net.estimateSinglePose(video);
      drawCanvas(pose, video, videoWidth, videoHeight, canvasRef);
    }
  };

  const drawCanvas = (pose, video, videoWidth, videoHeight, canvas) => {
    const ctx = canvas.current.getContext("2d");
    canvas.current.width = videoWidth;
    canvas.current.height = videoHeight;

    drawKeypoints(pose.keypoints, 0.5, ctx);
    drawSkeleton(pose.keypoints, 0.5, ctx);
  };

  const handleStopButton = () => {};

  useEffect(() => {
    runPosenet();

    return () => {
      runPosenet();
    };
  }, []);

  return (
    <DefaultPage>
      <Description>
        {itUser && itUser[0] === socket.id ? (
          <>
            <div>
              <span className="color">무궁화 꽃이 피었습니다</span> 라고 외친 후
              <span className="color"> 멈춤</span> 버튼을 눌러주세요
            </div>
            <div>
              버튼 누른 후 <span className="color"> 3초</span> 동안 다른
              참가자들의 움직임이 감지됩니다
            </div>
          </>
        ) : (
          <>
            <div>
              술래가 무궁화 꽃이 피었습니다를 외치면
              <span className="color">3초</span>간 동작을 멈춰야합니다
            </div>
          </>
        )}
      </Description>
      <Participant>
        {peers.map((peer, index) => (
          <div className="participant" key={index}>
            <Webcam
              key={index}
              peer={peer}
              style={{
                position: "absolute",
                marginLeft: "auto",
                marginRight: "auto",
                textAlign: "center",
                zindex: 9,
                width: "400px",
                height: "250px",
              }}
            />
            <canvas
              ref={canvasRef}
              style={{
                position: "absolute",
                marginLeft: "auto",
                marginRight: "auto",
                textAlign: "center",
                zindex: 9,
                width: "400px",
                height: "250px",
              }}
            />
          </div>
        ))}
      </Participant>
      <ItsCamera>
        <div className="opportunity">남은기회의 수</div>
        <div className="it">
          {itUser && itUser[0] === socket.id ? <>나</> : null}
          <Webcam
            muted
            ref={userVideo}
            autoPlay
            playsInline
            style={{
              width: "260px",
            }}
          />
        </div>
        {itUser && itUser[0] === socket.id ? (
          <div className="stop">
            <Button handleClick={handleStopButton} property="stop">
              멈춤
            </Button>
          </div>
        ) : null}
      </ItsCamera>
    </DefaultPage>
  );
}

const Description = styled.div`
  margin-top: 20px;
  text-align: center;
  font-size: 20px;

  .color {
    color: #199816;
  }
`;

const Participant = styled.div`
  display: grid;
  grid-template-columns: 400px 400px;
  grid-template-rows: 250px;
  column-gap: 40px;
  margin-top: 10px;
  justify-content: center;

  .participant {
    background-color: white;
  }
`;

const ItsCamera = styled.div`
  margin-top: 10px;
  display: grid;
  grid-template-columns: 260px 260px 260px;
  grid-template-rows: 180px;
  justify-content: center;
  column-gap: 40px;

  .opportunity {
    align-self: center;
    text-align: -webkit-center;
  }

  .it {
    background-color: white;
  }

  .stop {
    align-self: center;
  }
`;
const videoConstraints = {
  height: window.innerHeight / 2,
  width: window.innerWidth / 2,
};

export default It;
