/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "on-tertiary-fixed": "#261900",
        "inverse-primary": "#476083",
        "background": "#F5F5DC",
        "on-error-container": "#ffdad6",
        "on-surface-variant": "#4a4235",
        "on-secondary-fixed": "#241a00",
        "surface": "#F5F5DC",
        "on-primary": "#163152",
        "inverse-surface": "#4a4235",
        "surface-container-low": "#F5F5DC",
        "surface-container-lowest": "#F5F5DC",
        "surface-dim": "#F5F5DC",
        "primary-fixed": "#d4e3ff",
        "on-primary-fixed-variant": "#2f486a",
        "on-tertiary-fixed-variant": "#5c4300",
        "primary-fixed-dim": "#afc8f0",
        "error": "#ffb4ab",
        "surface-container-highest": "#ebebd2",
        "outline-variant": "#D4AF37",
        "on-primary-fixed": "#001c3a",
        "primary-container": "#F5F5DC",
        "inverse-on-surface": "#F5F5DC",
        "secondary": "#D4AF37",
        "secondary-fixed-dim": "#D4AF37",
        "on-tertiary-container": "#ab7f00",
        "on-secondary-container": "#342800",
        "surface-bright": "#F5F5DC",
        "tertiary": "#f6be3b",
        "on-secondary": "#F5F5DC",
        "surface-variant": "#ebebd2",
        "on-background": "#4a4235",
        "error-container": "#93000a",
        "secondary-fixed": "#ffe088",
        "surface-container": "#F5F5DC",
        "surface-tint": "#afc8f0",
        "tertiary-fixed-dim": "#f6be3b",
        "on-secondary-fixed-variant": "#574500",
        "on-surface": "#4a4235",
        "primary": "#D4AF37",
        "tertiary-container": "#291c00",
        "on-error": "#690005",
        "surface-container-high": "#F5F5DC",
        "on-tertiary": "#402d00",
        "on-primary-container": "#4a4235",
        "secondary-container": "#af8d11",
        "outline": "#8e9198",
        "tertiary-fixed": "#ffdea0"
      },
      borderRadius: {
        "DEFAULT": "0.25rem",
        "lg": "0.5rem",
        "xl": "0.75rem",
        "full": "9999px"
      },
      spacing: {
        "margin-desktop": "64px",
        "unit": "8px",
        "margin-mobile": "24px",
        "gutter": "32px",
        "container-max-width": "1120px"
      },
      fontFamily: {
        "script": ["\"Great Vibes\"", "cursive"],
        "body-lg": ["\"Source Serif 4\"", "serif"],
        "headline-lg": ["\"Playfair Display\"", "serif"],
        "label-caps": ["\"Source Serif 4\"", "serif"],
        "display-names": ["\"EB Garamond\"", "serif"],
        "headline-lg-mobile": ["\"Playfair Display\"", "serif"],
        "body-sm": ["\"Source Serif 4\"", "serif"],
        "headline-md": ["\"Playfair Display\"", "serif"]
      },
      fontSize: {
        "body-lg": ["18px", { "lineHeight": "28px", "fontWeight": "400" }],
        "headline-lg": ["40px", { "lineHeight": "48px", "letterSpacing": "0.02em", "fontWeight": "700" }],
        "label-caps": ["12px", { "lineHeight": "16px", "letterSpacing": "0.2em", "fontWeight": "600" }],
        "display-names": ["48px", { "lineHeight": "56px", "fontWeight": "400" }],
        "headline-lg-mobile": ["32px", { "lineHeight": "40px", "fontWeight": "700" }],
        "body-sm": ["14px", { "lineHeight": "20px", "fontWeight": "400" }],
        "headline-md": ["24px", { "lineHeight": "32px", "letterSpacing": "0.05em", "fontWeight": "600" }]
      }
    }
  },
  plugins: [],
}
