import { describe, expect, it } from 'vitest';
import { formatoClp, formatoFecha } from './formato';

describe('formato', () => {
  it('formatea fechas a DD-MM-AAAA', () => {
    expect(formatoFecha('2026-11-24T03:00:00.000Z')).toBe('24-11-2026');
    expect(formatoFecha(null)).toBe('');
  });

  it('formatea pesos chilenos', () => {
    expect(formatoClp(39123.45)).toMatch(/39\.123,45/);
    expect(formatoClp(null)).toBe('—');
  });
});
