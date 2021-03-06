import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";

import flower1 from "../asset/flower1.png";
import flower2 from "../asset/flower2.png";
import flower3 from "../asset/flower3.png";
import flower4 from "../asset/flower4.png";
import flower5 from "../asset/flower5.png";
import DefaultPage from "./DefaultPage";

function Countdown() {
  const navigate = useNavigate();
  const { roomId } = useParams();

  const [flower, setFlower] = useState([]);
  const flowers = [flower1, flower2, flower3, flower4, flower5];
  const count = [0, 1, 2, 3, 4, 5];

  useEffect(() => {
    count.forEach((number) =>
      setTimeout(
        () => setFlower(flowers.slice(0, flowers.length - number)),
        1000 * number
      )
    );

    setTimeout(() => navigate(`/game/${roomId}`), 5500);
  }, []);

  return (
    <DefaultPage>
      <Content>
        <div>잠시 후 게임이 시작됩니다</div>
      </Content>
      <Img>
        {flower.map((eachFlower) => (
          <img key={eachFlower} src={eachFlower} alt={eachFlower} />
        ))}
      </Img>
    </DefaultPage>
  );
}

const Content = styled.div`
  margin-top: 10vh;
  text-align: center;
  font-size: 5vh;
`;

const Img = styled.div`
  margin-top: 15vh;
  margin-left: 6vh;

  img {
    width: 30vh;
    height: 25vh;
  }
`;

export default Countdown;
