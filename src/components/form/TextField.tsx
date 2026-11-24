import { IonIcon } from '@ionic/react';
import type { InputHTMLAttributes, JSX, ReactNode } from 'react';

import './FormControls.css';

export type TextFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'className' | 'id'> & {
  id: string;
  label: string;
  icon?: string;
  /** Optional control rendered inside the field, such as the password toggle. */
  trailing?: ReactNode;
};

const TextField = ({ id, label, icon, trailing, ...input }: TextFieldProps): JSX.Element => (
  <div className="sst-field">
    <label className="sst-field__label" htmlFor={id}>
      {label}
    </label>
    <div className={`sst-field__control${trailing ? ' sst-field__control--action' : ''}`}>
      {icon && (
        <span aria-hidden="true" className="sst-field__icon">
          <IonIcon icon={icon} />
        </span>
      )}
      <input className="sst-input" id={id} {...input} />
      {trailing}
    </div>
  </div>
);

export default TextField;
