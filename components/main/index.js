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
      <CloudWrap className="cloudWrap cloud1" $top="40px" $left="44%" $width="42vw" $maxWidth="1020px" $zIndex={5}>
        <CloudImg className="cloudImg cloudImg1" src="/cloud/구름1.png" alt="Cloud" />
      </CloudWrap>
      <CloudWrap className="cloudWrap cloud2" $top="110px" $left="48%" $width="45vw" $maxWidth="1170px" $zIndex={5}>
        <CloudImg className="cloudImg cloudImg2" src="/cloud/구름2.png" alt="Cloud" />
      </CloudWrap>
      <CloudWrap className="cloudWrap cloud3" $top="180px" $left="52%" $width="39vw" $maxWidth="1020px" $zIndex={5}>
        <CloudImg className="cloudImg cloudImg3" src="/cloud/구름1.png" alt="Cloud" />
      </CloudWrap>
      <CloudWrap className="cloudWrap cloud4" $top="240px" $left="56%" $width="51vw" $maxWidth="1350px" $zIndex={5}>
        <CloudImg className="cloudImg cloudImg4" src="/cloud/구름2.png" alt="Cloud" />
      </CloudWrap>
      <CloudWrap className="cloudWrap cloud5" $top="300px" $left="60%" $width="36vw" $maxWidth="930px" $zIndex={5}>
        <CloudImg className="cloudImg cloudImg5" src="/cloud/구름1.png" alt="Cloud" />
      </CloudWrap>

      {/* Stem bubbles removed as requested */}

      {/* Redistributed 구름5 (fewer, spread along the stem) */}
      <CloudWrap className="cloudWrap" $top="540px" $left="51%" $width="39vw" $maxWidth="1140px" $zIndex={5} $driftDuration="6.8s">
        <CloudImg className="cloudImg" src="/cloud/구름5.png" alt="Cloud" $floatDuration="2.4s" />
      </CloudWrap>
      <CloudWrap className="cloudWrap" $top="2000px" $left="49%" $width="36vw" $maxWidth="1050px" $zIndex={5} $driftDuration="6.4s">
        <CloudImg className="cloudImg" src="/cloud/구름5.png" alt="Cloud" $floatDuration="2.2s" />
      </CloudWrap>
      <CloudWrap className="cloudWrap" $top="3200px" $left="53%" $width="42vw" $maxWidth="1230px" $zIndex={5} $driftDuration="6.9s">
        <CloudImg className="cloudImg" src="/cloud/구름5.png" alt="Cloud" $floatDuration="2.5s" />
      </CloudWrap>

      {/* Mid-scroll clouds (prop-driven timing) */}
      <CloudWrap className="cloudWrap" $top="900px" $left="47%" $width="42vw" $maxWidth="1140px" $zIndex={5} $driftDuration="7.5s">
        <CloudImg className="cloudImg" src="/cloud/구름2.png" alt="Cloud" $floatDuration="3.0s" />
      </CloudWrap>
      <CloudWrap className="cloudWrap" $top="1500px" $left="50%" $width="45vw" $maxWidth="1230px" $zIndex={5} $driftDuration="7s">
        <CloudImg className="cloudImg" src="/cloud/구름1.png" alt="Cloud" $floatDuration="2.8s" />
      </CloudWrap>
      <CloudWrap className="cloudWrap" $top="2100px" $left="53%" $width="36vw" $maxWidth="1050px" $zIndex={5} $driftDuration="8s">
        <CloudImg className="cloudImg" src="/cloud/구름2.png" alt="Cloud" $floatDuration="2.6s" />
      </CloudWrap>
      <CloudWrap className="cloudWrap" $top="2700px" $left="49%" $width="33vw" $maxWidth="930px" $zIndex={5} $driftDuration="6.5s">
        <CloudImg className="cloudImg" src="/cloud/구름1.png" alt="Cloud" $floatDuration="2.4s" />
      </CloudWrap>
      <CloudWrap className="cloudWrap" $top="3300px" $left="55%" $width="48vw" $maxWidth="1350px" $zIndex={5} $driftDuration="8.5s">
        <CloudImg className="cloudImg" src="/cloud/구름2.png" alt="Cloud" $floatDuration="3.4s" />
      </CloudWrap>

      {/* Extra clouds (faster speed) */}
      <CloudWrap className="cloudWrap" $top="3900px" $left="51%" $width="42vw" $maxWidth="1230px" $zIndex={5} $driftDuration="6.8s">
        <CloudImg className="cloudImg" src="/cloud/구름3.png" alt="Cloud" $floatDuration="2.2s" />
      </CloudWrap>
      <CloudWrap className="cloudWrap" $top="4500px" $left="48%" $width="39vw" $maxWidth="1140px" $zIndex={5} $driftDuration="6.2s">
        <CloudImg className="cloudImg" src="/cloud/구름4.png" alt="Cloud" $floatDuration="2.0s" />
      </CloudWrap>

      {/* Additional stem cloud */}
      <CloudWrap className="cloudWrap" $top="5700px" $left="50%" $width="39vw" $maxWidth="1140px" $zIndex={5} $driftDuration="5.6s">
        <CloudImg className="cloudImg" src="/cloud/구름3.png" alt="Cloud" $floatDuration="1.8s" />
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


