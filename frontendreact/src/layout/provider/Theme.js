import React, { useState, createContext, useContext, useEffect } from "react";
import classNames from "classnames";
import { useCallback } from "react";
const ThemeContext = createContext();
const ThemeUpdateContext = createContext();

export function useTheme() {
  return useContext(ThemeContext);
}

export function useThemeUpdate() {
  return useContext(ThemeUpdateContext);
}

const ThemeProvider = ({ ...props }) => {
  const defaultTheme = {
    main: "default", //other value can be passed "clean,shady,softy"
    sidebar: "dark", //other value can be passed "light,white,theme"
    sidebarCompact: false,
    sidebarVisibility: false,
    sidebarMobile: false,
    header: "white", //other value can be passed "light,dark,theme"
    skin: "light", //other value can be passed "dark"
  };
  const [theme, setTheme] = useState(defaultTheme);

  const themeUpdate = {
    uistyle: function (value) {
      setTheme({ ...theme, main: value });
    },
    sidebar: function (value) {
      setTheme({ ...theme, sidebar: value });
    },
    sidebarCompact: function (e) {
      setTheme({ ...theme, sidebarCompact: !theme.sidebarCompact });
    },
    sidebarVisibility: function (e) {
      setTheme({ ...theme, sidebarVisibility: !theme.sidebarVisibility });
    },
    sidebarHide: function (e) {
      setTheme({ ...theme, sidebarVisibility: false });
    },
    header: function (value) {
      setTheme({ ...theme, header: value });
    },
    skin: function (value) {
      setTheme({ ...theme, skin: value });
    },
    reset: function (e) {
      setTheme({
        ...theme,
        main: defaultTheme.main,
        sidebar: defaultTheme.sidebar,
        header: defaultTheme.header,
        skin: defaultTheme.skin,
      });
    },
  };

  // console.log(theme);

  const bodyClass = classNames({
    "nk-body bg-lighter npc-default has-sidebar no-touch nk-nio-theme": true,
  });

  // console.log(bodyClass);

  useEffect(() => {
    const body = document.querySelector("body");
    body.className = bodyClass;
  }, [bodyClass]);

  useEffect(() => {
    const body = document.querySelector("body");
    if (theme.main === "default") {
      body.classList.add("ui-default");
      body.classList.remove("ui-clean", "ui-shady", "ui-softy");
    }
    if (theme.main === "clean") {
      body.classList.add(`ui-clean`);
      body.classList.remove("ui-default", "ui-shady", "ui-softy");
    }
    if (theme.main === "shady") {
      body.classList.add(`ui-shady`);
      body.classList.remove("ui-default", "ui-clean", "ui-softy");
    }
    if (theme.main === "softy") {
      body.classList.add(`ui-softy`);
      body.classList.remove("ui-default", "ui-clean", "ui-shady");
    }
    if (theme.skin === "dark") {
      body.classList.add(`dark-mode`);
    } else {
      body.classList.remove("dark-mode");
    }
    if (theme.sidebarVisibility === true) {
      body.classList.add("nav-shown");
    } else {
      body.classList.remove("nav-shown");
    }
  }, [theme.main, theme.skin, theme.sidebarVisibility]);

  // const body = document.querySelector("body");

  const handleResize = useCallback(
    (entries) => {
      const width = entries[0].contentRect.width;

      if (width < 1200) {
        setTheme((prev) => ({ ...prev, sidebarMobile: true }));
      } else {
        setTheme((prev) => ({ ...prev, sidebarMobile: false, sidebarVisibility: false }));
      }
    },
    [setTheme]
  );

  useEffect(() => {
    const body = document.querySelector("body");
    const observer = new ResizeObserver(handleResize);
    observer.observe(body);

    // Cleanup function
    return () => {
      observer.disconnect();
    };
  }, [bodyClass, handleResize]);

  // const observer = new ResizeObserver((entries) => {
  //   let width = entries[0].contentRect.width;

  //   if (width < 1200) {
  //     setTheme({ ...theme, sidebarMobile: true });
  //   } else {
  //     setTheme({ ...theme, sidebarMobile: false, sidebarVisibility: false });
  //   }
  // });
  // observer.observe(body);

  return (
    <ThemeContext.Provider value={theme}>
      <ThemeUpdateContext.Provider value={themeUpdate}>{props.children}</ThemeUpdateContext.Provider>
    </ThemeContext.Provider>
  );
};
export default React.memo(ThemeProvider);
