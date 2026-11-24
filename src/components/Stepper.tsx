import { IonIcon } from '@ionic/react';
import { checkmark } from 'ionicons/icons';
import type { JSX } from 'react';

import './Stepper.css';

type StepperProps = {
  steps: readonly string[];
  /** 1-based index of the step currently in progress. */
  current: number;
};

const Stepper = ({ steps, current }: StepperProps): JSX.Element => {
  const progress = steps.length > 1 ? ((current - 1) / (steps.length - 1)) * 100 : 0;

  return (
    <div className="sst-stepper">
      <span aria-hidden="true" className="sst-stepper__track">
        <span className="sst-stepper__fill" style={{ width: `${progress}%` }} />
      </span>

      <ol
        aria-label={`Paso ${current} de ${steps.length}`}
        className="sst-stepper__steps"
        style={{ gridTemplateColumns: `repeat(${steps.length}, 1fr)` }}
      >
        {steps.map((step, index) => {
          const number = index + 1;
          const state = number < current ? 'done' : number === current ? 'current' : 'pending';

          return (
            <li className={`sst-stepper__step sst-stepper__step--${state}`} key={step}>
              <span aria-hidden="true" className="sst-stepper__dot">
                {state === 'done' ? <IonIcon icon={checkmark} /> : number}
              </span>
              <span className="sst-stepper__label">{step}</span>
            </li>
          );
        })}
      </ol>
    </div>
  );
};

export default Stepper;
