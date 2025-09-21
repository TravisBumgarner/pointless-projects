export const PALETTE = {
  grayscale: {
    50: "#F9FAFB",
    100: "#F3F4F6",
    200: "#E5E7EB",
    300: "#D1D5DB",
    400: "#9CA3AF",
    500: "#6B7280",
    600: "#4B5563",
    700: "#374151",
    800: "#1F2937",
    900: "#111827",
  },
  wow: {
    blueLight: "rgba(109, 205, 235, 1)",
    blueDark: "#068EA6",
    redDark: "#a60606ff",
    redLight: "#fd2323ff",
    greenDark: "#49a606ff",
    greenLight: "#a6ff49ff",
    purpleDark: "#a606a1ff",
    purpleLight: "#fd49fdff",
    orangeDark: "#a64b06ff",
    orangeLight: "rgba(255, 166, 0, 1)",
  },
};

export const BORDER_RADIUS = {
  ZERO: {
    PX: "0px",
    INT: 0,
  },
};

export const FONT_SIZES = {
  SMALL: {
    PX: "12px",
    INT: 12,
  },
  MEDIUM: {
    PX: "16px",
    INT: 16,
  },
  LARGE: {
    PX: "24px",
    INT: 24,
  },
  HUGE: {
    PX: "32px",
    INT: 32,
  },
  HUGE_PLUS: {
    PX: "48px",
    INT: 48,
  },
};

export const SPACING = {
  TINY: {
    PX: "4px",
    INT: 4,
  },
  SMALL: {
    PX: "10px",
    INT: 10,
  },
  MEDIUM: {
    PX: "20px",
    INT: 20,
  },
  LARGE: {
    PX: "36px",
    INT: 36,
  },
  HUGE: {
    PX: "48px",
    INT: 48,
  },
} as const;

// // Button Styles. Used in <Button /> and Share.tsx
export const LIGHT_BUTTON_STYLES = {
  color: PALETTE.grayscale[50],
  background: PALETTE.grayscale[800],
  hoverBackground: PALETTE.grayscale[800],
};

export const DARK_BUTTON_STYLES = {
  color: PALETTE.grayscale[900],
  background: PALETTE.grayscale[100],
  hoverBackground: PALETTE.grayscale[300],
};
