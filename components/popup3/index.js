import { useRef, useCallback, useState, useEffect } from "react";
import { GlobalStyles, Main, HouseWrap, HouseImg, Bubble, BubbleImg, CloseButton, BurstWrap, BurstImg, BurstWrapBR, BurstWrapTR } from "../popup/styles";

export default function PopupView() {
  const draggingElRef = useRef(null);
  const startRef = useRef({ x: 0, y: 0, left: 0, top: 0 });
  const [burstPopping, setBurstPopping] = useState(false);
  const [burstVisible, setBurstVisible] = useState(true);
  const [burst2Popping, setBurst2Popping] = useState(false);
  const [burst2Visible, setBurst2Visible] = useState(true);
  const [burst3Popping, setBurst3Popping] = useState(false);
  const [burst3Visible, setBurst3Visible] = useState(true);

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
  const bubbleVisible = (id) => bubbleState[id]?.visible !== false;
  const handleBubbleClick = (id) => {
    setBubbleState((s) => ({ ...s, [id]: { ...(s[id] || {}), popping: true } }));
  };
  const handleBubbleAnimEnd = (id) => {
    setBubbleState((s) => ({ ...s, [id]: { ...(s[id] || {}), visible: false } }));
  };

  // Curated base bubble layout (sizes already doubled)
  const baseBubbles = [
    { id:'b1',  top:18, left:21, width:22, img:'/bubble/버블1.png', dx:'26px', dy:'16px', dur:'13.8s', float:'5.1s', dWrap:'-0.8s', dImg:'-0.6s' },
    { id:'b2',  top:24, left:57, width:16, img:'/bubble/버블2.png', dx:'28px', dy:'18px', dur:'11.4s', float:'3.9s', dWrap:'-1.3s', dImg:'-0.9s' },
    { id:'b3',  top:38, left:34, width:19, img:'/bubble/버블3.png', dx:'24px', dy:'16px', dur:'12.8s', float:'4.8s', dWrap:'-0.4s', dImg:'-0.2s' },
    { id:'b4',  top:56, left:72, width:17, img:'/bubble/버블2.png', dx:'30px', dy:'20px', dur:'12.0s', float:'4.2s', dWrap:'-1.0s', dImg:'-0.6s' },
    { id:'b5',  top:64, left:42, width:24, img:'/bubble/버블1.png', dx:'28px', dy:'18px', dur:'15.8s', float:'5.7s', dWrap:'-1.6s', dImg:'-1.0s' },
    { id:'b6',  top:76, left:16, width:18, img:'/bubble/버블3.png', dx:'32px', dy:'22px', dur:'12.9s', float:'4.5s', dWrap:'-0.7s', dImg:'-0.4s' },
    { id:'b7',  top:30, left:78, width:12, img:'/bubble/버블1.png', dx:'22px', dy:'14px', dur:'11.1s', float:'3.8s', dWrap:'-0.3s', dImg:'-0.2s' },
    { id:'b8',  top:70, left:28, width:26, img:'/bubble/버블1.png', dx:'30px', dy:'20px', dur:'16.8s', float:'6.3s', dWrap:'-1.8s', dImg:'-1.0s' },
    { id:'b9',  top:44, left:16, width:14, img:'/bubble/버블2.png', dx:'24px', dy:'16px', dur:'12.3s', float:'4.5s', dWrap:'-0.5s', dImg:'-0.3s' },
    { id:'b10', top:22, left:36, width:14, img:'/bubble/버블1.png', dx:'24px', dy:'16px', dur:'12.0s', float:'4.4s', dWrap:'-0.9s', dImg:'-0.6s' },
    { id:'b11', top:52, left:18, width:20, img:'/bubble/버블3.png', dx:'28px', dy:'18px', dur:'14.6s', float:'5.6s', dWrap:'-1.4s', dImg:'-0.8s' },
    { id:'b12', top:34, left:68, width:18, img:'/bubble/버블2.png', dx:'26px', dy:'18px', dur:'13.2s', float:'4.9s', dWrap:'-0.7s', dImg:'-0.5s' },
    { id:'b13', top:62, left:64, width:22, img:'/bubble/버블1.png', dx:'30px', dy:'20px', dur:'15.0s', float:'5.8s', dWrap:'-1.1s', dImg:'-0.9s' },
    { id:'b14', top:28, left:12, width:10, img:'/bubble/버블2.png', dx:'20px', dy:'14px', dur:'10.2s', float:'3.6s', dWrap:'-0.2s', dImg:'-0.1s' },
    { id:'b15', top:82, left:36, width:16, img:'/bubble/버블3.png', dx:'22px', dy:'16px', dur:'12.7s', float:'4.7s', dWrap:'-0.6s', dImg:'-0.3s' },
    { id:'b16', top:48, left:82, width:13, img:'/bubble/버블1.png', dx:'22px', dy:'16px', dur:'11.5s', float:'4.1s', dWrap:'-1.5s', dImg:'-0.9s' },
    { id:'b17', top:58, left:48, width:15, img:'/bubble/버블2.png', dx:'24px', dy:'16px', dur:'12.9s', float:'4.6s', dWrap:'-0.8s', dImg:'-0.5s' },
    { id:'b18', top:36, left:48, width:9,  img:'/bubble/버블1.png', dx:'18px', dy:'12px', dur:'9.6s',  float:'3.2s', dWrap:'-0.4s', dImg:'-0.2s' },
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
    el.style.left = `${startRef.current.left + dx}px`;
    el.style.top = `${startRef.current.top + dy}px`;
  }, []);

  const resumeAnim = (el) => {
    if (!el) return;
    el.style.animationPlayState = "running";
    const img = el.querySelector("img");
    if (img) img.style.animationPlayState = "running";
  };

  const handlePointerUp = useCallback(() => {
    const el = draggingElRef.current;
    if (el) resumeAnim(el);
    draggingElRef.current = null;
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
        <HouseImg src="/house2/house_2.png" alt="House 2" />

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
