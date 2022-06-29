import React from "react";
import styled from "styled-components";

function Button({ children }) {
  return <ButtonBody>{children}</ButtonBody>;
}

const ButtonBody = styled.button`
  width: 300px;
  height: 70px;
  background-color: #fbe6ce;
  color: #199816;
  font-size: 25px;
  border-radius: 20px;
  border-style: none;
`;

export default Button;
