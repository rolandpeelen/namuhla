import { THEME_KEY_LOCALSTORAGE, themes } from "../utils/theme.js";

import React from "react";

const getFromLocalStorage = () => {
  const data = localStorage.getItem(THEME_KEY_LOCALSTORAGE);
  return !!data ? data : themes.LIGHT;
};

export const useDarkMode = () => {
  const [theme, setTheme] = React.useState(themes.LIGHT);
  const [darkModeReady, setDarkModeReady] = React.useState(false);

  const handleSetTheme = React.useCallback(
    (newTheme) => {
      localStorage.setItem(THEME_KEY_LOCALSTORAGE, newTheme);
      setTheme(newTheme);
      /* eslint-disable-next-line */
    },
    [setTheme]
  );

  React.useEffect(() => {
    setTheme(getFromLocalStorage());
    setDarkModeReady(true);
    /* eslint-disable-next-line */
  }, []);

  return [theme, handleSetTheme, darkModeReady];
};
