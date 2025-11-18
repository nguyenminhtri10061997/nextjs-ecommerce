import { Roboto, ABeeZee, Noto_Sans } from "next/font/google";

export const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-roboto",
});


export const aBeeZee = ABeeZee({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-ABeeZee",
});

export const notoSans = Noto_Sans({
  subsets: ['vietnamese'],
})
