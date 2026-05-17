interface ColorPalette {
  text: string;
  subtext: string;
  textInverted: string;
  background: string;
  tint: string;
  icon: string;
  tabIconDefault: string;
  tabIconSelected: string;
  border: string;
}

export const Colors: { light: ColorPalette; dark: ColorPalette } = {
  light: {
    text: "#11181C",
    subtext: "#687076",
    textInverted: "#fff",
    background: "#fff",
    tint: "#3366aa",
    icon: "#687076",
    tabIconDefault: "#687076",
    tabIconSelected: "#3366aa",
    border: "#ECEDEE",
  },
  dark: {
    text: "#ECEDEE",
    subtext: "#878792",
    textInverted: "#fff",
    background: "#151718",
    tint: "#3366aa",
    icon: "#9BA1A6",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: "#3366aa",
    border: "#333333",
  },
};
