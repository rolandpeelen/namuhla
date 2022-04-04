const THEME_KEY_LOCALSTORAGE = "THEME_KEY_LOCALSTORAGE";

const themes = {
  LIGHT: "light",
  DARK: "dark",
};

const light = {
  name: themes.LIGHT,
  background: "#fefefe",
  text: "#25283a",
};
const dark = {
  name: themes.DARK,
  background: "#25283a",
  text: "#a9b1d3",
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

const defineDarkTheme = monaco => {
    monaco.editor.defineTheme("dark", {
      base: "vs-dark",
      inherit: true,
      rules: [],
      colors: {
        "editor.background": dark.background,
      },
    });
}

const defineLightTheme = monaco => {
    monaco.editor.defineTheme("light", {
      base: "vs",
      inherit: true,
      rules: [],
      colors: {
        "editor.background": light.background,
      },
    });
}

const defineThemes = monaco => defineLightTheme(monaco) && defineDarkTheme(monaco);

export { THEME_KEY_LOCALSTORAGE, themes, getTheme, defineThemes };
