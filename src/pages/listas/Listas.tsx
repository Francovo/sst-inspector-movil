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
import { LISTAS_BASE } from '../../services/storage.service';
import './Listas.css';

/**
 * Catalogue of checklists owned by main's storage service.
 * Selecting one opens the detailed inspection editor with that checklist.
 */
const CHECKLISTS = LISTAS_BASE.map((lista) => ({
  id: lista.id,
  title: lista.titulo,
  description: lista.descripcion,
  items: lista.totalItems,
  reference: lista.normativa,
  categories: lista.categorias,
}));

/**
 * Checklist catalogue. The search filters the shared catalogue; selecting a
 * list opens main's inspection editor with the chosen checklist.
 */
const Listas = (): JSX.Element => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  const needle = query.trim().toLowerCase();
  const visible = CHECKLISTS.filter((checklist) =>
    `${checklist.title} ${checklist.description} ${checklist.reference}`.toLowerCase().includes(needle),
  );

  return (
    <PageShell header={{ withMenu: true }}>
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

              <button
                className="listas__select"
                onClick={() => navigate('/inspeccion', { state: { listaId: checklist.id } })}
                type="button"
              >
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
          onClick={() => navigate('/dashboard')}
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
