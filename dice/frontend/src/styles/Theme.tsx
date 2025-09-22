import CssBaseline from '@mui/material/CssBaseline'
import { createTheme, type ThemeOptions, ThemeProvider } from '@mui/material/styles'
import merge from 'lodash/merge'
import { BORDER_RADIUS, DARK_BUTTON_STYLES, FONT_SIZES, PALETTE, SPACING } from './styleConsts'

const TAB_HEIGHT = '36px' // for some reason all are needed.

// Base theme options shared between light and dark
const baseThemeOptions: ThemeOptions = {
  components: {
    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: BORDER_RADIUS.ZERO.PX
        }
      }
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          minHeight: TAB_HEIGHT
        },
        indicator: {
          display: 'none' // hide globally
        }
      }
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          minHeight: TAB_HEIGHT,
          height: TAB_HEIGHT
        }
      }
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          display: 'list-item',
          margin: 0,
          padding: SPACING.TINY.PX
        }
      }
    },
    MuiList: {
      styleOverrides: {
        root: {
          listStyleType: 'square'
        }
      }
    },
    MuiSwitch: {
      styleOverrides: {
        track: {
          borderRadius: 0
        },
        root: {
          borderRadius: 0
        }
      }
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          borderRadius: 0
        }
      }
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: BORDER_RADIUS.ZERO.PX
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: BORDER_RADIUS.ZERO.PX,
          boxShadow: 'none',
          cursor: 'pointer',
          '&:hover': {
            boxShadow: 'none'
          },
          '&:disabled': {
            cursor: 'not-allowed'
          }
        },
        contained: {
          fontWeight: 900
        },
        outlined: {
          fontWeight: 600
        }
      }
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          borderRadius: BORDER_RADIUS.ZERO.PX
        }
      }
    }
  },
  typography: {
    fontFamily: '"Satoshi", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: FONT_SIZES.HUGE.PX,
      fontWeight: 900
    },
    h2: {
      fontSize: FONT_SIZES.LARGE.PX,
      fontWeight: 900
    },
    h3: {
      fontSize: FONT_SIZES.MEDIUM.PX,
      fontWeight: 900
    },
    body1: {
      fontSize: FONT_SIZES.MEDIUM.PX
    },
    body2: {
      fontSize: FONT_SIZES.SMALL.PX
    }
  }
}

const darkThemeOptions: ThemeOptions = {
  palette: {
    mode: 'dark',
    background: {
      default: PALETTE.grayscale[900],
      paper: PALETTE.grayscale[800]
    },
    info: {
      main: PALETTE.grayscale[200],
      contrastText: PALETTE.grayscale[800]
    },
    error: {
      main: PALETTE.grayscale[200],
      contrastText: PALETTE.grayscale[800]
    },
    text: {
      primary: PALETTE.grayscale[100],
      secondary: PALETTE.grayscale[200]
    },
    divider: PALETTE.grayscale[700]
  },
  typography: {
    h1: {
      color: PALETTE.grayscale[100]
    },
    h2: {
      color: PALETTE.grayscale[100]
    },
    h3: {
      color: PALETTE.grayscale[100]
    },
    body1: {
      color: PALETTE.grayscale[100]
    },
    body2: {
      color: PALETTE.grayscale[100]
    }
  },
  components: {
    MuiSwitch: {
      styleOverrides: {
        thumb: {
          borderRadius: 0
        },
        switchBase: {
          color: PALETTE.grayscale[500],
          '&.Mui-checked': {
            color: PALETTE.grayscale[200]
          },
          '&.Mui-checked + .MuiSwitch-track': {
            backgroundColor: PALETTE.grayscale[200]
          }
        },
        track: {
          backgroundColor: PALETTE.grayscale[600]
        }
      }
    },
    MuiTabs: {
      styleOverrides: {
        indicator: {
          backgroundColor: PALETTE.grayscale[200] // underline color
        }
      }
    },
    MuiTab: {
      styleOverrides: {
        root: {
          color: PALETTE.grayscale[200], // text color
          '&.Mui-selected': {
            backgroundColor: PALETTE.grayscale[700],
            color: PALETTE.grayscale[200]
          },
          '&:hover': {
            backgroundColor: PALETTE.grayscale[100],
            color: PALETTE.grayscale[900]
          }
        }
      }
    },
    MuiLink: {
      styleOverrides: {
        root: {
          color: PALETTE.grayscale[100],
          '&:hover': {
            color: PALETTE.grayscale[100]
          },
          '&:visited': {
            color: PALETTE.grayscale[100]
          }
        }
      }
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          color: PALETTE.grayscale[300],
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: PALETTE.grayscale[300]
          }
        },
        notchedOutline: {
          borderColor: PALETTE.grayscale[600]
        }
      }
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          '&.Mui-focused': {
            color: PALETTE.grayscale[300]
          }
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        contained: {
          color: DARK_BUTTON_STYLES.color,
          backgroundColor: DARK_BUTTON_STYLES.background,
          '&:hover': {
            backgroundColor: DARK_BUTTON_STYLES.hoverBackground
          },
          '&:disabled': {
            backgroundColor: PALETTE.grayscale[700]
          }
        },
        outlined: {
          color: PALETTE.grayscale[100],
          borderColor: PALETTE.grayscale[200],
          '&:hover': {
            backgroundColor: PALETTE.grayscale[700]
          },
          '&:disabled': {
            textColor: PALETTE.grayscale[600]
          }
        },
        text: {
          color: PALETTE.grayscale[100],
          '&:hover': {
            backgroundColor: PALETTE.grayscale[700]
          },
          '&:disabled': {
            textColor: PALETTE.grayscale[700]
          }
        }
      }
    }
  }
}

const darkTheme = createTheme(merge(baseThemeOptions, darkThemeOptions))
// const lightTheme = createTheme(merge(baseThemeOptions, lightThemeOptions));

const AppThemeProvider = ({ children }: { children: React.ReactNode }) => {
  // const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  // const theme = useMemo(
  //   () => (prefersDarkMode ? darkTheme : lightTheme),
  //   [prefersDarkMode]
  // );

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  )
}

export default AppThemeProvider
