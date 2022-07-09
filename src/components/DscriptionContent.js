import React from "react";

import useStore from "../store/store";
import { socket } from "../utils/socket";

function DescriptionContent({ user, participantUser }) {
  const { fistParticipantPreparation, secondParticipantPreparation } =
    useStore();

  return (
    <div>
      {user && user[0] === socket.id && (
        <>
          {fistParticipantPreparation && secondParticipantPreparation ? (
            <>
              <div>
                <span className="color">무궁화 꽃이 피었습니다</span> 라고 외친
                후<span className="color"> 멈춤</span> 버튼을 눌러주세요
              </div>
              <div>
                버튼 누른 후 <span className="color"> 3초</span> 동안 다른
                참가자들의 움직임이 감지됩니다
              </div>
            </>
          ) : (
            <span className="color">
              참가자들에게 뒤로 더 물러나라고 해주세요
            </span>
          )}
        </>
      )}
      {(participantUser[0].id === socket.id && fistParticipantPreparation) ||
      (participantUser[1].id === socket.id && secondParticipantPreparation) ? (
        <>
          <div>
            술래가 <span className="color">무궁화 꽃이 피었습니다</span>를
            외치면
            <span className="color"> 3초</span>간 동작을 멈춰야합니다
          </div>
        </>
      ) : null}
      {(participantUser[0].id === socket.id && !fistParticipantPreparation) ||
      (participantUser[1].id === socket.id && !secondParticipantPreparation) ? (
        <span className="color">
          지금 위치한 곳보다 뒤로 물러나서 바르게 서주세요
        </span>
      ) : null}
    </div>
  );
}

export default DescriptionContent;
