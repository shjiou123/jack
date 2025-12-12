import { useRef, useCallback, useState, useEffect } from "react";
import { GlobalStyles, Main, HouseWrap, HouseImg, Bubble, BubbleImg, CloseButton, BurstWrap, BurstImg, BurstWrapBR, BurstWrapTR, BalloonWrap, BalloonImg } from "./styles";
///위치: array constant 빼기

export default function PopupView() {
  const draggingElRef = useRef(null);
  const startRef = useRef({ x: 0, y: 0, left: 0, top: 0 });
  const dragRafIdRef = useRef(null);
  const dragDeltaRef = useRef({ dx: 0, dy: 0 });
  const [burstPopping, setBurstPopping] = useState(false);
  const [burstVisible, setBurstVisible] = useState(true);
  const [burst2Popping, setBurst2Popping] = useState(false);
  const [burst2Visible, setBurst2Visible] = useState(true);
  const [burst3Popping, setBurst3Popping] = useState(false);
  const [burst3Visible, setBurst3Visible] = useState(true);
  const [showBalloon, setShowBalloon] = useState(false);
  const [balloonClosing, setBalloonClosing] = useState(false); // 남겨두지만 더 이상 사용하진 않음
  const [footFrame, setFootFrame] = useState(0);
  const [storyFinished, setStoryFinished] = useState(false); // 한 번 끝나면 다시 열리지 않도록

  // 방문 플래그 설정 (메인 페이지에서 배경 전환용)
  useEffect(() => {
    const handleBeforeUnload = () => {
      try {
        window.localStorage.setItem("visitedPopup", "true");
      } catch {}
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  // Auto-pop clusters after ~3s (staggered slightly)
  useEffect(() => {
    if (!burstVisible) return;
    const t = setTimeout(() => setBurstPopping(true), 3000);
    return () => clearTimeout(t);
  }, [burstVisible]);
  useEffect(() => {
    if (!burst2Visible) return;
    const t = setTimeout(() => setBurst2Popping(true), 3400);
    return () => clearTimeout(t);
  }, [burst2Visible]);
  useEffect(() => {
    if (!burst3Visible) return;
    const t = setTimeout(() => setBurst3Popping(true), 3800);
    return () => clearTimeout(t);
  }, [burst3Visible]);

  // Safety fallback: hide even if animationend doesn’t fire
  useEffect(() => {
    if (!burstPopping || !burstVisible) return;
    const t = setTimeout(() => setBurstVisible(false), 1600);
    return () => clearTimeout(t);
  }, [burstPopping, burstVisible]);
  useEffect(() => {
    if (!burst2Popping || !burst2Visible) return;
    const t = setTimeout(() => setBurst2Visible(false), 1600);
    return () => clearTimeout(t);
  }, [burst2Popping, burst2Visible]);
  useEffect(() => {
    if (!burst3Popping || !burst3Visible) return;
    const t = setTimeout(() => setBurst3Visible(false), 1600);
    return () => clearTimeout(t);
  }, [burst3Popping, burst3Visible]);
  const [bubbleState, setBubbleState] = useState({});
  const [allBubbles, setAllBubbles] = useState([]);

  const bubbleVisible = (id) => bubbleState[id]?.visible !== false;
  const handleBubbleClick = (id) => {
    setBubbleState((s) => ({ ...s, [id]: { ...(s[id] || {}), popping: true } }));
  };
  const handleBubbleAnimEnd = (id) => {
    setBubbleState((s) => ({ ...s, [id]: { ...(s[id] || {}), visible: false } }));
  };

  // 버블들: 화면 전체에 랜덤 배치, 새로고침마다 새 위치/크기/속도
  useEffect(() => {
    const rand = (min, max) => Math.random() * (max - min) + min;
    const imgs = [
      "/bubble/bubble_1.png",
      "/bubble/bubble_2.png",
      "/bubble/bubble_3.png",
    ];

    const count = 40; // 화면을 넓게 채우는 정도
    const created = Array.from({ length: count }).map((_, i) => {
      const img = imgs[i % imgs.length];

      // 크기(뷰포트 비율): 작은/중간/큰 버블 비율 조절
      const bucket = Math.random();
      const width =
        bucket < 0.4 ? rand(8, 14) :      // 작은 버블
        bucket < 0.8 ? rand(14, 22) :     // 중간 버블
        rand(22, 30);                     // 큰 버블

      // 위치 - 화면 전체(약간 여백 두고)로 퍼지게
      const top = rand(6, 94);
      const left = rand(6, 94);

      // 움직임 파라미터 (부드러운 플로팅)
      const dx = `${rand(18, 28).toFixed(1)}px`;
      const dy = `${rand(14, 24).toFixed(1)}px`;
      const dur = `${rand(11, 18).toFixed(1)}s`;
      const float = `${rand(4.5, 7.5).toFixed(1)}s`;
      const dWrap = `${(-rand(0, 2)).toFixed(2)}s`;
      const dImg = `${(-rand(0, 2)).toFixed(2)}s`;

      return {
        id: `rb${i}`,
        img,
        top,
        left,
        width,
        dx,
        dy,
        dur,
        float,
        dWrap,
        dImg,
      };
    });

    setAllBubbles(created);
  }, []);

  // Foot story 이미지 시퀀스 (말풍선 이미지를 대체)
  // 말풍선 안에서 순서대로 보여줄 팝업 이미지들
  // 마지막 장(popup1_6)이 끝나면 말풍선이 닫히고,
  // 배경에 깔린 HouseImg(`/foot/foot.png`)만 남는다.
  const footFrames = [
    "/foot/popup1_1.png",
    "/foot/popup1_2.png",
    "/foot/popup1_3.png",
    "/foot/popup1_4.png",
    "/foot/popup1_5.png",
    "/foot/popup1_6.png",
  ];

  const handlePointerMove = useCallback((e) => {
    const el = draggingElRef.current;
    if (!el) return;
    const dx = e.clientX - startRef.current.x;
    const dy = e.clientY - startRef.current.y;

    dragDeltaRef.current = { dx, dy };
    if (dragRafIdRef.current != null) return;

    dragRafIdRef.current = window.requestAnimationFrame(() => {
      const elNow = draggingElRef.current;
      if (!elNow) {
        dragRafIdRef.current = null;
        return;
      }
      const { dx: rdx, dy: rdy } = dragDeltaRef.current;
      // 드래그 중에는 transform만 변경해서 레이아웃 재계산을 줄인다
      elNow.style.transform = `translate3d(${rdx}px, ${rdy}px, 0)`;
      dragRafIdRef.current = null;
    });
  }, []);

  const resumeAnim = (el) => {
    if (!el) return;
    el.style.animationPlayState = "running";
    const img = el.querySelector("img");
    if (img) img.style.animationPlayState = "running";
  };

  const handlePointerUp = useCallback(() => {
    const el = draggingElRef.current;
    if (el) {
      // 마지막 transform 값을 실제 left/top으로 한 번만 반영해서 위치를 고정
      const { dx, dy } = dragDeltaRef.current;
      const finalLeft = startRef.current.left + dx;
      const finalTop = startRef.current.top + dy;
      el.style.left = `${finalLeft}px`;
      el.style.top = `${finalTop}px`;
      el.style.transform = "";
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

  const handlePointerDown = useCallback((e) => {
    const target = e.target.closest?.(".bubbleWrap");
    if (!target) return;
    e.preventDefault();
    try { target.setPointerCapture && target.setPointerCapture(e.pointerId); } catch {}
    draggingElRef.current = target;
    const cs = window.getComputedStyle(target);
    const leftPx = parseFloat(cs.left) || target.offsetLeft || 0;
    const topPx = parseFloat(cs.top) || target.offsetTop || 0;
    startRef.current = { x: e.clientX, y: e.clientY, left: leftPx, top: topPx };
    target.style.animationPlayState = "paused";
    const img = target.querySelector("img");
    if (img) img.style.animationPlayState = "paused";
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
    window.addEventListener("pointercancel", handlePointerUp);
    window.addEventListener("blur", handlePointerUp);
  }, [handlePointerMove, handlePointerUp]);

  return (
    <Main onPointerDown={handlePointerDown}>
      <GlobalStyles />
      <HouseWrap
        className="houseWrap"
        onClick={() => {
          // If balloon is open or 이미 스토리가 끝났으면, 다시 열지 않는다.
          if (showBalloon || storyFinished) return;
          // Only allow balloon after clusters are gone
          if (!burstVisible && !burst2Visible && !burst3Visible) {
            setShowBalloon(true);
          }
        }}
      >
        <HouseImg src="/foot/foot.png" alt="Bathroom Foot Bubbles" />

        {/* Top-left burst cluster anchored to screen ratio */}
        {burstVisible && (
          <BurstWrap
            className={burstPopping ? 'popping' : ''}
            onClick={() => setBurstPopping(true)}
            onAnimationEnd={() => { if (burstPopping) setBurstVisible(false); }}
          >
            <BurstImg src="/bubble/버블뭉치1.png" alt="bubble-burst-cluster" style={{ animationDelay: '-1.2s' }} />
          </BurstWrap>
        )}
        {burst2Visible && (
          <BurstWrapBR
            className={burst2Popping ? 'popping' : ''}
            onClick={() => setBurst2Popping(true)}
            onAnimationEnd={() => { if (burst2Popping) setBurst2Visible(false); }}
          >
            <BurstImg src="/bubble/버블뭉치2.png" alt="bubble-burst-cluster-2" style={{ animationDelay: '-2.0s' }} />
          </BurstWrapBR>
        )}
        {burst3Visible && (
          <BurstWrapTR
            className={burst3Popping ? 'popping' : ''}
            onClick={() => setBurst3Popping(true)}
            onAnimationEnd={() => { if (burst3Popping) setBurst3Visible(false); }}
          >
            <BurstImg src="/bubble/버블뭉치3.png" alt="bubble-burst-cluster-3" style={{ animationDelay: '-1.6s' }} />
          </BurstWrapTR>
        )}

        {showBalloon && (
          <BalloonWrap
            onClick={(e) => {
              e.stopPropagation();
              setFootFrame((prev) => {
                const next = prev + 1;
                if (next >= footFrames.length) {
                  // 마지막까지 본 뒤에는 말풍선 닫기 + 다시 열리지 않도록 플래그 설정
                  setShowBalloon(false);
                  setStoryFinished(true);
                  return prev;
                }
                return next;
              });
            }}
          >
            <BalloonImg
              src={footFrames[footFrame]}
              alt={`foot-story-${footFrame + 1}`}
            />
          </BalloonWrap>
        )}

        {/* Render all bubbles (size doubled, count tripled) */}
        {allBubbles.map((b) => (
          bubbleVisible(b.id) && (
            <Bubble
              key={b.id}
              className={`bubbleWrap ${bubbleState[b.id]?.popping ? 'popping' : ''}`}
              $top={`${b.top}%`}
              $left={`${b.left}%`}
              $width={`${b.width}%`}
              $dx={b.dx}
              $dy={b.dy}
              $dur={b.dur}
              style={{ animationDelay: b.dWrap }}
              onClick={() => handleBubbleClick(b.id)}
              onAnimationEnd={() => handleBubbleAnimEnd(b.id)}
            >
              <BubbleImg
                className="bubbleImg"
                src={b.img}
                alt="bubble"
                $float={b.float}
                style={{ animationDelay: b.dImg }}
              />
            </Bubble>
          )
        ))}
      </HouseWrap>

      <CloseButton
        aria-label="닫기"
        onClick={() => {
          try {
            window.close();
          } catch (e) {
            if (window.history && window.history.back) {
              window.history.back();
            }
          }
        }}
      />
    </Main>
  );
}


