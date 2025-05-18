import { Dimensions } from "react-native";
const { width, height } = Dimensions.get("window");

export const COLORS = {
    // base colors
    primary: "#F96D41",
    secondary: "#25282F",

    // colors
    black: "#1E1B26",
    white: "#FFFFFF",
    lightGray: "#64676D",
    lightGray2: "#EFEFF0",
    lightGray3: '#D4D5D6',
    lightGray4: '#7D7E84',
    gray: "#2D3038",
    gray1: "#282C35",
    darkRed: "#31262F",
    lightRed: "#C5505E",
    darkBlue: "#22273B",
    lightBlue: "#424BAF",
    darkGreen: "#213432",
    lightGreen: "#31Ad66",

};

export const colors = {
  text: {
    base: COLORS.black,
    subtle: COLORS.lightGray,
    dark: COLORS.black,
    light: COLORS.white,
  },
  primary: {
    0: COLORS.white,
    50: "#FFF1ED", // Lighter version of primary
    100: "#FFE4DB", // Lighter version of primary
    200: "#FFD7C9", // Lighter version of primary
    300: "#FFCAB7", // Lighter version of primary
    400: "#FFBDA5", // Lighter version of primary
    500: COLORS.primary,
    600: "#E05A30", // Darker version of primary
    700: "#C7471F", // Darker version of primary
    800: "#AE340E", // Darker version of primary
    900: "#952100", // Darker version of primary
    950: "#7C1900", // Darker version of primary
  },
  secondary: {
    0: COLORS.white,
    50: "#F5F5F6", // Lighter version of secondary
    100: "#EBEBEC", // Lighter version of secondary
    200: "#D1D2D4", // Lighter version of secondary
    300: "#B7B8BC", // Lighter version of secondary
    400: "#9D9EA3", // Lighter version of secondary
    500: COLORS.secondary,
    600: "#1E2026", // Darker version of secondary
    700: "#17181D", // Darker version of secondary
    800: "#101114", // Darker version of secondary
    900: "#09090B", // Darker version of secondary
    950: "#020203", // Darker version of secondary
  },
  typography: {
    0: COLORS.white,
    50: COLORS.lightGray2,
    100: COLORS.lightGray3,
    200: COLORS.lightGray3,
    300: COLORS.lightGray3,
    400: COLORS.lightGray4,
    500: COLORS.lightGray,
    600: COLORS.lightGray,
    700: COLORS.gray,
    800: COLORS.gray1,
    900: COLORS.black,
    950: COLORS.black,
  },
  error: {
    0: "#FFF5F5",
    50: "#FFF0F0",
    100: "#FFE0E0",
    200: "#FFC7C7",
    300: "#FFA8A8",
    400: "#FF8A8A",
    500: COLORS.lightRed,
    600: "#B03A47",
    700: "#9B2530",
    800: "#86101A",
    900: COLORS.darkRed,
    950: "#220D14",
  },
  success: {
    0: "#F0FFF4",
    50: "#E6FFE9",
    100: "#D1FFD9",
    200: "#A3F9B9",
    300: "#75F49A",
    400: "#47EF7B",
    500: COLORS.lightGreen,
    600: "#259A4F",
    700: "#197738",
    800: "#0D5421",
    900: COLORS.darkGreen,
    950: "#0A1F0E",
  },
  info: {
    0: "#F0F4FF",
    50: "#E6EDFF",
    100: "#D1DFFF",
    200: "#A3BFFF",
    300: "#75A0FF",
    400: "#4780FF",
    500: COLORS.lightBlue,
    600: "#3A3D9B",
    700: "#2D3087",
    800: "#202373",
    900: COLORS.darkBlue,
    950: "#131522",
  },
  outline: {
    0: COLORS.white,
    50: COLORS.lightGray2,
    100: COLORS.lightGray2,
    200: COLORS.lightGray3,
    300: COLORS.lightGray3,
    400: COLORS.lightGray4,
    500: COLORS.lightGray,
    600: COLORS.lightGray,
    700: COLORS.gray,
    800: COLORS.gray,
    900: COLORS.gray1,
    950: COLORS.black,
  },
  background: {
    0: COLORS.white,
    50: "#FAFAFA",
    100: "#F5F5F5",
    200: COLORS.lightGray2,
    300: COLORS.lightGray2,
    400: COLORS.lightGray3,
    500: COLORS.lightGray3,
    600: COLORS.lightGray4,
    700: COLORS.lightGray,
    800: COLORS.gray,
    900: COLORS.gray1,
    950: COLORS.black,
    error: "#FFF5F5",
    warning: "#FFFAF0",
    success: "#F0FFF4",
    muted: "#F6F6F7",
    info: "#F0F4FF",
  },
  indicator: {
    primary: COLORS.primary,
    info: COLORS.lightBlue,
    error: COLORS.lightRed,
  },
}


export const SIZES = {
    // global sizes
    base: 8,
    font: 14,
    radius: 12,
    padding: 24,
    padding2: 36,

    // font sizes
    largeTitle: 50,
    h1: 30,
    h2: 22,
    h3: 16,
    h4: 14,
    body1: 30,
    body2: 20,
    body3: 16,
    body4: 14,

    // app dimensions
    width,
    height
};

export const FONTS = {
    largeTitle: { fontFamily: "Roboto-regular", fontSize: SIZES.largeTitle, lineHeight: 55 },
    h1: { fontFamily: "Roboto-Black", fontSize: SIZES.h1, lineHeight: 36 },
    h2: { fontFamily: "Roboto-Bold", fontSize: SIZES.h2, lineHeight: 30 },
    h3: { fontFamily: "Roboto-Bold", fontSize: SIZES.h3, lineHeight: 22 },
    h4: { fontFamily: "Roboto-Bold", fontSize: SIZES.h4, and: 22 },
    body1: { fontFamily: "Roboto-Regular", fontSize: SIZES.body1, lineHeight: 36 },
    body2: { fontFamily: "Roboto-Regular", fontSize: SIZES.body2, lineHeight: 30 },
    body3: { fontFamily: "Roboto-Regular", fontSize: SIZES.body3, lineHeight: 22 },
    body4: { fontFamily: "Roboto-Regular", fontSize: SIZES.body4, lineHeight: 22 },
};

const appTheme = { COLORS, SIZES, FONTS };

export default appTheme;