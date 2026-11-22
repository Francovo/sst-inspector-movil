import { IonIcon } from '@ionic/react';
import {
  cameraOutline,
  chevronBackOutline,
  chevronForwardOutline,
  createOutline,
  shieldCheckmarkOutline,
} from 'ionicons/icons';
import type { JSX } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import PageHeading from '../../components/PageHeading';
import PageShell from '../../components/PageShell';
import './Formulario.css';

const QUESTION = {
  category: 'Condiciones de seguridad',
  code: 'CL-003',
  prompt:
    '¿Las vías de circulación (pasillos, escaleras y salidas) se encuentran libres de obstáculos y debidamente señalizadas?',
  help: 'Verifique que no haya objetos, equipos o materiales que impidan el paso y que la señalización sea visible y esté en buen estado.',
  position: 3,
  total: 10,
};

const OPTIONS = [
  { id: 'cumple', label: 'Cumple' },
  { id: 'no-cumple', label: 'No cumple' },
  { id: 'no-aplica', label: 'No aplica' },
] as const;

type Answer = (typeof OPTIONS)[number]['id'];

/**
 * Visual mockup of the "Formulario de Inspección" screen.
 * Only the first visible question is modelled; the rest of the checklist is
 * demo content, so the arrows move through the flow rather than the questions.
 */
const Formulario = (): JSX.Element => {
  const navigate = useNavigate();
  const [answer, setAnswer] = useState<Answer>('cumple');
  const [observation, setObservation] = useState('');
  const progress = Math.round((QUESTION.position / QUESTION.total) * 100);

  return (
    <PageShell header={{ backTo: '/listas' }} tab="inspecciones">
      <div className="inspeccion">
        <PageHeading subtitle="Revisa y responde cada ítem de la lista de chequeo" title="Formulario de inspección" />

        <section aria-label="Progreso de la inspección" className="sst-card inspeccion__progress">
          <div className="inspeccion__progress-row">
            <span>
              Pregunta {QUESTION.position} de {QUESTION.total}
            </span>
            <span>{progress}% completado</span>
          </div>
          <span className="inspeccion__bar">
            <span style={{ width: `${progress}%` }} />
          </span>
        </section>

        <section className="sst-card inspeccion__card">
          <div className="inspeccion__meta">
            <span className="inspeccion__category">
              <IonIcon aria-hidden="true" icon={shieldCheckmarkOutline} />
              {QUESTION.category}
            </span>
            <span className="inspeccion__id">ID: {QUESTION.code}</span>
          </div>

          <div className="inspeccion__copy">
            <h3 className="inspeccion__prompt">{QUESTION.prompt}</h3>
            <p className="inspeccion__help">{QUESTION.help}</p>
          </div>

          <div aria-label="Respuesta del ítem" className="inspeccion__options">
            {OPTIONS.map((option) => (
              <button
                aria-pressed={answer === option.id}
                className={`inspeccion__option${answer === option.id ? ' inspeccion__option--active' : ''}`}
                key={option.id}
                onClick={() => setAnswer(option.id)}
                type="button"
              >
                {answer === option.id && <span aria-hidden="true" className="inspeccion__option-dot" />}
                {option.label}
              </button>
            ))}
          </div>

          <div className="inspeccion__observation">
            <div className="inspeccion__observation-head">
              <label htmlFor="inspeccion-observacion">
                <IonIcon aria-hidden="true" icon={createOutline} />
                Observación (opcional)
              </label>
              <span>Máx. 500 caracteres</span>
            </div>
            <textarea
              className="sst-textarea"
              id="inspeccion-observacion"
              maxLength={500}
              onChange={(event) => setObservation(event.target.value)}
              placeholder="Escriba aquí su observación..."
              rows={2}
              value={observation}
            />
            <span className="inspeccion__counter">{observation.length}/500</span>
          </div>

          <button className="inspeccion__evidence" onClick={() => navigate('/evidencias')} type="button">
            <span className="inspeccion__evidence-left">
              <span aria-hidden="true" className="inspeccion__evidence-icon">
                <IonIcon icon={cameraOutline} />
              </span>
              <span>
                <p>Agregar evidencia</p>
                <small>Toma una foto o adjunta una imagen</small>
              </span>
            </span>
            <IonIcon aria-hidden="true" icon={chevronForwardOutline} />
          </button>
        </section>

        <nav aria-label="Navegación entre preguntas" className="inspeccion__nav">
          <button className="inspeccion__nav-btn" onClick={() => navigate('/listas')} type="button">
            <IonIcon aria-hidden="true" icon={chevronBackOutline} />
            <span className="inspeccion__nav-copy">
              <strong>Anterior</strong>
              <small>
                Pregunta {QUESTION.position - 1} de {QUESTION.total}
              </small>
            </span>
          </button>

          <button
            className="inspeccion__nav-btn inspeccion__nav-btn--next"
            onClick={() => navigate('/evidencias')}
            type="button"
          >
            <span className="inspeccion__nav-copy">
              <strong>Siguiente</strong>
              <small>
                Pregunta {QUESTION.position + 1} de {QUESTION.total}
              </small>
            </span>
            <IonIcon aria-hidden="true" icon={chevronForwardOutline} />
          </button>
        </nav>
      </div>
    </PageShell>
  );
};

export default Formulario;
