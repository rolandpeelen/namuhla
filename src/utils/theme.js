const THEME_KEY_LOCALSTORAGE = "THEME_KEY_LOCALSTORAGE";

const themes = {
  LIGHT: "light",
  DARK: "dark",
};

const light = {
  background: "#fefefe",
  text: "#25283a",
};
const dark = {
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

export { THEME_KEY_LOCALSTORAGE, themes, getTheme };
