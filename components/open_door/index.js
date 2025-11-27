import styled from "styled-components";

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

const HouseImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
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

export default function OpenDoorView({ onEnter }) {
  return (
    <OpenContainer>
      <HouseImage src="/house2/house_2.png" alt="Open Door" />
      <EnterButton onClick={onEnter}>
        입장하기
      </EnterButton>
    </OpenContainer>
  );
}
