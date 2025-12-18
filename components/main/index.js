import { useRef, useCallback, useState, useEffect } from "react";
import { GlobalStyles, Main, CloudWrap, CloudImg, JackWrap, JackImg, JackImgOverlay, DoorHotspot, RainDropWrap, RainDropImg } from "./styles";

//test
export default function MainPage() {
  const mainRef = useRef(null);
  const draggingElRef = useRef(null);
  const startRef = useRef({ x: 0, y: 0, left: 0, top: 0 });
  const dragRafIdRef = useRef(null);
  const dragDeltaRef = useRef({ dx: 0, dy: 0 });
  const isDraggingRef = useRef(false);
  const [hasVisitedPopup, setHasVisitedPopup] = useState(false);
  const [rainBursts, setRainBursts] = useState([]);

  // Random clouds (6 images) - generate on client after mount to avoid SSR hydration mismatch
  const [randomStemClouds, setRandomStemClouds] = useState([]);
  useEffect(() => {
    const rand = (min, max) => Math.random() * (max - min) + min;
    // 요청하신 6종 구름 이미지를 랜덤으로 사용
    const cloudSrcs = [
      "/cloud/cloud_1.png",
      "/cloud/cloud_2.png",
      "/cloud/cloud_3.png",
      "/cloud/cloud_4.png",
      "/cloud/cloud_5.png",
      "/cloud/cloud.png",
    ];
    const clouds = [];
    cloudSrcs.forEach((src) => {
      const count = 3 + Math.floor(Math.random() * 2); // 3~4 per type
      for (let i = 0; i < count; i++) {
        // size buckets: small(30%), medium(50%), large(20%)
        const bucket = Math.random();
        const widthVw =
          bucket < 0.3 ? rand(10, 18) :
          bucket < 0.8 ? rand(20, 36) :
          rand(38, 52);
        // 화면 전체에 넓게 퍼지도록 (줄기 위/아래 여유 포함)
        const leftPct = rand(5, 95);
        const topPx = rand(0, 6500);
        // 실제로 움직임이 눈에 보이면서도 느릿하게 흐르도록
        // 살짝 더 빠르게 움직이도록 기존보다 duration을 줄임
        // (값이 작을수록 속도가 빨라짐)
        const drift = rand(8, 14);      // 기존 12~22s → 8~14s
        const floatDur = rand(4, 6.5);  // 기존 6~10s  → 4~6.5s
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

  // 특정 구름( cloud_1, cloud_2 )을 클릭했을 때 잠깐 비가 내리는 연출
  const triggerRain = useCallback(() => {
    const makeRand = (min, max) => Math.random() * (max - min) + min;
    const batchId = Date.now();
    const drops = [];
    const count = 40; // 화면 전체에 충분히 보이도록 여러 개 생성
    for (let i = 0; i < count; i++) {
      const left = makeRand(5, 95); // 화면 가로 5~95% 범위
      const size = makeRand(22, 40); // 픽셀 단위 크기
      const duration = makeRand(1.5, 2.4); // 개별 낙하 속도
      const src =
        i % 2 === 0
          ? "/house2/raindrop1.png"
          : "/house2/raindrop2.png";
      drops.push({
        id: `rain-${batchId}-${i}`,
        batchId,
        left,
        size,
        duration,
        src,
      });
    }
    setRainBursts((prev) => [...prev, ...drops]);
    // 약 3초 뒤에 이번 배치만 제거
    window.setTimeout(() => {
      setRainBursts((prev) => prev.filter((d) => d.batchId !== batchId));
    }, 3000);
  }, []);

  // 메인 줄기 장면 단계 관리 (아침 → 저녁 2단계).
  // 새로고침하면 항상 아침으로 시작하고, 팝업 탭에서 localStorage "visitedPopup" 값이 바뀌면 storage 이벤트로 반영.
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleStorage = (e) => {
      if (e.key === "visitedPopup" && e.newValue === "true") {
        setHasVisitedPopup(true);
      }
    };

    window.addEventListener("storage", handleStorage);
    try {
      window.localStorage.removeItem("visitedPopup");
    } catch {}
    setHasVisitedPopup(false);

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

    // cloud_1 ~ cloud_5 는 "비 내리는 버튼" 역할만 하도록 드래그를 막는다.
    // (클릭 시에는 onClick에서 triggerRain 이 실행됨)
    const imgEl = target.querySelector("img");
    const src = imgEl?.getAttribute("src") || "";
    if (
      src === "/cloud/cloud_1.png" ||
      src === "/cloud/cloud_2.png" ||
      src === "/cloud/cloud_3.png" ||
      src === "/cloud/cloud_4.png" ||
      src === "/cloud/cloud_5.png"
    ) {
      return;
    }

    e.preventDefault();
    try {
      target.setPointerCapture && target.setPointerCapture(e.pointerId);
    } catch {}
    draggingElRef.current = target;
    isDraggingRef.current = true;
    pauseAllCloudAnims();

    // 현재 화면에 보이는 위치(애니메이션 적용된 transform 포함)를 기준으로
    // left/top을 한 번 고정해 주어, 드래그 시작 시 "튐" 현상을 줄인다.
    const rect = target.getBoundingClientRect();
    const parentRect =
      target.offsetParent && target.offsetParent.getBoundingClientRect
        ? target.offsetParent.getBoundingClientRect()
        : { left: 0, top: 0 };
    const leftPx = rect.left - parentRect.left;
    const topPx = rect.top - parentRect.top;
    target.style.left = `${leftPx}px`;
    target.style.top = `${topPx}px`;
    // 이후 이동은 JS에서만 처리하므로 기존 transform은 제거
    target.style.transform = "";

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

      {/* 클릭 시 생성되는 빗방울 효과 */}
      {rainBursts.map((drop) => (
        <RainDropWrap
          key={drop.id}
          $left={`${drop.left}vw`}
          $duration={`${drop.duration.toFixed(2)}s`}
        >
          <RainDropImg
            src={drop.src}
            alt="Raindrop"
            $size={`${drop.size.toFixed(1)}px`}
          />
        </RainDropWrap>
      ))}

      {/* Randomized clouds (6 types), 화면 전체에 퍼져있는 구름들 */}
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
              onClick={() => {
                if (
                  c.src === "/cloud/cloud_1.png" ||
                  c.src === "/cloud/cloud_2.png" ||
                  c.src === "/cloud/cloud_3.png" ||
                  c.src === "/cloud/cloud_4.png" ||
                  c.src === "/cloud/cloud_5.png"
                ) {
                  triggerRain();
                }
              }}
            />
          </CloudWrap>
        );
      })}

      {/* Jack image and door hotspot (image-driven) */}
      <JackWrap className="jackWrap">
        {/* 첫 화면: 아침 줄기 이미지 */}
        <JackImg
          className="jackImg"
          src="/main_morning.png"
          alt="Stem - morning"
        />
        {/* 팝업 다녀온 후: 저녁 줄기 이미지가 부드럽게 페이드인 */}
        <JackImgOverlay
          className="jackImg"
          src="/main_evening.png"
          alt="Stem - evening"
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
