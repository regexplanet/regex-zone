import type { MetaFunction } from "@remix-run/node";
import { Welcome } from "~/components/Welcome/Welcome";
import { ColorSchemeToggle } from "~/components/ColorSchemeToggle/ColorSchemeToggle";
import { HeaderSearch } from "~/components/HeaderSearch/HeaderSearch";

export const meta: MetaFunction = () => {
  return [
    { title: "Regex Zone" },
    { name: "description", content: "Useful regular expression resources" },
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
