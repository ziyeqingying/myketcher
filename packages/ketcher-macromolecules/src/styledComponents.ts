import styled from '@emotion/styled';

export const EditorWrapper = styled.div(() => ({
  height: '100%',
}));

export const TogglerComponentWrapper = styled.div(() => ({
  background: '',
  '&.toggler-component-wrapper--disabled': {
    opacity: 0.4,
    pointerEvents: 'none',
    cursor: 'default',
  },
}));
