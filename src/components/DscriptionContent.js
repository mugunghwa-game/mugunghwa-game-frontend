import PropTypes from "prop-types";
import React from "react";

import useStore from "../store/store";
import { socket } from "../utils/socket";

function DescriptionContent({
  participantUser,
  isSingleMode,
  isReadySingleMode,
}) {
  const { fistParticipantPreparation, secondParticipantPreparation, it } =
    useStore();

  return (
    <>
      {it[0] === socket.id && (
        <>
          {fistParticipantPreparation && secondParticipantPreparation ? (
            <>
              <div>
                <span className="color">무궁화 꽃이 피었습니다</span> 라고 외친
                후<span className="color"> 멈춤</span> 버튼을 눌러주세요
              </div>
              <div>
                버튼 누른 후 <span className="color"> 3초</span> 동안 참가자들의
                움직임이 감지됩니다
              </div>
            </>
          ) : (
            <span className="color">
              참가자들이 위치로 갈 때까지 잠시만 기다려주세요
            </span>
          )}
        </>
      )}
      {(participantUser &&
        participantUser[0].id === socket.id &&
        fistParticipantPreparation) ||
      (participantUser &&
        participantUser[1].id === socket.id &&
        secondParticipantPreparation) ||
      isReadySingleMode ? (
        <>
          <div>
            술래가 <span className="color">무궁화 꽃이 피었습니다</span>를
            외치면
            <span className="color"> 3초</span>간 동작을 멈춰야합니다
          </div>
        </>
      ) : null}
      {(participantUser &&
        participantUser[0].id === socket.id &&
        !fistParticipantPreparation) ||
      (participantUser &&
        participantUser[1].id === socket.id &&
        !secondParticipantPreparation) ||
      isSingleMode ? (
        <span className="color">카메라 앞에서 10 발자국 뒤로 물러서세요</span>
      ) : null}
    </>
  );
}

DescriptionContent.propTypes = {
  participantUser: PropTypes.any,
  isSingleMode: PropTypes.bool,
  isReadySingleMode: PropTypes.bool,
};

export default DescriptionContent;
