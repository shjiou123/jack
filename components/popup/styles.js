import styled, { createGlobalStyle, keyframes, css } from "styled-components";

const driftX = keyframes`
  0%   { transform: translateX(calc(var(--dx, 18px) * -1)); }
  50%  { transform: translateX(calc(var(--dx, 18px) * 0.5)); }
  100% { transform: translateX(var(--dx, 18px)); }
`;

const floaty = keyframes`
  0%   { transform: translateY(0) scale(1); }
  50%  { transform: translateY(calc(var(--dy, 16px) * -0.5)) scale(1.02); }
  100% { transform: translateY(calc(var(--dy, 16px) * -1)) scale(1.04); }
`;

const breath = keyframes`
  0%,100% { opacity: 0.9; }
  50% { opacity: 1; }
`;

export const GlobalStyles = createGlobalStyle``;

export const Main = styled.main`
  margin: 0;
  padding: 0;
  min-height: 100vh;
  background-color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const HouseWrap = styled.div`
  position: relative;
  display: inline-block;
  max-width: 95vw;
  max-height: 95vh;
`;

export const HouseImg = styled.img`
  width: 100%;
  height: auto;
  display: block;
`;

export const Bubble = styled.div`
  position: absolute;
  transform: translate(-50%, -50%);
  pointer-events: none;
  z-index: 3;
  top: ${(p) => p.$top};
  left: ${(p) => p.$left};
  width: ${(p) => p.$width};
  /* expose motion params via CSS vars for keyframes */
  --dx: ${(p) => p.$dx || '18px'};
  --dy: ${(p) => p.$dy || '16px'};
  ${(p) => p.$dur ? css`animation: ${driftX} ${p.$dur} ease-in-out infinite alternate;` : ''}
`;

export const BubbleImg = styled.img`
  width: 100%;
  height: auto;
  display: block;
  user-select: none;
  -webkit-user-drag: none;
  ${(p) => p.$float ? css`animation: ${floaty} ${p.$float} ease-in-out infinite alternate, ${breath} 10s ease-in-out infinite;` : ''}
`;

export const CloseButton = styled.button`
  position: fixed;
  top: 16px;
  right: 16px;
  background: #111;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 8px 12px;
  cursor: pointer;
`;


