import React, { createContext, useContext } from 'react';

export const PresentationContext = createContext({ isPresenting: false });

export const usePresentation = () => useContext(PresentationContext);
