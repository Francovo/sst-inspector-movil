import { IonIcon } from '@ionic/react';
import { eyeOffOutline, eyeOutline } from 'ionicons/icons';
import type { JSX } from 'react';
import { useState } from 'react';

import TextField from './TextField';
import type { TextFieldProps } from './TextField';

type PasswordFieldProps = Omit<TextFieldProps, 'type' | 'trailing'>;

/**
 * Password input with its own visibility toggle, so every form gets the same
 * behaviour without repeating state or markup.
 */
const PasswordField = (props: PasswordFieldProps): JSX.Element => {
  const [visible, setVisible] = useState(false);

  return (
    <TextField
      {...props}
      trailing={
        <button
          aria-label={visible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          className="sst-field__action"
          onClick={() => setVisible((current) => !current)}
          type="button"
        >
          <IonIcon icon={visible ? eyeOffOutline : eyeOutline} />
        </button>
      }
      type={visible ? 'text' : 'password'}
    />
  );
};

export default PasswordField;
