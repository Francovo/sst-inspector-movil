import { IonIcon } from '@ionic/react';
import {
  arrowBackOutline,
  checkmarkCircle,
  documentTextOutline,
  gridOutline,
  listOutline,
  optionsOutline,
  searchOutline,
  shieldCheckmarkOutline,
} from 'ionicons/icons';
import type { JSX } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import PageHeading from '../../components/PageHeading';
import PageShell from '../../components/PageShell';
import './Listas.css';

const CHECKLISTS = [
  {
    id: 'decreto-1072',
    title: 'Decreto 1072',
    description:
      'Lista de chequeo para verificación del cumplimiento del Sistema de Gestión de Seguridad y Salud en el Trabajo (SG-SST) según Decreto 1072 de 2015.',
    items: 45,
    reference: 'Normativa: Decreto 1072 de 2015',
    categories: 6,
  },
  {
    id: 'resolucion-0312',
    title: 'Resolución 0312',
    description:
      'Lista de chequeo para evaluación de los Estándares Mínimos del Sistema de Gestión de Seguridad y Salud en el Trabajo según Resolución 0312 de 2019.',
    items: 62,
    reference: 'Normativa: Resolución 0312 de 2019',
    categories: 7,
  },
  {
    id: 'riesgos-locativos',
    title: 'Riesgos locativos',
    description:
      'Lista de chequeo para la identificación y control de riesgos locativos en instalaciones, áreas de trabajo y zonas comunes de la empresa.',
    items: 38,
    reference: 'Tipo: Inspección general',
    categories: 5,
  },
] as const;

/**
 * Visual mockup of the "Listas de Chequeo" screen.
 * The search filters the demo catalogue; selecting a list only opens the form.
 */
const Listas = (): JSX.Element => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  const needle = query.trim().toLowerCase();
  const visible = CHECKLISTS.filter((checklist) =>
    `${checklist.title} ${checklist.description} ${checklist.reference}`.toLowerCase().includes(needle),
  );

  return (
    <PageShell header={{ online: false, withMenu: true }} tab="inspecciones">
      <div className="listas">
        <PageHeading
          subtitle="Selecciona la lista que deseas utilizar para tu inspección"
          title="Listas de chequeo SST"
        />

        <div className="listas__search">
          <div className="listas__search-box">
            <span aria-hidden="true" className="listas__search-icon">
              <IonIcon icon={searchOutline} />
            </span>
            <input
              aria-label="Buscar lista de chequeo"
              className="listas__input"
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Buscar lista de chequeo..."
              type="search"
              value={query}
            />
          </div>

          <button className="listas__filter" type="button">
            <IonIcon aria-hidden="true" icon={optionsOutline} />
            Filtros
          </button>
        </div>

        {visible.map((checklist) => (
          <article className="sst-card listas__card" key={checklist.id}>
            <div className="listas__top">
              <span aria-hidden="true" className="listas__icon">
                <IonIcon icon={shieldCheckmarkOutline} />
              </span>

              <div className="listas__copy">
                <h3>
                  {checklist.title}
                  <IonIcon aria-hidden="true" icon={checkmarkCircle} />
                </h3>
                <p>{checklist.description}</p>
              </div>

              <button className="listas__select" onClick={() => navigate('/inspeccion')} type="button">
                Seleccionar
              </button>
            </div>

            <footer className="listas__meta">
              <span>
                <IonIcon aria-hidden="true" icon={listOutline} />
                Ítems: <strong>{checklist.items}</strong>
              </span>
              <span>
                <IonIcon aria-hidden="true" icon={documentTextOutline} />
                {checklist.reference}
              </span>
              <span>
                <IonIcon aria-hidden="true" icon={gridOutline} />
                Categorías: <strong>{checklist.categories}</strong>
              </span>
            </footer>
          </article>
        ))}

        {visible.length === 0 && (
          <p className="listas__empty">No se encontraron listas de chequeo para «{query.trim()}».</p>
        )}

        <button
          className="sst-button sst-button--outline sst-button--block"
          onClick={() => navigate('/inicio')}
          type="button"
        >
          <IonIcon aria-hidden="true" icon={arrowBackOutline} />
          Volver
        </button>
      </div>
    </PageShell>
  );
};

export default Listas;
