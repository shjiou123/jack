import { useRef, useCallback } from "react";
import { useRouter } from "next/router";
import styled, { keyframes } from "styled-components";

const OpenContainer = styled.main`
  width: 100vw;
  height: 100vh;
  margin: 0;
  padding: 0;
  overflow: hidden;
  background: #fff;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const driftX = keyframes`
  0%   { transform: translateX(-40px); }
  50%  { transform: translateX(16px); }
  100% { transform: translateX(40px); }
`;

const floatY = keyframes`
  0%   { transform: translateY(0px) scale(1); }
  50%  { transform: translateY(-8px) scale(1.01); }
  100% { transform: translateY(-14px) scale(1.015); }
`;

const CloudWrap = styled.div`
  position: absolute;
  top: ${(p) => p.$top};
  left: ${(p) => p.$left};
  width: ${(p) => p.$width};
  max-width: 520px;
  /* 구름을 드래그할 수 있도록 클릭 가능하게 */
  pointer-events: auto;
  z-index: 2;
  cursor: grab;
  &.dragging {
    cursor: grabbing;
  }
  animation: ${driftX} ${(p) => p.$drift || 20}s cubic-bezier(.42, 0, .58, 1) infinite alternate;
  animation-delay: ${(p) => p.$delay || "0s"};
`;

const CloudImg = styled.img`
  display: block;
  width: 100%;
  height: auto;
  animation: ${floatY} ${(p) => p.$float || 8}s ease-in-out infinite alternate;
  animation-delay: ${(p) => p.$delay || "0s"};
`;

const HouseImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  z-index: 1;
`;

const EnterButton = styled.button`
  position: fixed;
  bottom: 7%;
  left: 50%;
  transform: translateX(-50%);
  background: transparent;
  border: 3px solid transparent;
  border-radius: 50px;
  padding: 16px 32px;
  font-size: 1.2rem;
  font-weight: 800;
  color: #000;
  cursor: pointer;
  z-index: 100;
  box-shadow: none;
  transition: transform 0.15s ease;

  &:hover {
    transform: translateX(-50%) scale(1.02);
  }
  &:active {
    transform: translateX(-50%) scale(0.98);
  }
`;

