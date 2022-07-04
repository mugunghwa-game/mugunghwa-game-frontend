export const RULE_DESCRIPTION = (() => (
  <div>
    1.술래와 참가자를 선택할 수 있습니다.
    <br />
    2. 술래는 난이도(쉬움, 어려움)를 선택할 수 있습니다.
    <br />
    3. 술래는 5번의 기회를 가지며 참가자는 3번의 기회를 가지게 됩니다
    <br />
    4. 술래는 “무궁화 꽃이 피었습니다!”라고 외친 후 멈춤 버튼을 누를 수
    있습니다.
    <br />
    5. 술래는 멈춤 버튼을 누른 후 3초 동안 참가자의 움직임을 감지할 수 있습니다.
    <br />
    6. 이때 움직임이 감지된 참가자는 기회가 1번 없어집니다.
    <br />
    7. 술래는 5번의 기회동안 참가자들을 모두 탈락 시키면 이기게 됩니다.
    <br /> 8. 참가자는 끝까지 살아남게되면 이기게 됩니다
  </div>
))();

export const SOCKET = {
  ROOM_NAME: "gameRoom",
  JOIN_ROOM: "join-room",
  SOCKET_ID: "socket-id",
  USER_COUNT: "user-count",
  ROLE_COUNT: "role-count",
  ROLE_COUNTS: "role-counts",
  READY: "ready",
  START: "start",
};
