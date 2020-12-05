import { Button, Menu, MenuItem, Popover } from "@blueprintjs/core";
import React, { useCallback } from "react";
import { useStoreActions, useStoreState } from "../../hooks";

import { useTranslation } from "react-i18next";

export const LanguageMenuContainer = () => {
  const { i18n } = useTranslation();

  const { language } = useStoreState((actions) => actions.idiom);
  const { setLanguage } = useStoreActions((actions) => actions.idiom);

  const changeLanguage = useCallback(
    (
      lng:
        | "ch"
        | "de"
        | "en"
        | "es"
        | "fa"
        | "fr"
        | "it"
        | "nl"      
        | "pl"
        | "pr"
        | "ru"
        | "tr"
        | "ua"
        | "sl"
    ) => {
      i18n.changeLanguage(lng);
      setLanguage(lng);
      require("electron-log").info(`Setting language to: ${lng}`);
    },
    [i18n, setLanguage]
  );

  return (
    <Popover
      content={
        <Menu>
          <MenuItem
            icon={language === "ch" ? "tick" : undefined}
            text="中文"
            onClick={() => changeLanguage("ch")}
          />
          <MenuItem
            icon={language === "de" ? "tick" : undefined}
            text="Deutsch"
            onClick={() => changeLanguage("de")}
          />
          <MenuItem
            icon={language === "en" ? "tick" : undefined}
            text="English"
            onClick={() => changeLanguage("en")}
          />
          <MenuItem
            icon={language === "es" ? "tick" : undefined}
            text="Español"
            onClick={() => changeLanguage("es")}
          />
          <MenuItem
            icon={language === "fa" ? "tick" : undefined}
            text="فارسی"
            onClick={() => changeLanguage("fa")}
          />
          <MenuItem
            icon={language === "fr" ? "tick" : undefined}
            text="Français"
            onClick={() => changeLanguage("fr")}
          />
          <MenuItem
            icon={language === "it" ? "tick" : undefined}
            text="Italiano"
            onClick={() => changeLanguage("it")}
          />
          <MenuItem
            icon={language === "nl" ? "tick" : undefined}
            text="Nederlands"
            onClick={() => changeLanguage("nl")}
          />
          <MenuItem
            icon={language === "pl" ? "tick" : undefined}
            text="Polskie"
            onClick={() => changeLanguage("pl")}
          />
          <MenuItem
            icon={language === "pr" ? "tick" : undefined}
            text="Português"
            onClick={() => changeLanguage("pr")}
          />
          <MenuItem
            icon={language === "ru" ? "tick" : undefined}
            text="Pусский"
            onClick={() => changeLanguage("ru")}
          />
          <MenuItem
            icon={language === "tr" ? "tick" : undefined}
            text="Türkçe"
            onClick={() => changeLanguage("tr")}
          />
          <MenuItem
            icon={language === "ua" ? "tick" : undefined}
            text="Україна"
            onClick={() => changeLanguage("ua")}
          />
          <MenuItem
            icon={language === "sl" ? "tick" : undefined}
            text="Slovenščina"
            onClick={() => changeLanguage("sl")}
          />
        </Menu>
      }
    >
      <Button icon="translate" minimal={true} large={true} />
    </Popover>
  );
};
