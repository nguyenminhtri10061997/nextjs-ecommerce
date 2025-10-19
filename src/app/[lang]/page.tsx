import { TLang } from "@/types/dictionaries";
import "reflect-metadata";
import { getDictionary } from "./dictionaries";

type TProps = {
  params: Promise<{ lang: TLang }>;
};

export default async function Home(props: TProps) {
  const { lang } = await props.params;
  const dict = await getDictionary(lang);
  console.log({
    dict,
  });

  return <div>this is home page</div>;
}
