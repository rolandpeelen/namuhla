import { THEME_KEY_LOCALSTORAGE, themes, getTheme } from "../utils/theme.js";

import React from "react";

const getFromLocalStorage = () => {
  const data = localStorage.getItem(THEME_KEY_LOCALSTORAGE);
  return !!data ? data : themes.LIGHT;
};

export const useDarkMode = () => {
  const [theme, setTheme] = React.useState(themes.LIGHT);
  const themeProps = React.useMemo(() => getTheme(theme), [theme]);
  const [darkModeReady, setDarkModeReady] = React.useState(false);

  const toggleTheme = () =>
    setTheme((current) => {
      const newTheme = current === themes.LIGHT ? themes.DARK : themes.LIGHT;
      localStorage.setItem(THEME_KEY_LOCALSTORAGE, newTheme);
      return newTheme;
    });

  React.useEffect(() => {
    setTheme(getFromLocalStorage());
    setDarkModeReady(true);
  }, []);

  return [themeProps, theme, toggleTheme, darkModeReady];
};
