const THEME_KEY_LOCALSTORAGE = "THEME_KEY_LOCALSTORAGE";

const themes = {
  LIGHT: "light",
  DARK: "dark",
};

const light = {
  name: themes.LIGHT,
  background: "#e9eaf0",
  backgroundHover: "#e9eaf0",
  inverseBackground: "#25283a",
  text: "#111424",
  inverseText: "#a9b1d3",
  borderRadius: "5px",
};
const dark = {
  name: themes.DARK,
  background: "#25283a",
  inverseBackground: "#e9eaf0",
  text: "#a9b1d3",
  inverseText: "#111424",
  borderRadius: "5px",
};

const getTheme = (theme) => {
  switch (theme) {
    case themes.LIGHT:
      return light;
    case themes.DARK:
      return dark;
    default:
      return light;
  }
};

const defineDarkTheme = (monaco) => {
  monaco.editor.defineTheme("dark", {
    base: "vs-dark",
    inherit: true,
    rules: [],
    colors: {
      "editor.background": dark.background,
    },
  });
};

const defineLightTheme = (monaco) => {
  monaco.editor.defineTheme("light", {
    base: "vs",
    inherit: true,
    rules: [],
    colors: {
      "editor.background": light.background,
    },
  });
};

const defineThemes = (monaco) =>
  defineLightTheme(monaco) && defineDarkTheme(monaco);

export { THEME_KEY_LOCALSTORAGE, themes, getTheme, defineThemes };
