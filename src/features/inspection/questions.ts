import type { InspeccionSST, ItemChequeo } from '../../models/sst.models';
import { LISTAS_BASE } from '../../services/storage.service';

type PreguntaBase = Omit<ItemChequeo, 'respuesta' | 'observacion'>;

/**
 * Sample checklist used by the guided inspection flow.
 * The third question matches the reference screen used to design the form.
 */
export const INSPECTION_QUESTIONS: readonly PreguntaBase[] = [
  {
    id: 'item-1',
    codigo: 'CL-001',
    categoria: 'Elementos de protección personal',
    pregunta: '¿El personal utiliza los elementos de protección personal asignados y en buen estado?',
    guiaVerificacion:
      'Verifique que cada trabajador use el EPP correspondiente a la tarea y que se encuentre en buen estado.',
  },
  {
    id: 'item-2',
    codigo: 'CL-002',
    categoria: 'Señalización y emergencias',
    pregunta: '¿La señalización de seguridad y emergencia es visible y está en buen estado?',
    guiaVerificacion:
      'Compruebe que las señales estén limpias, visibles y ubicadas en los puntos de riesgo y evacuación.',
  },
  {
    id: 'item-3',
    codigo: 'CL-003',
    categoria: 'Condiciones de seguridad',
    pregunta:
      '¿Las vías de circulación (pasillos, escaleras y salidas) se encuentran libres de obstáculos y debidamente señalizadas?',
    guiaVerificacion:
      'Verifique que no haya objetos, equipos o materiales que impidan el paso y que la señalización sea visible y esté en buen estado.',
  },
  {
    id: 'item-4',
    codigo: 'CL-004',
    categoria: 'Orden y aseo',
    pregunta: '¿Las áreas de trabajo se encuentran ordenadas y libres de residuos?',
    guiaVerificacion: 'Revise pisos, pasillos y zonas de almacenamiento para confirmar que estén limpios y despejados.',
  },
  {
    id: 'item-5',
    codigo: 'CL-005',
    categoria: 'Prevención de incendios',
    pregunta: '¿Los extintores están vigentes, accesibles y libres de obstáculos?',
    guiaVerificacion: 'Confirme la vigencia de la recarga, la señalización y el acceso libre a cada extintor.',
  },
  {
    id: 'item-6',
    codigo: 'CL-006',
    categoria: 'Rutas de evacuación',
    pregunta: '¿Las rutas de evacuación están despejadas y correctamente señalizadas?',
    guiaVerificacion: 'Verifique que las salidas, escaleras y pasillos de evacuación permanezcan libres y señalizados.',
  },
  {
    id: 'item-7',
    codigo: 'CL-007',
    categoria: 'Riesgo eléctrico',
    pregunta: '¿Las instalaciones eléctricas están protegidas y sin cables expuestos?',
    guiaVerificacion:
      'Revise tableros, tomacorrientes y cableado para detectar tapas faltantes o conductores expuestos.',
  },
  {
    id: 'item-8',
    codigo: 'CL-008',
    categoria: 'Trabajo en alturas',
    pregunta: '¿Se utilizan arnés y línea de vida en los trabajos en altura?',
    guiaVerificacion:
      'Compruebe el uso de arnés, puntos de anclaje y línea de vida cuando se realicen tareas en altura.',
  },
  {
    id: 'item-9',
    codigo: 'CL-009',
    categoria: 'Sustancias químicas',
    pregunta: '¿Los productos químicos están almacenados y etiquetados correctamente?',
    guiaVerificacion:
      'Verifique la identificación de los productos, las hojas de seguridad y el almacenamiento seguro.',
  },
  {
    id: 'item-10',
    codigo: 'CL-010',
    categoria: 'Primeros auxilios',
    pregunta: '¿El botiquín está completo, vigente y disponible para emergencias?',
    guiaVerificacion:
      'Confirme la ubicación, el inventario y la vigencia de los insumos del botiquín de primeros auxilios.',
  },
];

/**
 * Builds a new inspection for the selected checklist from the shared catalogue.
 */
export const crearInspeccion = (
  listaId: string | undefined,
  user: { fullName: string; company: string } | null,
): InspeccionSST => {
  const lista = LISTAS_BASE.find((item) => item.id === listaId) ?? LISTAS_BASE[0];
  const sequence = String(Math.floor(Math.random() * 900) + 100);

  return {
    id: crypto.randomUUID(),
    codigoReporte: `SST-${new Date().getFullYear()}-${sequence}`,
    empresa: user?.company || 'Empresa Demo SST S.A.S.',
    sedeArea: 'Planta Principal - Área Operativa',
    listaChequeoId: lista.id,
    listaChequeoTitulo: lista.titulo,
    inspectorNombre: user?.fullName || 'Inspector SST',
    fechaInspeccion: new Date().toISOString().split('T')[0],
    items: INSPECTION_QUESTIONS.map((question) => ({
      ...question,
      respuesta: null,
      observacion: '',
    })),
    evidencias: [],
    estado: 'borrador',
    porcentajeCumplimiento: 0,
    hallazgosCriticos: 0,
  };
};
