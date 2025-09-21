const interpolateColor = (color1: string, color2: string, factor: number): string => {
  // Ensure both colors are 8-character hex codes (add alpha channel if missing)
  const c1 = color1.length === 7 ? `${color1}ff` : color1; // Add full opacity if missing
  const c2 = color2.length === 7 ? `${color2}ff` : color2;

  // Parse the colors as integers
  const c1Int = parseInt(c1.slice(1), 16);
  const c2Int = parseInt(c2.slice(1), 16);

  // Extract RGBA components
  const r1 = (c1Int >> 24) & 0xff;
  const g1 = (c1Int >> 16) & 0xff;
  const b1 = (c1Int >> 8) & 0xff;
  const a1 = c1Int & 0xff;

  const r2 = (c2Int >> 24) & 0xff;
  const g2 = (c2Int >> 16) & 0xff;
  const b2 = (c2Int >> 8) & 0xff;
  const a2 = c2Int & 0xff;

  // Interpolate each channel
  const r = Math.round(r1 * (1 - factor) + r2 * factor);
  const g = Math.round(g1 * (1 - factor) + g2 * factor);
  const b = Math.round(b1 * (1 - factor) + b2 * factor);
  const a = Math.round(a1 * (1 - factor) + a2 * factor);

  // Return the interpolated color as an 8-character hex code
  return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}${a.toString(16).padStart(2, '0')}`;
};

export const setTheme = (themeValue: number): void => {
  const root = document.documentElement;

  const colorsSuffixes: string[] = [
    '-highlight',
    '-highlight-bg',
    '-subtitle-text',
    '-button-bg',
    '-button-bg-hover',
    '-pollution-indicator',
    '-pollution-indicator-border',
  ];

  colorsSuffixes.forEach((color) => {
    const blueColor = getComputedStyle(root).getPropertyValue(`--blue${color}`).trim();
    const pinkColor = getComputedStyle(root).getPropertyValue(`--pink${color}`).trim();
    const interpolatedColor = interpolateColor(blueColor, pinkColor, themeValue);
    console.log(`Setting --color${color} to ${interpolatedColor}`, blueColor, pinkColor, themeValue);
    root.style.setProperty(`--color${color}`, interpolatedColor);
  });
};