import PropTypes from "prop-types";
import React from "react";
import styled from "styled-components";

function DefaultPage({ children }) {
  return (
    <div>
      <Background>
        <Content>{children}</Content>
      </Background>
    </div>
  );
}

const Background = styled.div`
  position: absolute;
  display: flex;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #fdf3ef;
`;

const Content = styled.div`
  position: absolute;
  width: 80%;
  height: 80%;
  border-radius: 20px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #ffecec;
`;

DefaultPage.propTypes = {
  children: PropTypes.any,
};

export default DefaultPage;
