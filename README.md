# @facturahub/verifactu-hash

> Calcula la **huella (hash SHA-256 encadenado)** de los registros Veri*Factu según la especificación oficial de la AEAT. Isomorfo (Node 18+ / navegador) · 0 dependencias · MIT.

## Instalación

```bash
npm i @facturahub/verifactu-hash
```

## Uso

```ts
import { huellaAlta, cadenaAlta } from '@facturahub/verifactu-hash';

const huella = await huellaAlta({
  idEmisor: '89890001K',
  numSerie: '12345678/G33',
  fechaExpedicion: '01-01-2024',
  tipoFactura: 'F1',
  cuotaTotal: '12.35',
  importeTotal: '123.45',
  huellaAnterior: '',                 // vacío en la primera factura; si no, la huella anterior
  fechaHoraHusoGenRegistro: '2024-01-01T19:20:30+01:00',
});
// '3C464DAF61ACB827C65FDA19F352A4E3BDC2C640E9E9FC4CC058073F38F12F60'
```

Este resultado coincide con el **vector oficial de la AEAT** (verificado en los tests).

## API

| Función | Qué hace |
|---|---|
| `huellaAlta(registro)` | `Promise<string>` — huella de un registro de alta (encadenada) |
| `cadenaAlta(registro)` | Cadena canónica antes de hashear (para depurar) |
| `sha256HexUpper(str)` | SHA-256 de una cadena UTF-8 en hex mayúsculas |

## Cómo funciona

La AEAT exige que cada registro de facturación lleve una huella SHA-256 que **encadena** con la del registro anterior (integridad e inalterabilidad). La cadena se construye con los campos en orden fijo:

```
IDEmisorFactura=…&NumSerieFactura=…&FechaExpedicionFactura=…&TipoFactura=…&CuotaTotal=…&ImporteTotal=…&Huella=…&FechaHoraHusoGenRegistro=…
```

y se aplica SHA-256 (UTF-8) → hexadecimal en mayúsculas (64 caracteres). Base legal: Orden HAC/1177/2024.

> Documentación técnica, no asesoramiento fiscal. Verifica siempre la especificación vigente en la sede de la AEAT.

---

Hecho por [**FacturaHub**](https://facturahub.com?utm_source=npm&utm_medium=referral&utm_campaign=verifactu-hash) — facturación con IA para autónomos en España: emite **Verifactu** sin pelearte con la norma. Gratis. Guía: [github.com/FacturaHub-com/facturahub-verifactu](https://github.com/FacturaHub-com/facturahub-verifactu).
