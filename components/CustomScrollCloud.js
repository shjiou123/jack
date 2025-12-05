import { useEffect, useRef } from "react";

export default function CustomScrollCloud() {
  const trackRef = useRef(null);
  const thumbRef = useRef(null);
  const dragStateRef = useRef({
    dragging: false,
    offsetY: 0,
    trackHeight: 0,
    thumbHeight: 0,
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const trackEl = trackRef.current;
    const thumbEl = thumbRef.current;
    if (!trackEl || !thumbEl) return;

    const state = dragStateRef.current;

    const measure = () => {
      state.trackHeight = trackEl.offsetHeight;
      state.thumbHeight = thumbEl.offsetHeight || 40;
      syncThumbToScroll();
    };

    const syncThumbToScroll = () => {
      const scrollMax = document.body.scrollHeight - window.innerHeight;
      const { trackHeight, thumbHeight } = dragStateRef.current;

      if (scrollMax <= 0 || trackHeight <= thumbHeight) {
        thumbEl.style.top = "0px";
        return;
      }

      const scrollRatio = window.scrollY / scrollMax;
      const travel = trackHeight - thumbHeight;
      const top = travel * scrollRatio;
      thumbEl.style.top = `${top}px`;
    };

    const handleScroll = () => {
      if (dragStateRef.current.dragging) return;
      syncThumbToScroll();
    };

    const handleResize = () => {
      measure();
    };

    const handlePointerMove = (e) => {
      if (!dragStateRef.current.dragging) return;

      const { trackHeight, thumbHeight, offsetY } = dragStateRef.current;
      const rect = trackEl.getBoundingClientRect();
      let y = e.clientY - rect.top - offsetY;

      const travel = Math.max(0, trackHeight - thumbHeight);
      if (travel <= 0) return;

      y = Math.max(0, Math.min(y, travel));
      thumbEl.style.top = `${y}px`;

      const ratio = y / travel;
      const scrollMax = document.body.scrollHeight - window.innerHeight;
      const newScrollTop = ratio * scrollMax;
      window.scrollTo(0, newScrollTop);
    };

    const stopDrag = () => {
      if (!dragStateRef.current.dragging) return;
      dragStateRef.current.dragging = false;
      thumbEl.classList.remove("dragging");
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", stopDrag);
      window.removeEventListener("pointercancel", stopDrag);
      window.removeEventListener("blur", stopDrag);
    };

    const startDrag = (e) => {
      e.preventDefault();
      dragStateRef.current.dragging = true;
      const thumbRect = thumbEl.getBoundingClientRect();
      dragStateRef.current.offsetY = e.clientY - thumbRect.top;
      thumbEl.classList.add("dragging");

      window.addEventListener("pointermove", handlePointerMove);
      window.addEventListener("pointerup", stopDrag);
      window.addEventListener("pointercancel", stopDrag);
      window.addEventListener("blur", stopDrag);
    };

    // 초기 계산 및 이벤트 등록
    measure();
    syncThumbToScroll();

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);
    thumbEl.addEventListener("pointerdown", startDrag);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
      thumbEl.removeEventListener("pointerdown", startDrag);
      stopDrag();
    };
  }, []);

  return (
    <div className="custom-scroll-track" ref={trackRef} aria-hidden="true">
      <img
        ref={thumbRef}
        className="custom-scroll-thumb"
        src="/cloud_7.png"
        alt="Scroll thumb cloud"
      />
    </div>
  );
}


