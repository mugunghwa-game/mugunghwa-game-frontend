import React from "react";

function DescriptionContent({ user }) {
  return (
    <div>
      {user && (
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
      )}
      {!user && (
        <>
          <div>
            술래가 <span className="color">무궁화 꽃이 피었습니다</span>를
            외치면
            <span className="color"> 3초</span>간 동작을 멈춰야합니다
          </div>
        </>
      )}
    </div>
  );
}

export default DescriptionContent;
