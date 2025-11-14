import { useRef, useCallback, useState } from "react";
import { GlobalStyles, Main, HouseWrap, HouseImg, Bubble, BubbleImg, CloseButton, BurstWrap, BurstImg, BurstWrapBR } from "./styles";
///위치: array constant 빼기

export default function PopupView() {
  const draggingElRef = useRef(null);
  const startRef = useRef({ x: 0, y: 0, left: 0, top: 0 });
  const [burstPopping, setBurstPopping] = useState(false);
  const [burstVisible, setBurstVisible] = useState(true);
  const [burst2Popping, setBurst2Popping] = useState(false);
  const [burst2Visible, setBurst2Visible] = useState(true);

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
        <HouseImg src="/house1/house_1.png" alt="Mushroom House" />

        {/* Top-left burst cluster anchored to screen ratio */}
        {burstVisible && (
          <BurstWrap
            className={burstPopping ? 'popping' : ''}
            style={{ animationDelay: '-2.5s' }}
            onClick={() => setBurstPopping(true)}
            onAnimationEnd={() => { if (burstPopping) setBurstVisible(false); }}
          >
            <BurstImg src="/bubble/버블뭉치1.png" alt="bubble-burst-cluster" style={{ animationDelay: '-1.2s' }} />
          </BurstWrap>
        )}
        {burst2Visible && (
          <BurstWrapBR
            className={burst2Popping ? 'popping' : ''}
            style={{ animationDelay: '-4.0s' }}
            onClick={() => setBurst2Popping(true)}
            onAnimationEnd={() => { if (burst2Popping) setBurst2Visible(false); }}
          >
            <BurstImg src="/bubble/버블뭉치2.png" alt="bubble-burst-cluster-2" style={{ animationDelay: '-2.0s' }} />
          </BurstWrapBR>
        )}

        {/* Mixed bubble images with distinct sizes and speeds */}
        <Bubble className="bubbleWrap" $top="18%" $left="21%" $width="22%" $dx="26px" $dy="16px" $dur="13.8s" style={{ animationDelay: '-0.8s' }}>
          <BubbleImg className="bubbleImg" src="/bubble/버블1.png" alt="bubble" $float="5.1s" style={{ animationDelay: '-0.6s' }} />
        </Bubble>
        <Bubble className="bubbleWrap" $top="24%" $left="57%" $width="16%" $dx="28px" $dy="18px" $dur="11.4s" style={{ animationDelay: '-1.3s' }}>
          <BubbleImg className="bubbleImg" src="/bubble/버블2.png" alt="bubble" $float="3.9s" style={{ animationDelay: '-0.9s' }} />
        </Bubble>
        <Bubble className="bubbleWrap" $top="38%" $left="34%" $width="19%" $dx="24px" $dy="16px" $dur="12.8s" style={{ animationDelay: '-0.4s' }}>
          <BubbleImg className="bubbleImg" src="/bubble/버블3.png" alt="bubble" $float="4.8s" style={{ animationDelay: '-0.2s' }} />
        </Bubble>
        <Bubble className="bubbleWrap" $top="56%" $left="72%" $width="17%" $dx="30px" $dy="20px" $dur="12.0s" style={{ animationDelay: '-1.0s' }}>
          <BubbleImg className="bubbleImg" src="/bubble/버블2.png" alt="bubble" $float="4.2s" style={{ animationDelay: '-0.6s' }} />
        </Bubble>
        <Bubble className="bubbleWrap" $top="64%" $left="42%" $width="24%" $dx="28px" $dy="18px" $dur="15.8s" style={{ animationDelay: '-1.6s' }}>
          <BubbleImg className="bubbleImg" src="/bubble/버블1.png" alt="bubble" $float="5.7s" style={{ animationDelay: '-1.0s' }} />
        </Bubble>
        <Bubble className="bubbleWrap" $top="76%" $left="16%" $width="18%" $dx="32px" $dy="22px" $dur="12.9s" style={{ animationDelay: '-0.7s' }}>
          <BubbleImg className="bubbleImg" src="/bubble/버블3.png" alt="bubble" $float="4.5s" style={{ animationDelay: '-0.4s' }} />
        </Bubble>

        {/* Extra bubbles (increase count, more 버블1, varied sizes) */}
        <Bubble className="bubbleWrap" $top="30%" $left="78%" $width="12%" $dx="22px" $dy="14px" $dur="11.1s" style={{ animationDelay: '-0.3s' }}>
          <BubbleImg className="bubbleImg" src="/bubble/버블1.png" alt="bubble" $float="3.8s" style={{ animationDelay: '-0.2s' }} />
        </Bubble>
        <Bubble className="bubbleWrap" $top="70%" $left="28%" $width="26%" $dx="30px" $dy="20px" $dur="16.8s" style={{ animationDelay: '-1.8s' }}>
          <BubbleImg className="bubbleImg" src="/bubble/버블1.png" alt="bubble" $float="6.3s" style={{ animationDelay: '-1.0s' }} />
        </Bubble>
        <Bubble className="bubbleWrap" $top="44%" $left="16%" $width="14%" $dx="24px" $dy="16px" $dur="12.3s" style={{ animationDelay: '-0.5s' }}>
          <BubbleImg className="bubbleImg" src="/bubble/버블2.png" alt="bubble" $float="4.5s" style={{ animationDelay: '-0.3s' }} />
        </Bubble>
      </HouseWrap>

      <CloseButton onClick={() => window.close()}>닫기</CloseButton>
    </Main>
  );
}


