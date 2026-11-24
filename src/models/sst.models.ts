export type EstadoRespuesta = 'cumple' | 'no_cumple' | 'no_aplica' | null;
export type EstadoInspeccion = 'borrador' | 'pendiente_sincronizar' | 'sincronizada';

export interface ListaChequeo {
  id: string;
  titulo: string;
  normativa: string;
  descripcion: string;
  totalItems: number;
  categorias: number;
}

export interface ItemChequeo {
  id: string;
  codigo: string;
  categoria: string;
  pregunta: string;
  guiaVerificacion: string;
  respuesta: EstadoRespuesta;
  observacion: string;
}

export interface EvidenciaFotografica {
  id: string;
  itemId: string;
  imagenBase64OPath: string;
  descripcionHallazgo: string;
  fechaCaptura: string;
}

export interface FirmaResponsable {
  nombre: string;
  cargo: string;
  firmaBase64: string;
  fechaFirma: string;
}

export interface InspeccionSST {
  id: string;
  codigoReporte: string;
  empresa: string;
  sedeArea: string;
  listaChequeoId: string;
  listaChequeoTitulo: string;
  inspectorNombre: string;
  fechaInspeccion: string;
  items: ItemChequeo[];
  evidencias: EvidenciaFotografica[];
  firma?: FirmaResponsable;
  estado: EstadoInspeccion;
  porcentajeCumplimiento: number;
  hallazgosCriticos: number;
}
