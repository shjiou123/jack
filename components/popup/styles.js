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

const burstDriftX = keyframes`
  0%   { transform: translateX(calc(var(--bDx, 14px) * -1)); }
  50%  { transform: translateX(calc(var(--bDx, 14px) * 0.5)); }
  100% { transform: translateX(var(--bDx, 14px)); }
`;

const burstFloatY = keyframes`
  0%   { transform: translateY(0) rotate(0.05deg) }
  50%  { transform: translateY(calc(var(--bDy, 10px) * -0.6)) rotate(-0.05deg) }
  100% { transform: translateY(calc(var(--bDy, 10px) * -1)) rotate(-0.1deg) }
`;

const popOut = keyframes`
  0%   { transform: scale(1); opacity: 1; filter: blur(0px); }
  60%  { transform: scale(1.14); opacity: 0.7; filter: blur(0.5px); }
  100% { transform: scale(1.24); opacity: 0; filter: blur(2px); }
`;

export const GlobalStyles = createGlobalStyle`
  .bubbleWrap { cursor: grab; touch-action: none; }
  .bubbleWrap:active { cursor: grabbing; }
  .bubbleImg { user-select: none; -webkit-user-drag: none; }
`;

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
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100vw;
  z-index: 0;
`;

export const HouseImg = styled.img`
  width: 100%;
  height: auto;
  display: block;
`;

export const Bubble = styled.div`
  position: absolute;
  transform: translate(-50%, -50%);
  pointer-events: auto;
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

/* Top-left burst cluster */
export const BurstWrap = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  z-index: 10;
  pointer-events: auto;
  /* Responsive sizing tied directly to viewport so corner stays filled */
  width: ${(p) => p.$width || '192vmin'}; /* 3x bigger than before */
  max-width: none;
  transform-origin: top left;
  will-change: transform, opacity, filter;
  --bDx: 16px;
  animation: ${burstDriftX} var(--bDurX, 24s) ease-in-out infinite alternate;
  &.popping {
    animation: ${popOut} 320ms cubic-bezier(.2,.8,.2,1) forwards;
    pointer-events: none;
  }
`;

export const BurstImg = styled.img`
  display: block;
  width: 100%;
  height: auto;
  user-select: none;
  -webkit-user-drag: none;
  --bDy: 12px;
  animation: ${burstFloatY} var(--bDurY, 20s) ease-in-out infinite alternate;
`;

export const BurstWrapBR = styled(BurstWrap)`
  top: auto;
  left: auto;
  right: 0;
  bottom: 0;
  transform-origin: bottom right;
`;


