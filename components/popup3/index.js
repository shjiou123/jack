import { useEffect, useState, useCallback } from "react";
import { GlobalStyles, Main, HouseWrap, HouseImg, CloseButton } from "../popup/styles";

export default function PopupView() {
  // 항상 뒤에 깔려 있는 배경 이미지
  const backgroundSrc = "/popup_3/popup3.png";

  // 앞쪽에 순서대로 보여줄 대화 이미지들
  const overlayFrames = [
    "/popup_3/popup2_2.png",
    "/popup_3/popup2_3.png",
    "/popup_3/popup2_4.png",
    "/popup_3/popup2_5.png",
    "/popup_3/popup2_6.png",
  ];
  // -1: 아직 오버레이 없음(배경만 보임), 0~N-1: overlayFrames 인덱스
  const [frameIndex, setFrameIndex] = useState(-1);

  const handleAdvanceFrame = useCallback(() => {
    setFrameIndex((prev) =>
      prev >= overlayFrames.length - 1 ? prev : prev + 1
    );
  }, [overlayFrames.length]);

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

  return (
    <Main>
      <GlobalStyles />
      <HouseWrap
        className="houseWrap"
        style={{
          cursor: frameIndex < overlayFrames.length - 1 ? "pointer" : "default",
        }}
        onClick={(e) => {
          e.stopPropagation();
          handleAdvanceFrame();
        }}
      >
        {/* 항상 뒤에 깔리는 배경 이미지 */}
        <HouseImg src={backgroundSrc} alt="Kitchen pot scene" />

        {/* 클릭할 때마다 앞에 덮이는 대화 프레임 */}
        {frameIndex >= 0 && (
          <HouseImg
            src={overlayFrames[frameIndex]}
            alt="Kitchen pot story frame"
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "contain",
            }}
          />
        )}
      </HouseWrap>

      <CloseButton
        aria-label="닫기"
        style={{
          background: 'url("/house1/button_2.png") center/cover no-repeat',
        }}
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
