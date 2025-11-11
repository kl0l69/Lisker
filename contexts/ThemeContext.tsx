import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';

type ThemeMode = 'light' | 'dark';
type ThemeColor = 'blue' | 'oliva' | 'zinc' | 'rose';
type VisualStyle = 'solid' | 'glass' | 'neon';

interface Theme {
  [key: string]: { [key: string]: string };
}

const themes: Theme = {
  blue: {
    '50': '239 246 255', '100': '219 234 254', '200': '191 219 254', '300': '147 197 253',
    '400': '96 165 250', '500': '59 130 246', '600': '37 99 235', '700': '29 78 216',
    '800': '30 64 175', '900': '30 58 138', '950': '23 37 84',
  },
  oliva: {
    '50': '247 254 231', '100': '236 252 203', '200': '217 249 157', '300': '190 242 100',
    '400': '163 230 53', '500': '132 204 22', '600': '101 163 13', '700': '82 113 28',
    '800': '63 98 12', '900': '53 79 12', '950': '30 46 8',
  },
  zinc: {
    '50': '250 250 250', '100': '244 244 245', '200': '228 228 231', '300': '212 212 216',
    '400': '161 161 170', '500': '113 113 122', '600': '82 82 91', '700': '63 63 70',
    '800': '39 39 42', '900': '24 24 27', '950': '9 9 11',
  },
  rose: {
    '50': '255 241 242', '100': '255 228 230', '200': '254 205 211', '300': '253 164 175',
    '400': '251 113 133', '500': '244 63 94', '600': '225 29 72', '700': '190 18 60',
    '800': '159 18 57', '900': '136 19 55', '950': '76 5 25',
  },
};

const themeOrder: ThemeColor[] = ['blue', 'oliva', 'zinc', 'rose'];
const styleOrder: VisualStyle[] = ['glass', 'solid', 'neon'];

interface ThemeContextType {
  themeMode: ThemeMode;
  toggleThemeMode: () => void;
  themeColor: ThemeColor;
  setThemeColor: (color: ThemeColor) => void;
  cycleThemeColor: () => void;
  visualStyle: VisualStyle;
  cycleVisualStyle: () => void;
  availableThemes: Theme;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => {
    const storedTheme = localStorage.getItem('themeMode');
    if (storedTheme === 'dark' || storedTheme === 'light') {
      return storedTheme;
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  const [themeColor, setThemeColorState] = useState<ThemeColor>(() => {
    const storedColor = localStorage.getItem('themeColor') as ThemeColor;
    return storedColor && themes[storedColor] ? storedColor : 'blue';
  });

  const [visualStyle, setVisualStyle] = useState<VisualStyle>(() => {
    const storedStyle = localStorage.getItem('visualStyle') as VisualStyle;
    return styleOrder.includes(storedStyle) ? storedStyle : 'glass';
  });

  useEffect(() => {
    const root = window.document.documentElement;

    // Handle light/dark mode
    root.classList.remove('light', 'dark');
    root.classList.add(themeMode);
    localStorage.setItem('themeMode', themeMode);

    // Handle visual style
    root.classList.remove('theme-solid', 'theme-glass', 'theme-neon');
    root.classList.add(`theme-${visualStyle}`);
    localStorage.setItem('visualStyle', visualStyle);

    // Handle color theme
    const selectedTheme = themes[themeColor];
    for (const [shade, value] of Object.entries(selectedTheme)) {
      root.style.setProperty(`--color-primary-${shade}`, value);
    }
    localStorage.setItem('themeColor', themeColor);

  }, [themeMode, themeColor, visualStyle]);

  const toggleThemeMode = () => {
    setThemeMode((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };
  
  const setThemeColor = (color: ThemeColor) => {
    setThemeColorState(color);
  }

  const cycleThemeColor = () => {
    setThemeColorState(prevColor => {
      const currentIndex = themeOrder.indexOf(prevColor);
      const nextIndex = (currentIndex + 1) % themeOrder.length;
      return themeOrder[nextIndex];
    });
  };

  const cycleVisualStyle = () => {
    setVisualStyle(prevStyle => {
      const currentIndex = styleOrder.indexOf(prevStyle);
      const nextIndex = (currentIndex + 1) % styleOrder.length;
      return styleOrder[nextIndex];
    });
  };

  return (
    <ThemeContext.Provider value={{ themeMode, toggleThemeMode, themeColor, setThemeColor, cycleThemeColor, visualStyle, cycleVisualStyle, availableThemes: themes }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};