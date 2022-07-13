import React, { useEffect, useRef } from "react";
import Webcam from "react-webcam";

import useStore from "../store/store";
import { socket } from "../utils/socket";

function Camera({
  userVideo,
  userCanvas,
  itUser,
  peers,
  participantUser,
  itCount,
}) {
  const { fistParticipantPreparation, secondParticipantPreparation } =
    useStore();

  const Video = (props) => {
    const anotherUserRef = useRef(null);
    console.log(props, "props");
    useEffect(() => {
      props.peer.on("stream", (stream) => {
        console.log("stream", stream);
        anotherUserRef.current.srcObject = stream;
      });
    }, []);

    return (
      <>
        <Webcam
          className="anotherUser"
          playsInline
          autoPlay
          ref={anotherUserRef}
        />
      </>
    );
  };

  return (
    <>
      <div>
        {participantUser &&
          participantUser.map((item, index) =>
            item.id === socket.id ? (
              <div key={index}>
                <span className="me">나 </span>
                참가자
                {fistParticipantPreparation && secondParticipantPreparation && (
                  <span>
                    {index}남은 기회의 수 {participantUser[index].opportunity}
                  </span>
                )}
              </div>
            ) : null
          )}
        {itUser && itUser[0] === socket.id && (
          <div>
            <span className="me">나 </span>
            <span> 술래</span>
            {fistParticipantPreparation && secondParticipantPreparation ? (
              <span className="count">남은기회의 수{itCount}</span>
            ) : null}
          </div>
        )}
        <Webcam className="user" ref={userVideo} autoPlay playsInline />
        {itUser && socket.id !== itUser[0] && (
          <canvas className="user" ref={userCanvas} />
        )}
      </div>
      <div>
        {peers && peers.map((peer, index) => <Video key={index} peer={peer} />)}
      </div>
    </>
  );
}

export default Camera;
