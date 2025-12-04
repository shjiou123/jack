import { useRouter } from "next/router";
import styled, { keyframes } from "styled-components";

const OpenContainer = styled.main`
  width: 100vw;
  height: 100vh;
  margin: 0;
  padding: 0;
  overflow: hidden;
  background: #fff;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const driftX = keyframes`
  0%   { transform: translateX(-18px); }
  50%  { transform: translateX(10px); }
  100% { transform: translateX(22px); }
`;

const floatY = keyframes`
  0%   { transform: translateY(0px) scale(1); }
  50%  { transform: translateY(-8px) scale(1.01); }
  100% { transform: translateY(-14px) scale(1.015); }
`;

const CloudWrap = styled.div`
  position: absolute;
  top: ${(p) => p.$top};
  left: ${(p) => p.$left};
  width: ${(p) => p.$width};
  max-width: 520px;
  pointer-events: none;
  z-index: 2;
  animation: ${driftX} ${(p) => p.$drift || 20}s ease-in-out infinite alternate;
  animation-delay: ${(p) => p.$delay || "0s"};
`;

const CloudImg = styled.img`
  display: block;
  width: 100%;
  height: auto;
  animation: ${floatY} ${(p) => p.$float || 8}s ease-in-out infinite alternate;
  animation-delay: ${(p) => p.$delay || "0s"};
`;

const HouseImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  z-index: 1;
`;

const EnterButton = styled.button`
  position: fixed;
  bottom: 10%;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(255, 255, 255, 0.9);
  border: 3px solid #000;
  border-radius: 50px;
  padding: 16px 32px;
  font-size: 1.2rem;
  font-weight: 800;
  color: #000;
  cursor: pointer;
  z-index: 100;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  transition: transform 0.2s ease, background 0.2s;

  &:hover {
    transform: translateX(-50%) scale(1.05);
    background: #fff;
  }
  &:active {
    transform: translateX(-50%) scale(0.98);
  }
`;

export default function OpenDoorView() {
  const router = useRouter();

  // 입장 전 화면 주변에 떠다니는 구름들 (이미지당 2~3개, 크기/속도 제각각)
  const ambientClouds = [
    // 구름_1
    { src: "/cloud/구름_1.png", top: "8%", left: "18%", width: "34%", drift: 22, float: 9, delayWrap: "-3s", delayImg: "-1.5s" },
    { src: "/cloud/구름_1.png", top: "62%", left: "10%", width: "30%", drift: 18, float: 7.5, delayWrap: "-5s", delayImg: "-2s" },
    // 구름_2
    { src: "/cloud/구름_2.png", top: "18%", left: "68%", width: "38%", drift: 24, float: 10, delayWrap: "-4s", delayImg: "-2.3s" },
    { src: "/cloud/구름_2.png", top: "70%", left: "64%", width: "32%", drift: 19, float: 8, delayWrap: "-6s", delayImg: "-3s" },
    // 구름_4
    { src: "/cloud/구름_4.png", top: "38%", left: "8%", width: "40%", drift: 26, float: 9.5, delayWrap: "-7s", delayImg: "-3.5s" },
    { src: "/cloud/구름_4.png", top: "46%", left: "68%", width: "36%", drift: 21, float: 8.5, delayWrap: "-2s", delayImg: "-1s" },
    // 구름
    { src: "/cloud/구름.png",  top: "28%", left: "40%", width: "42%", drift: 23, float: 11, delayWrap: "-5.5s", delayImg: "-2.7s" },
    { src: "/cloud/구름.png",  top: "78%", left: "42%", width: "38%", drift: 20, float: 8.8, delayWrap: "-3.8s", delayImg: "-1.8s" },
  ];

  return (
    <OpenContainer>
      {ambientClouds.map((c, idx) => (
        <CloudWrap
          key={idx}
          $top={c.top}
          $left={c.left}
          $width={c.width}
          $drift={c.drift}
          $delay={c.delayWrap}
        >
          <CloudImg
            src={c.src}
            alt="Cloud"
            $float={c.float}
            $delay={c.delayImg}
          />
        </CloudWrap>
      ))}
      <HouseImage src="/open.png" alt="Open Door" />
      <EnterButton onClick={() => router.push("/main")}>
        입장하기
      </EnterButton>
    </OpenContainer>
  );
}
