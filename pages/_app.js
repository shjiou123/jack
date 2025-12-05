import "@/styles/globals.css";
import CustomScrollCloud from "@/components/CustomScrollCloud";

export default function App({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      {/* 오른쪽 고정 구름 스크롤바 */}
      <CustomScrollCloud />
    </>
  );
}
