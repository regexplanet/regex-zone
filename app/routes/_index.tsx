import type { MetaFunction } from "@remix-run/node";
import { Welcome } from "~/components/Welcome/Welcome";
import { ColorSchemeToggle } from "~/components/ColorSchemeToggle/ColorSchemeToggle";
import { HeaderSearch } from "~/components/HeaderSearch/HeaderSearch";

export const meta: MetaFunction = () => {
  return [
    { title: "Regex Zone" },
    { name: "description", content: "A library of useful regular expressions" },
  ];
};

export default function Index() {
  return (
    <>
      <HeaderSearch />
      <Welcome />
      <ColorSchemeToggle />
    </>
  );
}
