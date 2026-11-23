import type { InspeccionSST, ListaChequeo } from '../models/sst.models';

const STORAGE_KEY = 'sst_inspecciones_locales';

export const LISTAS_BASE: ListaChequeo[] = [
  {
    id: 'decreto-1072',
    titulo: 'Decreto 1072',
    normativa: 'Decreto 1072 de 2015',
    descripcion: 'Verificación del cumplimiento del SG-SST según Decreto 1072 de 2015.',
    totalItems: 45,
    categorias: 6,
  },
  {
    id: 'resolucion-0312',
    titulo: 'Resolución 0312',
    normativa: 'Resolución 0312 de 2019',
    descripcion: 'Evaluación de Estándares Mínimos del SG-SST según Resolución 0312 de 2019.',
    totalItems: 62,
    categorias: 7,
  },
  {
    id: 'riesgos-locativos',
    titulo: 'Riesgos locativos',
    normativa: 'Inspección general',
    descripcion: 'Identificación y control de riesgos locativos en instalaciones y áreas de trabajo.',
    totalItems: 38,
    categorias: 5,
  },
];

export class StorageService {
  static async obtenerInspecciones(): Promise<InspeccionSST[]> {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  }

  static async guardarInspeccion(inspeccion: InspeccionSST): Promise<void> {
    const actuales = await this.obtenerInspecciones();
    const index = actuales.findIndex((i) => i.id === inspeccion.id);

    const actualizada = {
      ...inspeccion,
      porcentajeCumplimiento: this.calcularCumplimiento(inspeccion),
      hallazgosCriticos: inspeccion.items.filter((i) => i.respuesta === 'no_cumple').length,
    };

    if (index >= 0) {
      actuales[index] = actualizada;
    } else {
      actuales.unshift(actualizada);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(actuales));
  }

  static async obtenerInspeccionPorId(id: string): Promise<InspeccionSST | undefined> {
    const actuales = await this.obtenerInspecciones();
    return actuales.find((i) => i.id === id);
  }

  static calcularCumplimiento(inspeccion: InspeccionSST): number {
    const evaluables = inspeccion.items.filter(
      (i) => i.respuesta === 'cumple' || i.respuesta === 'no_cumple'
    );
    if (evaluables.length === 0) return 0;
    const cumplidos = evaluables.filter((i) => i.respuesta === 'cumple').length;
    return Math.round((cumplidos / evaluables.length) * 100);
  }
}