export default function OpenDoorView() {
  const router = useRouter();
  const containerRef = useRef(null);
  const draggingElRef = useRef(null);
  const dragStateRef = useRef({
    offsetX: 0,
    offsetY: 0,
    containerLeft: 0,
    containerTop: 0,
  });
  const dragPosRef = useRef({ left: 0, top: 0 });
  const dragRafIdRef = useRef(null);

  const handlePointerMove = useCallback((e) => {
    const el = draggingElRef.current;
    if (!el) return;

    const { offsetX, offsetY, containerLeft, containerTop } = dragStateRef.current;
    const desiredLeft = e.clientX - offsetX - containerLeft;
    const desiredTop = e.clientY - offsetY - containerTop;

    // rAF로 묶어서 프레임당 한 번만 DOM 업데이트
    dragPosRef.current = { left: desiredLeft, top: desiredTop };
    if (dragRafIdRef.current != null) return;

    dragRafIdRef.current = window.requestAnimationFrame(() => {
      const current = draggingElRef.current;
      if (!current) {
        dragRafIdRef.current = null;
        return;
      }
      const { left, top } = dragPosRef.current;
      current.style.left = `${left}px`;
      current.style.top = `${top}px`;
      dragRafIdRef.current = null;
    });
  }, []);

  const resumeAnim = (el) => {
    if (!el) return;
    el.style.animationPlayState = "running";
    const img = el.querySelector("img");
    if (img) img.style.animationPlayState = "running";
    el.classList.remove("dragging");
  };

  const handlePointerUp = useCallback(() => {
    const el = draggingElRef.current;
    if (el) {
      resumeAnim(el);
    }
    draggingElRef.current = null;
    if (dragRafIdRef.current != null) {
      window.cancelAnimationFrame(dragRafIdRef.current);
      dragRafIdRef.current = null;
    }
    window.removeEventListener("pointermove", handlePointerMove);
    window.removeEventListener("pointerup", handlePointerUp);
    window.removeEventListener("pointercancel", handlePointerUp);
    window.removeEventListener("blur", handlePointerUp);
  }, [handlePointerMove]);

  const handlePointerDown = useCallback(
    (e) => {
      const target = e.target.closest?.(".openCloud");
      if (!target) return;
      e.preventDefault();

      try {
        target.setPointerCapture && target.setPointerCapture(e.pointerId);
      } catch {}

      const container = containerRef.current;
      if (!container) return;

      const containerRect = container.getBoundingClientRect();
      const rect = target.getBoundingClientRect();

      draggingElRef.current = target;
      dragStateRef.current = {
        offsetX: e.clientX - rect.left,
        offsetY: e.clientY - rect.top,
        containerLeft: containerRect.left,
        containerTop: containerRect.top,
      };

      // 드래그 중에는 애니메이션 잠시 정지
      target.style.animationPlayState = "paused";
      const img = target.querySelector("img");
      if (img) img.style.animationPlayState = "paused";
      target.classList.add("dragging");

      window.addEventListener("pointermove", handlePointerMove);
      window.addEventListener("pointerup", handlePointerUp);
      window.addEventListener("pointercancel", handlePointerUp);
      window.addEventListener("blur", handlePointerUp);
    },
    [handlePointerMove, handlePointerUp]
  );

  // 입장 전 화면 주변에 떠다니는 구름들 (이미지당 2~3개, 조금 더 작게/빠르게)
  const ambientClouds = [
    // 구름_1
    { src: "/cloud/구름_1.png", top: "10%", left: "20%", width: "18%", drift: 12, float: 6.5, delayWrap: "-3s", delayImg: "-1.5s" },
    { src: "/cloud/구름_1.png", top: "60%", left: "8%", width: "16%", drift: 10, float: 5.8, delayWrap: "-5s", delayImg: "-2s" },
    // 구름_2
    { src: "/cloud/구름_2.png", top: "16%", left: "70%", width: "20%", drift: 13, float: 7.0, delayWrap: "-4s", delayImg: "-2.3s" },
    { src: "/cloud/구름_2.png", top: "72%", left: "66%", width: "18%", drift: 11, float: 6.0, delayWrap: "-6s", delayImg: "-3s" },
    // 구름_4
    { src: "/cloud/구름_4.png", top: "40%", left: "6%", width: "22%", drift: 14, float: 7.2, delayWrap: "-7s", delayImg: "-3.5s" },
    { src: "/cloud/구름_4.png", top: "44%", left: "70%", width: "20%", drift: 12, float: 6.4, delayWrap: "-2s", delayImg: "-1s" },
    // 구름
    { src: "/cloud/구름.png", top: "26%", left: "40%", width: "22%", drift: 13, float: 7.5, delayWrap: "-5.5s", delayImg: "-2.7s" },
    { src: "/cloud/구름.png", top: "80%", left: "42%", width: "20%", drift: 11, float: 6.2, delayWrap: "-3.8s", delayImg: "-1.8s" },
  ];

  return (
    <OpenContainer ref={containerRef} onPointerDown={handlePointerDown}>
      {ambientClouds.map((c, idx) => (
        <CloudWrap
          key={idx}
          className="openCloud"
          $top={c.top}
          $left={c.left}
          $width={c.width}
          $drift={c.drift}
          $delay={c.delayWrap}
        >
          <CloudImg
            src={c.src}
            alt="Cloud"
            $float={c.float}
            $delay={c.delayImg}
          />
        </CloudWrap>
      ))}
      <HouseImage src="/open.png" alt="Open Door" />
      <EnterButton aria-label="입장하기" onClick={() => router.push("/main")} />
    </OpenContainer>
  );
}
