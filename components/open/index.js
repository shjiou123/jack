import { useState } from "react";
import { useRouter } from "next/router";
import { Main, GlobalStyles, BurstWrap, BurstImg, BurstWrapBR } from "../popup/styles";

export default function OpeningView() {
  const router = useRouter();
  const [b1Popping, setB1Popping] = useState(false);
  const [b2Popping, setB2Popping] = useState(false);
  const [b1Gone, setB1Gone] = useState(false);
  const [b2Gone, setB2Gone] = useState(false);

  const tryProceed = () => {
    if (b1Gone && b2Gone) router.push("/stem");
  };

  return (
    <Main>
      <GlobalStyles />
      {!b1Gone && (
        <BurstWrap
          className={b1Popping ? "popping" : ""}
          onClick={() => setB1Popping(true)}
          onAnimationEnd={() => {
            if (b1Popping) {
              setB1Gone(true);
              tryProceed();
            }
          }}
        >
          <BurstImg src="/bubble/버블뭉치1.png" alt="burst1" />
        </BurstWrap>
      )}
      {!b2Gone && (
        <BurstWrapBR
          className={b2Popping ? "popping" : ""}
          onClick={() => setB2Popping(true)}
          onAnimationEnd={() => {
            if (b2Popping) {
              setB2Gone(true);
              tryProceed();
            }
          }}
        >
          <BurstImg src="/bubble/버블뭉치2.png" alt="burst2" />
        </BurstWrapBR>
      )}
    </Main>
  );
}