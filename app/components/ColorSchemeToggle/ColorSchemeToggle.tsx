'use client';

import { Button, ButtonGroup } from 'react-bootstrap';

function setColorScheme(scheme: 'light' | 'dark' | 'auto') {
  if (scheme == 'auto') {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      scheme = 'dark';
    } else {
      scheme = 'light';
    }
  }
  document.documentElement.setAttribute('data-bs-theme', scheme);
}

export function ColorSchemeToggle() {

  return (
    <ButtonGroup>
      <Button onClick={() => setColorScheme('light')}>Light</Button>
      <Button onClick={() => setColorScheme('dark')}>Dark</Button>
      <Button onClick={() => setColorScheme('auto')}>Auto</Button>
    </ButtonGroup>
  );
}
