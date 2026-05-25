import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "服務費用 | SunCodeStudio - 謝上智",
    template: "%s | SunCodeStudio"
  },
  description: "SunCodeStudio 謝上智提供軟體專案接案與軟體教學顧問服務，提供客製化網頁開發、系統建置及程式設計實務指導，報價單位為新台幣 (TWD)。",
  keywords: ["軟體接案", "程式設計教學", "網頁開發", "客製化系統", "軟體顧問", "SunCodeStudio"],
  openGraph: {
    title: "服務費用 | SunCodeStudio - 謝上智",
    description: "軟體專案接案與教學顧問服務報價，涵蓋客製化網頁開發、系統建置及程式設計指導。",
    url: "https://sunzhi-will.github.io/pricing",
    siteName: "SunCodeStudio",
    locale: "zh_TW",
    type: "website",
  },
};
