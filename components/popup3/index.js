import { useEffect, useState, useCallback } from "react";
import styled, { keyframes } from "styled-components";
import { GlobalStyles, Main, HouseWrap, HouseImg, CloseButton } from "../popup/styles";

// 연기 이미지가 좌우로 사라지는 애니메이션
const smokeDriftLeft = keyframes`
  0% {
    transform: translateX(0);
    opacity: 1;
  }
  100% {
    transform: translateX(-40vw);
    opacity: 0;
  }
`;

const smokeDriftRight = keyframes`
  0% {
    transform: translateX(0);
    opacity: 1;
  }
  100% {
    transform: translateX(40vw);
    opacity: 0;
  }
`;

const SmokeImgLeft = styled.img`
  position: absolute;
  inset: 0;
  width: 100vw;
  height: 100vh;
  object-fit: cover; /* 화면 크기에 딱 맞춘 상태에서 시작 */
  pointer-events: none;
  animation: ${smokeDriftLeft} 4s ease-out forwards;
`;

const SmokeImgRight = styled(SmokeImgLeft)`
  animation: ${smokeDriftRight} 4s ease-out forwards;
`;

export default function PopupView() {
  // 항상 뒤에 깔려 있는 배경 이미지
  const backgroundSrc = "/house3/house_3.png";

  // 앞쪽에 순서대로 보여줄 대화 이미지들
  const overlayFrames = [
    "/house3/popup_3/popup3_11.png",
    "/house3/popup_3/popup3_12.png",
    "/house3/popup_3/popup3_13.png",
    "/house3/popup_3/popup3_14.png",
    "/house3/popup_3/popup3_15.png",
    "/house3/popup_3/popup3_16.png",
  ];
  // -1: 아직 오버레이 없음(배경만 보임), 0~N-1: overlayFrames 인덱스
  const [frameIndex, setFrameIndex] = useState(-1);

  const handleAdvanceFrame = useCallback(() => {
    setFrameIndex((prev) => {
      // 마지막 장을 본 뒤 한 번 더 누르면, 다시 배경만 보이도록 -1로 리셋
      if (prev >= overlayFrames.length - 1) return -1;
      return prev + 1;
    });
  }, [overlayFrames.length]);

  const handleBackgroundClick = useCallback(() => {
    // 배경(house_3) 이미지를 처음 눌렀을 때만 시퀀스를 시작
    if (frameIndex < 0) {
      setFrameIndex(0);
    }
  }, [frameIndex]);

  // 방문 플래그 설정 (메인 페이지에서 배경 전환용)
  useEffect(() => {
    const handleBeforeUnload = () => {
      try {
        window.localStorage.setItem("visitedPopup3", "true");
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
          cursor: "pointer",
        }}
        onClick={(e) => {
          e.stopPropagation();
          handleBackgroundClick();
        }}
      >
        {/* 항상 뒤에 깔리는 배경 이미지 */}
        <HouseImg src={backgroundSrc} alt="House 3 scene" />

        {/* 팝업이 열리자마자 양 옆으로 사라지는 연기 이미지들 */}
        <SmokeImgLeft src="/house3/smoke1.png" alt="Kitchen smoke left" />
        <SmokeImgRight src="/house3/smoke2.png" alt="Kitchen smoke right" />

        {/* 클릭할 때마다 앞에 덮이는 대화 프레임 */}
        {frameIndex >= 0 && (
          <HouseImg
            src={overlayFrames[frameIndex]}
            alt="Kitchen pot story frame"
            style={{
              position: "absolute",
              inset: 0,
              width: "100vw",
              height: "100vh",
              objectFit: "cover", // 화면 비율에 맞춰 꽉 차게 표시
            }}
            onClick={(e) => {
              // 사진 속 화살표를 누른 것처럼, 이미지를 클릭하면 다음 페이지로
              e.stopPropagation();
              handleAdvanceFrame();
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
