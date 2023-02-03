import React from 'react';
import * as S from './References.styles';

export const References: React.FC = () => {
  return (
    <S.ReferencesWrapper>
      <S.Text>
        CornKernels - 
        <a href="#" target="_blank" rel="noreferrer">
        {' '}Corn Kernels Management{' '}
        </a>
        in 2022 &copy;
      </S.Text>
    </S.ReferencesWrapper>
  );
};