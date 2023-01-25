import { ButtonProps } from '@ui-shared/types/button';
import { Button } from '@widgets/button';
import { IconButton } from '@widgets/icon-button';
import { WrapLabel } from '@widgets/wrap-label';
import React, { useRef, useState } from 'react';

type Props = {
  value?: string;
  button?: ButtonProps;
  renderButton?: React.ReactNode;
  disableMessage?: boolean;
  disableReset?: boolean;
  onChange?: (file: File) => void;
} & WrapLabelProps;

export const FileSelector: React.FC<Props> = (props) => {
  const {
    value,
    onChange,
    button: buttonProps,
    renderButton,
    disableMessage,
    disableReset,
    ...wrapLabelProps
  } = props;

  const [state, setState] = useState<{ file: File }>({ file: null });

  const inputRef = useRef<HTMLInputElement>(null);

  const openFileDialog = (): void => {
    !wrapLabelProps.disabled && inputRef?.current.click();
  };

  const _onChange = (event): void => {
    const files = event.target.files as FileList;
    setState({ ...state, file: files.length && files[0] });
    onChange && onChange(files[0]);
  };

  const resetFile = (): void => {
    setState({ ...state, file: null });
    inputRef.current.value = '';
    onChange && onChange(null);
  };

  return (
    <WrapLabel {...wrapLabelProps} className="mercado-file-selector">
      {renderButton ? (
        <div className="action" onClick={openFileDialog}>
          {renderButton}
        </div>
      ) : (
        <Button
          {...buttonProps}
          kind={buttonProps?.kind || 'secondary'}
          disabled={wrapLabelProps.disabled}
          onClick={openFileDialog}
        >
          {buttonProps?.children || 'Seleccionar'}
        </Button>
      )}
      {!disableMessage && (
        <div className="message">{value || state.file?.name || `Ningún archivo seleccionado`}</div>
      )}
      {!disableReset && (value || state.file?.name) && (
        <IconButton icon="close" onClick={resetFile} />
      )}
      <input type="file" onChange={_onChange} ref={inputRef} />
    </WrapLabel>
  );
};
