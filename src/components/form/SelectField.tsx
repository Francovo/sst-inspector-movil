import { IonIcon } from '@ionic/react';
import { chevronDownOutline } from 'ionicons/icons';
import type { JSX, SelectHTMLAttributes } from 'react';

import './FormControls.css';

type SelectFieldProps = Omit<SelectHTMLAttributes<HTMLSelectElement>, 'className' | 'id'> & {
  id: string;
  label: string;
  icon?: string;
};

const SelectField = ({ id, label, icon, children, ...select }: SelectFieldProps): JSX.Element => (
  <div className="sst-field">
    <label className="sst-field__label" htmlFor={id}>
      {label}
    </label>
    <div className="sst-field__control">
      {icon && (
        <span aria-hidden="true" className="sst-field__icon">
          <IonIcon icon={icon} />
        </span>
      )}
      <select className="sst-select" id={id} {...select}>
        {children}
      </select>
      <span aria-hidden="true" className="sst-field__chevron">
        <IonIcon icon={chevronDownOutline} />
      </span>
    </div>
  </div>
);

export default SelectField;
