import styled, { createGlobalStyle, keyframes, css } from "styled-components";

// 수평 드리프트 대신, 빗방울이 위에서 아래로 떨어지는 애니메이션
const fallY = keyframes`
  0% {
    transform: translate(-50%, -120vh);
    opacity: 0;
  }
  15% {
    opacity: 1;
  }
  100% {
    transform: translate(-50%, 120vh);
    opacity: 0.95;
  }
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

// popup3의 연기처럼, 커튼이 좌우로 열리며 사라지는 애니메이션
const curtainOpenLeft = keyframes`
  0% {
    transform: translateX(0);
    opacity: 1;
  }
  100% {
    transform: translateX(-40vw);
    opacity: 0;
  }
`;

const curtainOpenRight = keyframes`
  0% {
    transform: translateX(0);
    opacity: 1;
  }
  100% {
    transform: translateX(40vw);
    opacity: 0;
  }
`;

/* Inward-only drift/float so edges never reveal gaps */
const burstDriftInTL = keyframes`
  0%   { transform: translateX(0); }
  50%  { transform: translateX(calc(var(--bDx, 14px) * 0.6)); }
  100% { transform: translateX(var(--bDx, 14px)); }
`;

const burstDriftInBR = keyframes`
  0%   { transform: translateX(0); }
  50%  { transform: translateX(calc(var(--bDx, 14px) * -0.6)); }
  100% { transform: translateX(calc(var(--bDx, 14px) * -1)); }
`;

const burstPanLeft = keyframes`
  0%   { transform: translateX(0) scale(var(--bScale, 1.06)); }
  100% { transform: translateX(calc(-1 * var(--bPan, 5vw))) scale(var(--bScale, 1.06)); }
`;

const popOut = keyframes`
  0%   { transform: scale(1); opacity: 1; filter: blur(0px); }
  60%  { transform: scale(1.14); opacity: 0.7; filter: blur(0.5px); }
  100% { transform: scale(1.24); opacity: 0; filter: blur(2px); }
`;

const burstPanRight = keyframes`
  0%   { transform: translateX(0) scale(var(--bScale, 1.06)); }
  100% { transform: translateX(var(--bPan, 5vw)) scale(var(--bScale, 1.06)); }
`;
/* Gentle fade-out for clusters */
const softFade = keyframes`
  0%   { opacity: 1; transform: scale(1); filter: blur(0); }
  100% { opacity: 0; transform: scale(1.02); filter: blur(0.4px); }
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
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 0;
`;

export const HouseImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
`;

// 화면 전체를 덮고, 자연스럽게 좌우로 열리는 커튼 이미지
export const CurtainImgLeft = styled.img`
  position: absolute;
  inset: 0;
  width: 100vw;
  height: 100vh;
  object-fit: cover; /* 화면 비율에 딱 맞춰서 시작 */
  pointer-events: none;
  z-index: 8; /* 배경/빗방울 위에, 닫기 버튼 아래에 오도록 */
  animation: ${curtainOpenLeft} 4s ease-out forwards;
`;

export const CurtainImgRight = styled(CurtainImgLeft)`
  animation: ${curtainOpenRight} 4s ease-out forwards;
`;

export const Bubble = styled.div`
  position: absolute;
  transform: translate(-50%, -50%);
  pointer-events: auto;
  z-index: 3;
  top: ${(p) => p.$top};
  left: ${(p) => p.$left};
  width: ${(p) => p.$width};
  /* 수직 낙하 애니메이션 (이전보다 속도를 절반 정도로 늦추기 위해 duration을 0.9배로 조정) */
  ${(p) => {
    if (!p.$dur) return "";
    const base = parseFloat(String(p.$dur));
    const dur = Number.isFinite(base) ? `${(base * 0.9).toFixed(2)}s` : p.$dur;
    return css`animation: ${fallY} ${dur} linear infinite;`;
  }}
  &.popping {
    animation: ${popOut} 320ms cubic-bezier(.2,.8,.2,1) forwards !important;
    pointer-events: none;
  }
`;

export const BubbleImg = styled.img`
  width: 100%;
  height: auto;
  display: block;
  user-select: none;
  -webkit-user-drag: none;
  /* 빗방울은 하강 애니메이션만 사용하고, 추가 플로팅은 제거 */
  ${(p) => p.$float ? css`animation: ${breath} 8s ease-in-out infinite;` : ''}
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
  overflow: hidden;
  /* Wrapper stays pinned; no wrapper drift to avoid exposing edges */
  animation: none;
  &.popping {
    animation: ${softFade} 1.5s ease-out forwards;
    pointer-events: none;
  }
  /* Avoid forward ref issues by targeting the img directly */
  &.popping img {
    animation: ${softFade} 1.5s ease-out forwards;
  }
`;

export const BurstImg = styled.img`
  display: block;
  width: 100%;
  height: auto;
  user-select: none;
  -webkit-user-drag: none;
  --bPan: 5vw;
  --bScale: 1.08;
  will-change: transform;
  animation: ${burstPanLeft} var(--bDurY, 26s) ease-in-out infinite alternate;
`;

export const BurstWrapBR = styled(BurstWrap)`
  top: auto;
  left: auto;
  right: 0;
  bottom: 0;
  transform-origin: bottom right;
  animation: none;
  &.popping img {
    animation: ${softFade} 1.5s ease-out forwards;
  }
`;

export const BurstWrapTR = styled(BurstWrap)`
  left: auto;
  right: 0;
  bottom: auto;
  top: 0;
  z-index: 12; /* highest among clusters */
  transform-origin: top right;
  & ${BurstImg} {
    animation: ${burstPanRight} var(--bDurY, 26s) ease-in-out infinite alternate;
  }
  &.popping img {
    animation: ${softFade} 1.5s ease-out forwards;
  }
`;


