import { IonButton, IonIcon, IonSpinner, IonToast } from '@ionic/react';
import { arrowForwardOutline, briefcaseOutline, checkmarkCircle, createOutline, personOutline } from 'ionicons/icons';
import type { JSX } from 'react';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import PageHeading from '../../components/PageHeading';
import PageShell from '../../components/PageShell';
import SignaturePad from '../../components/SignaturePad';
import Stepper from '../../components/Stepper';
import TextField from '../../components/form/TextField';
import { lightImpact } from '../../features/native/haptics';
import type { InspeccionSST } from '../../models/sst.models';
import { StorageService } from '../../services/storage.service';

import './Firma.css';

const STEPS = ['Inspección', 'Evidencias', 'Firma', 'Resumen'] as const;

type FirmaLocationState = {
  inspectionId?: string;
};

/**
 * Signature step of the guided inspection flow.
 * It loads the inspection draft saved by the form, registers the responsible
 * person's signature and moves the report to "pendiente de sincronizar".
 */
const Firma = (): JSX.Element => {
  const navigate = useNavigate();
  const location = useLocation();
  const { inspectionId } = (location.state ?? {}) as FirmaLocationState;

  const [inspeccion, setInspeccion] = useState<InspeccionSST | null>(null);
  const [loading, setLoading] = useState(true);
  const [nombre, setNombre] = useState('');
  const [cargo, setCargo] = useState('Inspector SST');
  const [firma, setFirma] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const load = async () => {
      let stored: InspeccionSST | null;

      if (inspectionId) {
        stored = (await StorageService.obtenerInspeccionPorId(inspectionId)) ?? null;
      } else {
        const items = await StorageService.obtenerInspecciones();
        stored = items.find((item) => item.estado === 'borrador') ?? items[0] ?? null;
      }

      if (!active) return;

      setInspeccion(stored);

      if (stored) {
        setNombre(stored.firma?.nombre ?? stored.inspectorNombre ?? '');
        setCargo(stored.firma?.cargo ?? 'Inspector SST');
        setFirma(stored.firma?.firmaBase64 ?? null);
      }

      setLoading(false);
    };

    load().catch(() => {
      if (active) setLoading(false);
    });

    return () => {
      active = false;
    };
  }, [inspectionId]);

  const handleSave = async () => {
    if (!inspeccion) return;

    if (!nombre.trim() || !cargo.trim() || !firma) {
      setToast('Completa el nombre, el cargo y la firma antes de continuar.');
      return;
    }

    setSaving(true);

    const updated: InspeccionSST = {
      ...inspeccion,
      inspectorNombre: nombre.trim(),
      firma: {
        nombre: nombre.trim(),
        cargo: cargo.trim(),
        firmaBase64: firma,
        fechaFirma: new Date().toISOString(),
      },
      estado: 'pendiente_sincronizar',
    };

    try {
      await StorageService.guardarInspeccion(updated);
      lightImpact();
      navigate('/resumen', { state: { inspectionId: updated.id } });
    } catch {
      setToast('No se pudo guardar la firma. Intenta de nuevo.');
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <PageShell header={{ backTo: '/inspeccion' }}>
        <div className="firma firma--center">
          <IonSpinner name="crescent" />
          <p>Cargando la inspección…</p>
        </div>
      </PageShell>
    );
  }

  if (!inspeccion) {
    return (
      <PageShell header={{ backTo: '/inspeccion' }}>
        <div className="firma firma--center">
          <h2 className="firma__empty-title">No hay una inspección para firmar</h2>
          <p>Completa el formulario antes de registrar la firma.</p>
          <IonButton className="sst-action" expand="block" routerLink="/listas">
            Ver listas de chequeo
          </IonButton>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell header={{ backTo: '/inspeccion' }}>
      <div className="firma">
        <Stepper current={3} steps={STEPS} />

        <PageHeading
          icon={createOutline}
          subtitle="Confirma la información de la inspección con tu firma."
          title="Firma digital"
        />

        <p className="firma__context">
          {inspeccion.codigoReporte} · {inspeccion.listaChequeoTitulo}
        </p>

        <section aria-labelledby="responsable-title" className="sst-card firma__card">
          <div className="firma__card-head">
            <IonIcon aria-hidden="true" icon={personOutline} />
            <h3 id="responsable-title">Responsable de la inspección</h3>
          </div>

          <TextField
            icon={personOutline}
            id="responsable-nombre"
            label="Nombre *"
            onChange={(event) => setNombre(event.target.value)}
            placeholder="Ingresa tu nombre completo"
            type="text"
            value={nombre}
          />

          <TextField
            icon={briefcaseOutline}
            id="responsable-cargo"
            label="Cargo *"
            onChange={(event) => setCargo(event.target.value)}
            placeholder="Ingresa tu cargo o rol"
            type="text"
            value={cargo}
          />

          <div className="sst-field">
            <span className="sst-field__label">Firma del responsable *</span>
            <SignaturePad
              onClear={() => setFirma(null)}
              onSave={(signature) => {
                setFirma(signature);
                lightImpact();
              }}
            />
          </div>

          {firma && (
            <p className="firma__feedback" role="status">
              <IonIcon aria-hidden="true" icon={checkmarkCircle} />
              Firma capturada correctamente.
            </p>
          )}
        </section>

        <IonButton
          className="sst-action sst-action--cta"
          color="success"
          disabled={saving}
          expand="block"
          onClick={() => void handleSave()}
        >
          {saving ? 'Guardando…' : 'Continuar al resumen'}
          <IonIcon aria-hidden="true" icon={arrowForwardOutline} slot="end" />
        </IonButton>

        <IonToast
          duration={2500}
          isOpen={toast !== null}
          message={toast ?? ''}
          onDidDismiss={() => setToast(null)}
          position="top"
        />
      </div>
    </PageShell>
  );
};

export default Firma;
