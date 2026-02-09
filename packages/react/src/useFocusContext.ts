import { useContext, createContext } from 'react';
import { ROOT_FOCUS_KEY } from '@noriginmedia/norigin-spatial-navigation-core';

export const FocusContext = createContext(ROOT_FOCUS_KEY);
FocusContext.displayName = 'FocusContext';

/** @internal */
export const useFocusContext = () => useContext(FocusContext);
