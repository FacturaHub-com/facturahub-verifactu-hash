// facturahub-verifactu-hash — Huella (hash SHA-256 encadenado) de registros Veri*Factu.
// Implementa el cálculo oficial de la AEAT (Orden HAC/1177/2024). Isomorfo (Node 18+ / navegador)
// vía Web Crypto. 0 dependencias.

export interface RegistroAlta {
  /** NIF del emisor de la factura (IDEmisorFactura). */
  idEmisor: string;
  /** Serie + número de la factura (NumSerieFactura). */
  numSerie: string;
  /** Fecha de expedición en formato dd-mm-aaaa (FechaExpedicionFactura). */
  fechaExpedicion: string;
  /** Tipo de factura, p. ej. "F1", "F2", "R1" (TipoFactura). */
  tipoFactura: string;
  /** Cuota total. Pásalo tal cual aparece en tu registro (p. ej. "12.35"). */
  cuotaTotal: string | number;
  /** Importe total. Pásalo tal cual aparece en tu registro (p. ej. "123.45"). */
  importeTotal: string | number;
  /** Huella del registro anterior. Cadena vacía en el primero. */
  huellaAnterior?: string;
  /** Fecha-hora con huso de generación, ISO 8601, p. ej. "2024-01-01T19:20:30+01:00". */
  fechaHoraHusoGenRegistro: string;
}

function fmt(v: string | number): string {
  return typeof v === 'number' ? v.toFixed(2) : v;
}

/**
 * Construye la cadena canónica de un registro de alta, en el orden y formato
 * exactos que define la AEAT:
 * IDEmisorFactura=...&NumSerieFactura=...&FechaExpedicionFactura=...&TipoFactura=...
 * &CuotaTotal=...&ImporteTotal=...&Huella=...&FechaHoraHusoGenRegistro=...
 */
export function cadenaAlta(r: RegistroAlta): string {
  return (
    `IDEmisorFactura=${r.idEmisor}` +
    `&NumSerieFactura=${r.numSerie}` +
    `&FechaExpedicionFactura=${r.fechaExpedicion}` +
    `&TipoFactura=${r.tipoFactura}` +
    `&CuotaTotal=${fmt(r.cuotaTotal)}` +
    `&ImporteTotal=${fmt(r.importeTotal)}` +
    `&Huella=${r.huellaAnterior ?? ''}` +
    `&FechaHoraHusoGenRegistro=${r.fechaHoraHusoGenRegistro}`
  );
}

/** SHA-256 de una cadena UTF-8, en hexadecimal MAYÚSCULAS (64 caracteres). */
export async function sha256HexUpper(input: string): Promise<string> {
  const bytes = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
    .toUpperCase();
}

/** Calcula la huella de un registro de alta (incluye el encadenado con el anterior). */
export async function huellaAlta(registro: RegistroAlta): Promise<string> {
  return sha256HexUpper(cadenaAlta(registro));
}
