import { useRef, useCallback, useState, useEffect } from "react";
import {
  GlobalStyles,
  Main,
  HouseWrap,
  HouseImg,
  Bubble,
  BubbleImg,
  CloseButton,
  CurtainImgLeft,
  CurtainImgRight,
} from "./styles";
///위치: array constant 빼기

export default function PopupView() {
  const draggingElRef = useRef(null);
  const startRef = useRef({ x: 0, y: 0, left: 0, top: 0 });
  const dragRafIdRef = useRef(null);
  const dragDeltaRef = useRef({ dx: 0, dy: 0 });

  // 방문 플래그 설정 (메인 페이지에서 배경 전환용)
  useEffect(() => {
    const handleBeforeUnload = () => {
      try {
        window.localStorage.setItem("visitedPopup2", "true");
      } catch {}
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  const [bubbleState, setBubbleState] = useState({});
  const bubbleVisible = (id) => bubbleState[id]?.visible !== false;
  const handleBubbleClick = (id) => {
    setBubbleState((s) => ({ ...s, [id]: { ...(s[id] || {}), popping: true } }));
  };
  const handleBubbleAnimEnd = (id) => {
    setBubbleState((s) => ({ ...s, [id]: { ...(s[id] || {}), visible: false } }));
  };

  // Raindrop layout (기존 버블 레이아웃을 기반으로, 이미지와 속도만 변경)
  const baseBubbles = [
    { id:'b1',  top:18, left:21, width:4,  img:'/house2/raindrop1.png', dx:'0px', dy:'32px', dur:'8.0s', float:'3.5s', dWrap:'-0.8s', dImg:'-0.6s' },
    { id:'b2',  top:24, left:57, width:3.5,  img:'/house2/raindrop2.png', dx:'0px', dy:'30px', dur:'7.2s', float:'3.2s', dWrap:'-1.3s', dImg:'-0.9s' },
    { id:'b3',  top:38, left:34, width:3,  img:'/house2/raindrop1.png', dx:'0px', dy:'28px', dur:'7.8s', float:'3.4s', dWrap:'-0.4s', dImg:'-0.2s' },
    { id:'b4',  top:56, left:72, width:3.5,  img:'/house2/raindrop2.png', dx:'0px', dy:'30px', dur:'7.0s', float:'3.0s', dWrap:'-1.0s', dImg:'-0.6s' },
    { id:'b5',  top:64, left:42, width:4.5,  img:'/house2/raindrop1.png', dx:'0px', dy:'34px', dur:'8.5s', float:'3.6s', dWrap:'-1.6s', dImg:'-1.0s' },
    { id:'b6',  top:76, left:16, width:4,  img:'/house2/raindrop2.png', dx:'0px', dy:'32px', dur:'7.6s', float:'3.3s', dWrap:'-0.7s', dImg:'-0.4s' },
    { id:'b7',  top:30, left:78, width:3,  img:'/house2/raindrop1.png', dx:'0px', dy:'26px', dur:'6.8s', float:'3.1s', dWrap:'-0.3s', dImg:'-0.2s' },
    { id:'b8',  top:70, left:28, width:4.5,  img:'/house2/raindrop2.png', dx:'0px', dy:'34px', dur:'8.2s', float:'3.7s', dWrap:'-1.8s', dImg:'-1.0s' },
    { id:'b9',  top:44, left:16, width:3,  img:'/house2/raindrop1.png', dx:'0px', dy:'28px', dur:'7.1s', float:'3.0s', dWrap:'-0.5s', dImg:'-0.3s' },
    { id:'b10', top:22, left:36, width:3,  img:'/house2/raindrop2.png', dx:'0px', dy:'26px', dur:'6.9s', float:'3.0s', dWrap:'-0.9s', dImg:'-0.6s' },
    { id:'b11', top:52, left:18, width:4,  img:'/house2/raindrop1.png', dx:'0px', dy:'30px', dur:'7.9s', float:'3.4s', dWrap:'-1.4s', dImg:'-0.8s' },
    { id:'b12', top:34, left:68, width:3.5,  img:'/house2/raindrop2.png', dx:'0px', dy:'28px', dur:'7.3s', float:'3.2s', dWrap:'-0.7s', dImg:'-0.5s' },
    { id:'b13', top:62, left:64, width:4,  img:'/house2/raindrop1.png', dx:'0px', dy:'32px', dur:'8.1s', float:'3.5s', dWrap:'-1.1s', dImg:'-0.9s' },
    { id:'b14', top:28, left:12, width:2.5,  img:'/house2/raindrop2.png', dx:'0px', dy:'24px', dur:'6.4s', float:'2.8s', dWrap:'-0.2s', dImg:'-0.1s' },
    { id:'b15', top:82, left:36, width:3.5,  img:'/house2/raindrop1.png', dx:'0px', dy:'30px', dur:'7.7s', float:'3.3s', dWrap:'-0.6s', dImg:'-0.3s' },
    { id:'b16', top:48, left:82, width:3,  img:'/house2/raindrop2.png', dx:'0px', dy:'26px', dur:'6.7s', float:'3.0s', dWrap:'-1.5s', dImg:'-0.9s' },
    { id:'b17', top:58, left:48, width:3.5,  img:'/house2/raindrop1.png', dx:'0px', dy:'28px', dur:'7.2s', float:'3.1s', dWrap:'-0.8s', dImg:'-0.5s' },
    { id:'b18', top:36, left:48, width:2.5,  img:'/house2/raindrop2.png', dx:'0px', dy:'24px', dur:'6.2s', float:'2.7s', dWrap:'-0.4s', dImg:'-0.2s' },
  ];
  const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
  const makeSet = (arr, offsetIndex, topOff, leftOff, delayOffWrap, delayOffImg) =>
    arr.map((b, i) => ({
      ...b,
      id: `b${offsetIndex * arr.length + (i + 1)}`,
      top: clamp(b.top + topOff, 8, 92),
      left: clamp(b.left + leftOff, 8, 92),
      width: Math.min(b.width * 2, 52),
      dWrap: `calc(${b.dWrap || '0s'} - ${delayOffWrap}s)`,
      dImg: `calc(${b.dImg || '0s'} - ${delayOffImg}s)`,
    }));
  const set1 = makeSet(baseBubbles, 0, 0, 0, 0, 0);
  const set2 = makeSet(baseBubbles, 1, 7, -6, 0.4, 0.3);
  const set3 = makeSet(baseBubbles, 2, -6, 7, 0.8, 0.6);
  const allBubbles = [...set1, ...set2, ...set3];

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
      <HouseWrap className="houseWrap">
        <HouseImg src="/house2/house2.png" alt="House 2" />

        {/* popup3의 연기처럼, 처음에 화면을 가득 덮었다가 좌우로 열리는 커튼 */}
        <CurtainImgLeft src="/curtain.png" alt="Curtain left" />
        <CurtainImgRight src="/curtain2.png" alt="Curtain right" />

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

      <CloseButton onClick={() => window.close()}>닫기</CloseButton>
    </Main>
  );
}


