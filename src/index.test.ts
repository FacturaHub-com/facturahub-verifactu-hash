import { describe, it, expect } from 'vitest';
import { cadenaAlta, sha256HexUpper, huellaAlta } from './index';

// Vector oficial de la especificación técnica de la AEAT.
const registro = {
  idEmisor: '89890001K',
  numSerie: '12345678/G33',
  fechaExpedicion: '01-01-2024',
  tipoFactura: 'F1',
  cuotaTotal: '12.35',
  importeTotal: '123.45',
  huellaAnterior: '',
  fechaHoraHusoGenRegistro: '2024-01-01T19:20:30+01:00',
};
const EXPECTED = '3C464DAF61ACB827C65FDA19F352A4E3BDC2C640E9E9FC4CC058073F38F12F60';

describe('cadenaAlta', () => {
  it('formato canónico AEAT', () => {
    expect(cadenaAlta(registro)).toBe(
      'IDEmisorFactura=89890001K&NumSerieFactura=12345678/G33&FechaExpedicionFactura=01-01-2024&TipoFactura=F1&CuotaTotal=12.35&ImporteTotal=123.45&Huella=&FechaHoraHusoGenRegistro=2024-01-01T19:20:30+01:00'
    );
  });
});

describe('huellaAlta', () => {
  it('reproduce el vector oficial de la AEAT', async () => {
    expect(await huellaAlta(registro)).toBe(EXPECTED);
  });
  it('hex en mayúsculas de 64 caracteres', async () => {
    const h = await sha256HexUpper('hola');
    expect(h).toMatch(/^[0-9A-F]{64}$/);
  });
  it('encadena: cambiar la huella anterior cambia el hash', async () => {
    const a = await huellaAlta(registro);
    const b = await huellaAlta({ ...registro, huellaAnterior: EXPECTED });
    expect(a).not.toBe(b);
  });
});
