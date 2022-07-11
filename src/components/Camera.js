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
  const anotherUserRef = useRef(null);

  const Video = (props) => {
    useEffect(() => {
      props.peer.on("stream", (stream) => {
        anotherUserRef.current.srcObject = stream;
      });
    }, []);

    return (
      <>
        <Webcam className="two" playsInline autoPlay ref={anotherUserRef} />
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
                <span>
                  {index}남은 기회의 수 {participantUser[index].opportunity}
                </span>
              </div>
            ) : null
          )}
        {itUser && itUser[0] === socket.id && (
          <div>
            <span className="me">나 </span>
            술래 남은기회의 수<span className="count">{itCount}</span>
          </div>
        )}
        <Webcam className="one" ref={userVideo} autoPlay playsInline />
        {itUser && socket.id !== itUser[0] && (
          <canvas className="one" ref={userCanvas} />
        )}
      </div>
      <div>
        {peers && peers.map((peer, index) => <Video key={index} peer={peer} />)}
      </div>
    </>
  );
}

export default Camera;
