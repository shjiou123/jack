import { useRef, useCallback, useState, useEffect } from "react";
import { GlobalStyles, Main, CloudWrap, CloudImg, JackWrap, JackImg, JackImgOverlay, DoorHotspot } from "./styles";

export default function MainPage() {
  const mainRef = useRef(null);
  const draggingElRef = useRef(null);
  const startRef = useRef({ x: 0, y: 0, left: 0, top: 0 });
  const dragRafIdRef = useRef(null);
  const dragDeltaRef = useRef({ dx: 0, dy: 0 });
  const isDraggingRef = useRef(false);
  const [hasVisitedPopup, setHasVisitedPopup] = useState(false);

  // Random clouds (5 images, at least 3 each) - generate on client after mount to avoid SSR hydration mismatch
  const [randomStemClouds, setRandomStemClouds] = useState([]);
  useEffect(() => {
    const rand = (min, max) => Math.random() * (max - min) + min;
    // 요청하신 4종 구름만 랜덤으로 사용
    const cloudSrcs = [
      "/cloud/구름_1.png",
      "/cloud/구름_2.png",
      "/cloud/구름_4.png",
      "/cloud/구름.png",
    ];
    const clouds = [];
    cloudSrcs.forEach((src) => {
      const count = 2 + Math.floor(Math.random() * 2); // 2~3 per type
      for (let i = 0; i < count; i++) {
        // size buckets: small(30%), medium(50%), large(20%)
        const bucket = Math.random();
        const widthVw =
          bucket < 0.3 ? rand(10, 18) :
          bucket < 0.8 ? rand(20, 36) :
          rand(38, 52);
        // spread more widely across the viewport while staying mostly in stem band
        const leftPct = rand(20, 80);
        const topPx = rand(300, 6500);
        // 실제로 움직임이 눈에 보이면서도 느릿하게 흐르도록
        const drift = rand(12, 22);
        const floatDur = rand(6, 10);
        clouds.push({
          src,
          widthVw,
          maxWidthPx: Math.round(widthVw * 30),
          leftPct,
          topPx,
          drift,
          floatDur,
          z: 4 + Math.floor(Math.random() * 3),
        });
      }
    });
    setRandomStemClouds(clouds);
  }, []);

  // 팝업을 다녀왔을 때만 (같은 세션/탭에서) 배경 이미지를 교체.
  // 새로고침하면 항상 background_b.png 로 다시 시작하도록, 마운트 시 플래그를 지운다.
  useEffect(() => {
    if (typeof window === "undefined") return;

    // 새로고침된 뒤에는 항상 초기 상태로
    try {
      window.localStorage.removeItem("visitedPopup");
    } catch {}
    setHasVisitedPopup(false);

    const handleStorage = (e) => {
      if (e.key === "visitedPopup" && e.newValue === "true") {
        setHasVisitedPopup(true);
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => {
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  // (minimap / 커스텀 스크롤바 관련 사이드 이펙트는 제거됨)

  const handlePointerMove = useCallback((e) => {
    const el = draggingElRef.current;
    if (!el) return;
    const dx = e.clientX - startRef.current.x;
    const dy = e.clientY - startRef.current.y;

    // pointermove를 바로 DOM 업데이트하는 대신, rAF 한 프레임에 한 번만 반영
    // 드래그 중에는 transform만 변경해서 레이아웃 재계산을 최소화
    dragDeltaRef.current = { dx, dy };
    if (dragRafIdRef.current != null) return;

    dragRafIdRef.current = window.requestAnimationFrame(() => {
      const elNow = draggingElRef.current;
      if (!elNow) {
        dragRafIdRef.current = null;
        return;
      }
      const { dx: rdx, dy: rdy } = dragDeltaRef.current;
      // 드래그 중에는 left/top은 건드리지 않고 transform만 조정
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

  const pauseAllCloudAnims = () => {
    const rootEl = mainRef.current;
    if (!rootEl) return;
    const els = rootEl.querySelectorAll(".cloudWrap, .cloudWrap img");
    els.forEach((node) => {
      node.style.animationPlayState = "paused";
    });
  };

  const resumeAllCloudAnims = () => {
    const rootEl = mainRef.current;
    if (!rootEl) return;
    const els = rootEl.querySelectorAll(".cloudWrap, .cloudWrap img");
    els.forEach((node) => {
      node.style.animationPlayState = "running";
    });
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
    isDraggingRef.current = false;
    resumeAllCloudAnims();
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
    const target = e.target.closest?.(".cloudWrap");
    if (!target) return;
    e.preventDefault();
    try { target.setPointerCapture && target.setPointerCapture(e.pointerId); } catch {}
    draggingElRef.current = target;
    isDraggingRef.current = true;
    pauseAllCloudAnims();
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

  // 미니맵 드래그로 실제 스크롤을 이동
  const handleMiniPointerMove = useCallback((e) => {
    if (!isDraggingMiniRef.current || !mainRef.current) return;
    const el = mainRef.current;
    const { barHeight } = minimapStateRef.current;
    const containerTop = (window.innerHeight - MINIMAP_HEIGHT) / 2;
    let barTop = e.clientY - miniDragOffsetRef.current - containerTop;
    const maxTop = MINIMAP_HEIGHT - barHeight;
    barTop = Math.max(0, Math.min(barTop, maxTop));

    const next = { barTop, barHeight };
    setMinimap(next);
    minimapStateRef.current = next;

    const scrollHeight = el.scrollHeight;
    const viewportHeight = el.clientHeight;
    if (scrollHeight <= viewportHeight) return;
    const ratio = barTop / maxTop;
    const newScrollTop = ratio * (scrollHeight - viewportHeight);
    el.scrollTo({ top: newScrollTop, behavior: "auto" });
  }, []);

  const handleMiniPointerUp = useCallback(() => {
    isDraggingMiniRef.current = false;
    const barEl = document.querySelector(".minimap-bar");
    if (barEl) barEl.classList.remove("dragging");
    window.removeEventListener("pointermove", handleMiniPointerMove);
    window.removeEventListener("pointerup", handleMiniPointerUp);
    window.removeEventListener("pointercancel", handleMiniPointerUp);
    window.removeEventListener("blur", handleMiniPointerUp);
  }, []);

  const handleMiniPointerDown = useCallback(
    (e) => {
      const barEl = e.target.closest?.(".minimap-bar");
      if (!barEl || !mainRef.current) return;
      e.preventDefault();
      isDraggingMiniRef.current = true;
      miniDragOffsetRef.current = e.clientY - barEl.getBoundingClientRect().top;
      barEl.classList.add("dragging");
      window.addEventListener("pointermove", handleMiniPointerMove);
      window.addEventListener("pointerup", handleMiniPointerUp);
      window.addEventListener("pointercancel", handleMiniPointerUp);
      window.addEventListener("blur", handleMiniPointerUp);
    },
    [handleMiniPointerMove, handleMiniPointerUp]
  );

  // Pause cloud animations when off-screen to reduce jank
  useEffect(() => {
    const rootEl = mainRef.current;
    if (!rootEl) return;
    if (typeof window === "undefined" || typeof window.IntersectionObserver === "undefined") {
      // Fallback: ensure any paused states are resumed so nothing gets stuck
      const els = rootEl.querySelectorAll(".cloudWrap, .cloudWrap img");
      els.forEach((el) => {
        el.style.animationPlayState = "running";
      });
      return;
    }
    const cloudEls = Array.from(rootEl.querySelectorAll(".cloudWrap"));
    if (cloudEls.length === 0) return;
    const io = new IntersectionObserver(
      (entries) => {
        // 드래그 중에는 IO가 애니메이션 상태를 건드리지 않도록 막기
        if (isDraggingRef.current) return;
        entries.forEach((entry) => {
          const el = entry.target;
          const img = el.querySelector("img");
          if (entry.isIntersecting) {
            el.style.animationPlayState = "running";
            if (img) img.style.animationPlayState = "running";
          } else {
            el.style.animationPlayState = "paused";
            if (img) img.style.animationPlayState = "paused";
          }
        });
      },
      { root: rootEl, rootMargin: "200px 0px", threshold: 0.01 }
    );
    cloudEls.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [randomStemClouds.length]);

  return (
    <Main ref={mainRef} onPointerDown={handlePointerDown}>
      <GlobalStyles />

      {/* Floating clouds (top group with fixed class timing) */}
      <CloudWrap className="cloudWrap cloud1" $top="40px" $left="8%" $width="38vw" $maxWidth="980px" $zIndex={5}>
        <CloudImg className="cloudImg cloudImg1" src="/cloud/구름_1.png" alt="Cloud" />
      </CloudWrap>
      <CloudWrap className="cloudWrap cloud2" $top="110px" $left="28%" $width="44vw" $maxWidth="1200px" $zIndex={5}>
        <CloudImg className="cloudImg cloudImg2" src="/cloud/구름_2.png" alt="Cloud" />
      </CloudWrap>
      <CloudWrap className="cloudWrap cloud3" $top="180px" $left="48%" $width="36vw" $maxWidth="980px" $zIndex={5}>
        <CloudImg className="cloudImg cloudImg3" src="/cloud/구름_1.png" alt="Cloud" />
      </CloudWrap>
      <CloudWrap className="cloudWrap cloud4" $top="240px" $left="66%" $width="50vw" $maxWidth="1350px" $zIndex={5}>
        <CloudImg className="cloudImg cloudImg4" src="/cloud/구름_2.png" alt="Cloud" />
      </CloudWrap>
      <CloudWrap className="cloudWrap cloud5" $top="300px" $left="84%" $width="32vw" $maxWidth="900px" $zIndex={5}>
        <CloudImg className="cloudImg cloudImg5" src="/cloud/구름_1.png" alt="Cloud" />
      </CloudWrap>

      {/* Stem bubbles removed as requested */}

      {/* Randomized stem clouds (5 types, ≥3 each) */}
      {randomStemClouds.map((c, idx) => {
        const toNum = (v) => {
          const n = typeof v === "string" ? parseFloat(v) : v;
          return Number.isFinite(n) ? n : NaN;
        };
        const clamp = (n, min, max) => Math.min(max, Math.max(min, n));
        const driftValRaw = toNum(c.drift);
        const floatValRaw = toNum(c.floatDur);
        const topPxRaw = toNum(c.topPx);
        const leftPctRaw = toNum(c.leftPct);
        const widthVwRaw = toNum(c.widthVw);
        const maxWidthPxRaw = toNum(c.maxWidthPx);

        const driftVal = Number.isFinite(driftValRaw) ? driftValRaw : 7.0;
        const floatVal = Number.isFinite(floatValRaw) ? floatValRaw : 2.4;
        const topPx = Number.isFinite(topPxRaw) ? Math.round(topPxRaw) : 1200;
        const leftPct = Number.isFinite(leftPctRaw) ? clamp(leftPctRaw, 5, 95) : 50;
        const widthVw = Number.isFinite(widthVwRaw) ? clamp(widthVwRaw, 8, 60) : 32;
        const maxWidthPx = Number.isFinite(maxWidthPxRaw) ? clamp(maxWidthPxRaw, 200, 1600) : Math.round(widthVw * 30);
        return (
        <CloudWrap
          key={`rcloud-${idx}`}
          className="cloudWrap"
          $top={`${topPx}px`}
          $left={`${leftPct}%`}
          $width={`${widthVw}vw`}
          $maxWidth={`${maxWidthPx}px`}
          $zIndex={c.z || 5}
          $driftDuration={`${driftVal.toFixed(1)}s`}
        >
          <CloudImg
            className="cloudImg"
            src={c.src}
            alt="Cloud"
            $floatDuration={`${floatVal.toFixed(1)}s`}
          />
        </CloudWrap>
        );
      })}

      {/* Redistributed 구름5 (fewer, spread along the stem) */}
      <CloudWrap className="cloudWrap" $top="540px" $left="51%" $width="39vw" $maxWidth="1140px" $zIndex={5} $driftDuration="6.8s">
        <CloudImg className="cloudImg" src="/cloud/구름.png" alt="Cloud" $floatDuration="2.4s" />
      </CloudWrap>
      <CloudWrap className="cloudWrap" $top="2000px" $left="49%" $width="36vw" $maxWidth="1050px" $zIndex={5} $driftDuration="6.4s">
        <CloudImg className="cloudImg" src="/cloud/구름.png" alt="Cloud" $floatDuration="2.2s" />
      </CloudWrap>
      <CloudWrap className="cloudWrap" $top="3200px" $left="53%" $width="42vw" $maxWidth="1230px" $zIndex={5} $driftDuration="6.9s">
        <CloudImg className="cloudImg" src="/cloud/구름.png" alt="Cloud" $floatDuration="2.5s" />
      </CloudWrap>

      {/* Mid-scroll clouds (prop-driven timing) */}
      <CloudWrap className="cloudWrap" $top="900px" $left="47%" $width="42vw" $maxWidth="1140px" $zIndex={5} $driftDuration="7.5s">
        <CloudImg className="cloudImg" src="/cloud/구름_2.png" alt="Cloud" $floatDuration="3.0s" />
      </CloudWrap>
      <CloudWrap className="cloudWrap" $top="1500px" $left="50%" $width="45vw" $maxWidth="1230px" $zIndex={5} $driftDuration="7s">
        <CloudImg className="cloudImg" src="/cloud/구름_1.png" alt="Cloud" $floatDuration="2.8s" />
      </CloudWrap>
      <CloudWrap className="cloudWrap" $top="2100px" $left="53%" $width="36vw" $maxWidth="1050px" $zIndex={5} $driftDuration="8s">
        <CloudImg className="cloudImg" src="/cloud/구름_2.png" alt="Cloud" $floatDuration="2.6s" />
      </CloudWrap>
      <CloudWrap className="cloudWrap" $top="2700px" $left="49%" $width="33vw" $maxWidth="930px" $zIndex={5} $driftDuration="6.5s">
        <CloudImg className="cloudImg" src="/cloud/구름_1.png" alt="Cloud" $floatDuration="2.4s" />
      </CloudWrap>
      <CloudWrap className="cloudWrap" $top="3300px" $left="55%" $width="48vw" $maxWidth="1350px" $zIndex={5} $driftDuration="8.5s">
        <CloudImg className="cloudImg" src="/cloud/구름_2.png" alt="Cloud" $floatDuration="3.4s" />
      </CloudWrap>

      {/* Extra clouds (faster speed) */}
      <CloudWrap className="cloudWrap" $top="3900px" $left="51%" $width="42vw" $maxWidth="1230px" $zIndex={5} $driftDuration="6.8s">
        <CloudImg className="cloudImg" src="/cloud/구름_3.png" alt="Cloud" $floatDuration="2.2s" />
      </CloudWrap>
      <CloudWrap className="cloudWrap" $top="4500px" $left="48%" $width="39vw" $maxWidth="1140px" $zIndex={5} $driftDuration="6.2s">
        <CloudImg className="cloudImg" src="/cloud/구름_4.png" alt="Cloud" $floatDuration="2.0s" />
      </CloudWrap>

      {/* Additional stem cloud */}
      <CloudWrap className="cloudWrap" $top="5700px" $left="50%" $width="39vw" $maxWidth="1140px" $zIndex={5} $driftDuration="5.6s">
        <CloudImg className="cloudImg" src="/cloud/구름_3.png" alt="Cloud" $floatDuration="1.8s" />
      </CloudWrap>

      {/* Jack image and door hotspot (image-driven) */}
      <JackWrap className="jackWrap">
        {/* 기본 줄기 이미지 (항상 보임) */}
        <JackImg className="jackImg" src="/background_b.png" alt="Stem" />
        {/* 팝업 방문 후 위에 부드럽게 페이드인 되는 이미지 */}
        <JackImgOverlay
          className="jackImg"
          src="/background.png"
          alt="Stem after popup"
          $visible={hasVisitedPopup}
        />
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
        {/* Second popup hotspot - moved to stem center for popup2 */}
        <DoorHotspot
          aria-label="새 팝업 열기"
          className="doorHotspot"
          href="/popup2"
          target="_blank"
          rel="noopener noreferrer"
          title="새 팝업 열기"
          $top="52%"
          $left="50%"
          $width="15%"
          $height="3%"
          style={{
            zIndex: 40,
            background: "rgba(255,0,0,0.25)",
            border: "3px solid rgba(255,0,0,0.85)",
            color: "#b00",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 800,
            letterSpacing: "0.04em"
          }}
        >
          POPUP2
        </DoorHotspot>
        {/* Third popup hotspot - popup3 (blue marker) */}
        <DoorHotspot
          aria-label="새 팝업3 열기"
          className="doorHotspot"
          href="/popup3"
          target="_blank"
          rel="noopener noreferrer"
          title="새 팝업3 열기"
          $top="91.5%"
          $left="54%"
          $width="15%"
          $height="3%"
          style={{
            zIndex: 41,
            background: "rgba(0,120,255,0.22)",
            border: "3px solid rgba(0,120,255,0.9)",
            color: "#0057cc",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 800,
            letterSpacing: "0.04em"
          }}
        >
          POPUP3
        </DoorHotspot>
      </JackWrap>
    </Main>
  );
}
