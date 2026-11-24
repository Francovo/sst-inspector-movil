import type { ChangeEventHandler, JSX, RefObject } from 'react';

type PhotoFileInputProps = {
  inputRef: RefObject<HTMLInputElement | null>;
  onChange: ChangeEventHandler<HTMLInputElement>;
};

/** Hidden browser input used by `usePhotoCapture` as the web fallback. */
const PhotoFileInput = ({ inputRef, onChange }: PhotoFileInputProps): JSX.Element => (
  <input accept="image/*" hidden onChange={onChange} ref={inputRef} type="file" />
);

export default PhotoFileInput;
