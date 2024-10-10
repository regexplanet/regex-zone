import React from "react";
import { default as UnencryptedCookies } from 'js-cookie';
import { RootLoaderData } from "~/types/RootLoaderData";
import { useRouteLoaderData } from "@remix-run/react";

function getColorScheme(defaultTheme?: "light" | "dark") {

  if (typeof window === 'undefined') {
    defaultTheme = defaultTheme || 'light';
    console.log("getColorScheme: window is undefined: ", defaultTheme);
    return defaultTheme;
  }

  if (document.documentElement.hasAttribute('data-bs-theme')) {
    console.log("getColorScheme: data-bs-theme: ", document.documentElement.getAttribute('data-bs-theme'));
    return document.documentElement.getAttribute('data-bs-theme');
  }

  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    console.log("getColorScheme: dark");
    return 'dark';
  } else {
    console.log("getColorScheme: light");
    return 'light';
  }
}

export function ColorSchemeToggle() {
  const rootData = useRouteLoaderData<RootLoaderData>("root") as unknown as RootLoaderData;
  const theme = rootData?.theme;

  return theme ? <ColorSchemeToggleComponent theme={theme} /> : null;
}

function ColorSchemeToggleComponent({ theme }: { theme: "light" | "dark"}) {

  const [ currentScheme, setColorScheme ] = React.useState(getColorScheme(theme));

  const onClick = (scheme: 'light' | 'dark' | 'auto') => {
    if (scheme == 'auto') {
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        scheme = 'dark';
      } else {
        scheme = 'light';
      }
    }
    UnencryptedCookies.set('color-theme', scheme, { path: '/' });
    localStorage.setItem('color-theme', scheme);
    document.documentElement.setAttribute('data-bs-theme', scheme);
    setColorScheme(scheme);
  }

  return (
    <div className="btn-group" role="group" aria-label="Color scheme selector">
      <button className={`btn btn-sm ${ currentScheme == 'light' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => onClick('light')}>Light</button>
      <button className={`btn btn-sm ${ currentScheme == 'dark' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => onClick('dark')}>Dark</button>
    </div>
  );
}