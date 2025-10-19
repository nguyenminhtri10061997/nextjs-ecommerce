import type { CssVarsThemeOptions, ThemeOptions } from "@mui/material/styles";

export const themeConfig: Omit<ThemeOptions, "components"> &
  Pick<
    CssVarsThemeOptions,
    "defaultColorScheme" | "colorSchemes" | "components"
  > & {
    cssVariables?:
      | boolean
      | Pick<
          CssVarsThemeOptions,
          | "colorSchemeSelector"
          | "rootSelector"
          | "disableCssColorScheme"
          | "cssVarPrefix"
          | "shouldSkipGeneratingVar"
        >;
  } = {
  typography: {
    fontFamily: "var(--font-roboto)",
  },
  components: {
    MuiTextField: {
      defaultProps: {
        size: "small",
      },
    },
  },
  colorSchemes: {
    dark: true,
  },
  cssVariables: {
    colorSchemeSelector: "class",
  },
};
