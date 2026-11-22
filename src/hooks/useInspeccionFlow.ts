import { useState } from 'react';
import {
  EstadoRespuesta,
  EvidenciaFotografica,
  FirmaResponsable,
  InspeccionSST,
  ItemChequeo,
} from '../models/sst.models';
import { StorageService } from '../services/storage.service';

export function useInspeccionFlow(inspeccionInicial: InspeccionSST) {
  const [inspeccion, setInspeccion] = useState<InspeccionSST>(inspeccionInicial);
  const [indiceActual, setIndiceActual] = useState<number>(0);

  const itemActual: ItemChequeo | undefined = inspeccion.items[indiceActual];

  const responderItem = (respuesta: EstadoRespuesta, observacion?: string) => {
    const itemsActualizados = inspeccion.items.map((item, idx) =>
      idx === indiceActual
        ? { ...item, respuesta, observacion: observacion ?? item.observacion }
        : item
    );
    setInspeccion({ ...inspeccion, items: itemsActualizados });
  };

  const agregarEvidencia = (evidencia: EvidenciaFotografica) => {
    setInspeccion({
      ...inspeccion,
      evidencias: [...inspeccion.evidencias, evidencia],
    });
  };

  const registrarFirma = (firma: FirmaResponsable) => {
    setInspeccion({ ...inspeccion, firma });
  };

  const guardarBorrador = async () => {
    const borrador: InspeccionSST = { ...inspeccion, estado: 'borrador' };
    setInspeccion(borrador);
    await StorageService.guardarInspeccion(borrador);
  };

  const finalizarYGuardar = async () => {
    if (!inspeccion.firma?.nombre || !inspeccion.firma?.cargo || !inspeccion.firma?.firmaBase64) {
      throw new Error('Debe completar los datos y la firma del responsable antes de cerrar.');
    }
    const finalizada: InspeccionSST = {
      ...inspeccion,
      estado: 'pendiente_sincronizar',
    };
    setInspeccion(finalizada);
    await StorageService.guardarInspeccion(finalizada);
    return finalizada;
  };

  return {
    inspeccion,
    itemActual,
    indiceActual,
    totalPreguntas: inspeccion.items.length,
    irSiguiente: () => setIndiceActual((prev) => Math.min(prev + 1, inspeccion.items.length - 1)),
    irAnterior: () => setIndiceActual((prev) => Math.max(prev - 1, 0)),
    responderItem,
    agregarEvidencia,
    registrarFirma,
    guardarBorrador,
    finalizarYGuardar,
  };
}