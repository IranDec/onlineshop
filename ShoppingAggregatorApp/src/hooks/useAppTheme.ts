import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { lightTheme, darkTheme, Theme } from '../constants/Colors';

export const useAppTheme = (): Theme => {
  const currentThemeMode = useSelector((state: RootState) => state.theme.mode);
  return currentThemeMode === 'dark' ? darkTheme : lightTheme;
};
