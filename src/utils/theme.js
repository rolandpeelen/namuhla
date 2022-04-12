import chroma from "chroma-js";

const THEME_KEY_LOCALSTORAGE = "THEME_KEY_LOCALSTORAGE";

const kinds = {
  LIGHT: "light",
  DARK: "dark",
};

const themes = {
  LIGHT: "light",
  DARK: "dark",
};

const base = {
  borderRadius: "5px",
  sun: "#fff474",
  moon: "#3c3b5f",
}

const light = {
  ...base,
  name: themes.LIGHT,
  kind: themes.LIGHT,
  accent: "#51a791",
  background: "#e9eaf0",
  text: "#111424",
};

const dark = {
  ...base,
  name: themes.DARK,
  kind: themes.DARK,
  accent: "#51a791",
  background: "#24283b",
  text: "#a9b1d6",
};

const derive = (base) => ({
  ...base,
  backgroundL1: chroma(base.background).brighten(0.1).hex(),
  backgroundL2: chroma(base.background).brighten(0.25).hex(),
  backgroundL3: chroma(base.background).brighten(0.5).hex(),
  backgroundD1: chroma(base.background).darken(0.1).hex(),
  backgroundD2: chroma(base.background).darken(0.25).hex(),
  backgroundD3: chroma(base.background).darken(0.5).hex(),
})

const getTheme = (theme) => {
  switch (theme) {
    case themes.LIGHT:
      return derive(light);
    case themes.DARK:
      return derive(dark);
    default:
      return light;
  }
};

export { THEME_KEY_LOCALSTORAGE, themes, kinds, getTheme };
