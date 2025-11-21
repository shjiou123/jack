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
/* Pure opacity fade (no movement/scale) for perfectly in-place disappear */
const fadeOutOnly = keyframes`
  0% { opacity: 1; }
  100% { opacity: 0; }
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

/* Speech balloon */
const fadeIn = keyframes`
  0% { opacity: 0; transform: translate(-50%, -46%) scale(0.98); }
  100% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
`;

export const BalloonWrap = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 20;
  pointer-events: auto;
  animation: ${fadeIn} 220ms ease-out both;
  width: 100vw;
  max-width: 100vw;
  max-height: 95vh;
  &.closing {
    animation: ${fadeOutOnly} 400ms ease-out forwards;
    pointer-events: none;
  }
`;

export const BalloonImg = styled.img`
  display: block;
  width: 100%;
  height: auto;
  max-width: 100vw;
  max-height: 95vh;
  object-fit: contain;
  user-select: none;
  -webkit-user-drag: none;
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
    animation: ${softFade} 0.5s ease-out forwards;
    pointer-events: none;
  }
  /* Avoid forward ref issues by targeting the img directly */
  &.popping img {
    animation: ${softFade} 0.5s ease-out forwards;
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
    animation: ${softFade} 0.5s ease-out forwards;
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
    animation: ${softFade} 0.5s ease-out forwards;
  }
`;


