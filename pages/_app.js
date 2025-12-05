import "@/styles/globals.css";
import CustomScrollCloud from "@/components/CustomScrollCloud";
import { useRouter } from "next/router";

export default function App({ Component, pageProps }) {
  const router = useRouter();
  const isMainPage = router.pathname === "/main";

  return (
    <>
      <Component {...pageProps} />
      {/* 구름 스크롤바는 메인 페이지에서만 표시 */}
      {isMainPage && <CustomScrollCloud />}
    </>
  );
}
