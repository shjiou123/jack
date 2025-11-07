import { useRef, useCallback } from "react";
import { GlobalStyles, Main, CloudWrap, CloudImg, JackWrap, JackImg, DoorHotspot } from "./styles";

export default function MainPage() {
  const draggingElRef = useRef(null);
  const startRef = useRef({ x: 0, y: 0, left: 0, top: 0 });

  const handlePointerMove = useCallback((e) => {
    const el = draggingElRef.current;
    if (!el) return;
    const dx = e.clientX - startRef.current.x;
    const dy = e.clientY - startRef.current.y;
    const newLeft = startRef.current.left + dx;
    const newTop = startRef.current.top + dy;
    el.style.left = `${newLeft}px`;
    el.style.top = `${newTop}px`;
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
    const target = e.target.closest?.(".cloudWrap");
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

      {/* Floating clouds (top group with fixed class timing) */}
      <CloudWrap className="cloudWrap cloud1" $top="40px" $left="6%" $width="28vw" $maxWidth="680px" $zIndex={5}>
        <CloudImg className="cloudImg cloudImg1" src="/cloud_1.png" alt="Cloud" />
      </CloudWrap>
      <CloudWrap className="cloudWrap cloud2" $top="110px" $left="28%" $width="30vw" $maxWidth="780px" $zIndex={5} $opacity={0.95}>
        <CloudImg className="cloudImg cloudImg2" src="/cloud_1.png" alt="Cloud" />
      </CloudWrap>
      <CloudWrap className="cloudWrap cloud3" $top="180px" $left="46%" $width="26vw" $maxWidth="680px" $zIndex={5} $opacity={0.9}>
        <CloudImg className="cloudImg cloudImg3" src="/cloud_1.png" alt="Cloud" />
      </CloudWrap>
      <CloudWrap className="cloudWrap cloud4" $top="240px" $left="64%" $width="34vw" $maxWidth="900px" $zIndex={5} $opacity={0.9}>
        <CloudImg className="cloudImg cloudImg4" src="/cloud_1.png" alt="Cloud" />
      </CloudWrap>
      <CloudWrap className="cloudWrap cloud5" $top="300px" $left="78%" $width="24vw" $maxWidth="620px" $zIndex={5} $opacity={0.85}>
        <CloudImg className="cloudImg cloudImg5" src="/cloud_1.png" alt="Cloud" />
      </CloudWrap>

      {/* Mid-scroll clouds (prop-driven timing) */}
      <CloudWrap className="cloudWrap" $top="900px" $left="14%" $width="28vw" $maxWidth="760px" $zIndex={5} $opacity={0.9} $driftDuration="11s">
        <CloudImg className="cloudImg" src="/cloud_1.png" alt="Cloud" $floatDuration="4.2s" />
      </CloudWrap>
      <CloudWrap className="cloudWrap" $top="1500px" $left="34%" $width="30vw" $maxWidth="820px" $zIndex={5} $opacity={0.9} $driftDuration="10s">
        <CloudImg className="cloudImg" src="/cloud_1.png" alt="Cloud" $floatDuration="4s" />
      </CloudWrap>
      <CloudWrap className="cloudWrap" $top="2100px" $left="58%" $width="24vw" $maxWidth="700px" $zIndex={5} $opacity={0.85} $driftDuration="12s">
        <CloudImg className="cloudImg" src="/cloud_1.png" alt="Cloud" $floatDuration="3.6s" />
      </CloudWrap>
      <CloudWrap className="cloudWrap" $top="2700px" $left="76%" $width="22vw" $maxWidth="620px" $zIndex={5} $opacity={0.85} $driftDuration="9.5s">
        <CloudImg className="cloudImg" src="/cloud_1.png" alt="Cloud" $floatDuration="3.4s" />
      </CloudWrap>
      <CloudWrap className="cloudWrap" $top="3300px" $left="22%" $width="32vw" $maxWidth="900px" $zIndex={5} $opacity={0.9} $driftDuration="13s">
        <CloudImg className="cloudImg" src="/cloud_1.png" alt="Cloud" $floatDuration="4.8s" />
      </CloudWrap>

      {/* Jack image and door hotspot */}
      <JackWrap>
        <JackImg src="/Jack.png" alt="Jack" />
        <DoorHotspot
          aria-label="문 열기"
          className="doorHotspot"
          href="/popup"
          target="_blank"
          rel="noopener noreferrer"
          title="문 열기"
          $top="19.7%"
          $left="43.5%"
          $width="14.25%"
          $height="2.36%"
        />
      </JackWrap>
    </Main>
  );
}


