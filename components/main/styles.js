import styled, { createGlobalStyle, keyframes, css } from "styled-components";

const driftX = keyframes`
  0%   { transform: translateX(calc(var(--dx, 22px) * -1)); }
  50%  { transform: translateX(calc(var(--dx, 22px) * 0.6)); }
  100% { transform: translateX(var(--dx, 22px)); }
`;

const floaty = keyframes`
  0%   { transform: translateY(0) rotate(var(--rot, 0.2deg)) scale(var(--scale, 1)); }
  50%  { transform: translateY(calc(var(--dy, 14px) * -0.6)) rotate(calc(var(--rot, 0.2deg) * -0.6)) scale(calc(var(--scale, 1) * 1.005)); }
  100% { transform: translateY(calc(var(--dy, 14px) * -1)) rotate(calc(var(--rot, 0.2deg) * -1)) scale(calc(var(--scale, 1) * 1.01)); }
`;

const breath = keyframes`
  0%,100% { opacity: 0.96; }
  50%     { opacity: 1; }
`;

export const GlobalStyles = createGlobalStyle`
  .cloudWrap { cursor: grab; touch-action: none; will-change: transform; }
  .cloudWrap:active { cursor: grabbing; }
  .cloudImg { user-select: none; -webkit-user-drag: none; will-change: transform, opacity; }
  .jackWrap { cursor: default; touch-action: auto; }
  .jackWrap:active { cursor: default; }

  /* Per-cloud parameters (top clouds) - 실제로 '움직이는 게 보이도록' 속도 조금 올리기 */
  .cloud1 { --dx: 26px; --dy: 16px; animation: ${driftX} 18s ease-in-out infinite alternate; }
  .cloud2 { --dx: 28px; --dy: 18px; animation: ${driftX} 20s ease-in-out infinite alternate -2s; }
  .cloud3 { --dx: 24px; --dy: 15px; animation: ${driftX} 16s ease-in-out infinite alternate -3s; }
  .cloud4 { --dx: 30px; --dy: 20px; animation: ${driftX} 22s ease-in-out infinite alternate -3.5s; }
  .cloud5 { --dx: 22px; --dy: 14px; animation: ${driftX} 16s ease-in-out infinite alternate -1.5s; }

  .cloudImg1 { --rot: 0.25deg; --scale: 1.004; animation: ${floaty} 8s ease-in-out infinite alternate; }
  .cloudImg2 { --rot: 0.22deg; --scale: 1.003; animation: ${floaty} 7s ease-in-out infinite alternate; }
  .cloudImg3 { --rot: 0.24deg; --scale: 1.003; animation: ${floaty} 7.5s ease-in-out infinite alternate; }
  .cloudImg4 { --rot: 0.28deg; --scale: 1.005; animation: ${floaty} 9s ease-in-out infinite alternate; }
  .cloudImg5 { --rot: 0.2deg;  --scale: 1.002; animation: ${floaty} 6.5s ease-in-out infinite alternate; }

  .doorHotspot:hover { outline: 2px dashed rgba(0,0,0,0.25); outline-offset: 2px; }
`;

export const Main = styled.main`
  margin: 0;
  padding: 0;
  min-height: 100vh;
  background-color: #ffffff;
  background-image: url('/배경.png');
  background-repeat: no-repeat;
  background-position: center top;
  background-size: 100% auto;
  overflow-y: auto;
  overflow-x: hidden;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: flex-start;
`;

export const CloudWrap = styled.div`
  position: absolute;
  pointer-events: auto;
  z-index: ${(p) => p.$zIndex ?? 5};
  opacity: ${(p) => (p.$opacity === undefined ? 1 : p.$opacity)};
  top: ${(p) => (typeof p.$top === "number" ? `${p.$top}px` : p.$top)};
  left: ${(p) => (typeof p.$left === "number" ? `${p.$left}px` : p.$left)};
  width: ${(p) => (typeof p.$width === "number" ? `${p.$width}px` : p.$width)};
  max-width: ${(p) => (typeof p.$maxWidth === "number" ? `${p.$maxWidth}px` : p.$maxWidth)};
  ${(p) =>
    p.$driftDuration
      ? css`animation: ${driftX} ${p.$driftDuration} ease-in-out infinite alternate;`
      : ""}
`;

export const CloudImg = styled.img`
  display: block;
  width: 100%;
  height: auto;
  ${(p) =>
    p.$floatDuration
      ? css`animation: ${floaty} ${p.$floatDuration} ease-in-out infinite alternate;`
      : ""}
`;

export const JackWrap = styled.div`
  position: relative;
  width: 100vw;
  height: auto;
  z-index: 2;
`;

export const JackImg = styled.img`
  display: block;
  width: 100%;
  height: auto;
  user-select: none;
  -webkit-user-drag: none;
  touch-action: auto;
`;

export const DoorHotspot = styled.a`
  position: absolute;
  transform: translate(-50%, -50%);
  border-radius: 12px;
  background: transparent;
  display: block;
  cursor: pointer;
  top: ${(p) => p.$top};
  left: ${(p) => p.$left};
  width: ${(p) => p.$width};
  height: ${(p) => p.$height};
`;


