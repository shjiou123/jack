import { GlobalStyles, Main, HouseWrap, HouseImg, Bubble, BubbleImg, CloseButton } from "./styles";

export default function PopupView() {
  return (
    <Main>
      <GlobalStyles />
      <HouseWrap className="houseWrap">
        <HouseImg src="/house_1.png" alt="Mushroom House" />

        <Bubble className="bubble" $top="18%" $left="21%" $width="20%" $dx="28px" $dy="18px" $dur="6.6s">
          <BubbleImg className="bubbleImg" src="/bubble/1.png" alt="bubble" $float="2.8s" />
        </Bubble>
        <Bubble className="bubble" $top="24%" $left="58%" $width="22%" $dx="32px" $dy="20px" $dur="5.7s">
          <BubbleImg className="bubbleImg" src="/bubble/1.png" alt="bubble" $float="2.4s" />
        </Bubble>
        <Bubble className="bubble" $top="38%" $left="34%" $width="18%" $dx="26px" $dy="18px" $dur="5.3s">
          <BubbleImg className="bubbleImg" src="/bubble/1.png" alt="bubble" $float="2.2s" />
        </Bubble>
        <Bubble className="bubble" $top="56%" $left="72%" $width="21%" $dx="34px" $dy="22px" $dur="7.2s">
          <BubbleImg className="bubbleImg" src="/bubble/1.png" alt="bubble" $float="3.0s" />
        </Bubble>
        <Bubble className="bubble" $top="64%" $left="42%" $width="19%" $dx="30px" $dy="20px" $dur="6.1s">
          <BubbleImg className="bubbleImg" src="/bubble/1.png" alt="bubble" $float="2.5s" />
        </Bubble>
        <Bubble className="bubble" $top="76%" $left="16%" $width="24%" $dx="36px" $dy="24px" $dur="7.8s">
          <BubbleImg className="bubbleImg" src="/bubble/1.png" alt="bubble" $float="3.2s" />
        </Bubble>
      </HouseWrap>

      <CloseButton onClick={() => window.close()}>닫기</CloseButton>
    </Main>
  );
}


