import { IonToast } from '@ionic/react';
import type { JSX } from 'react';

type ErrorToastProps = {
  message: string | null;
  onDismiss: () => void;
};

/** Small error surface shared by the camera and evidence screens. */
const ErrorToast = ({ message, onDismiss }: ErrorToastProps): JSX.Element => (
  <IonToast
    color="danger"
    duration={3000}
    isOpen={Boolean(message)}
    message={message ?? ''}
    onDidDismiss={onDismiss}
    position="top"
  />
);

export default ErrorToast;
