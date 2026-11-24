import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ResumenSerie } from './ResumenSerie';

describe('ResumenSerie', () => {
  it('muestra la variación negativa sin signo +', () => {
    render(
      <ResumenSerie
        serie={[
          { fecha: '2026-11-01', valor: 1000 },
          { fecha: '2026-11-02', valor: 950 },
        ]}
      />,
    );
    const variacion = screen.getByText('-5.00%');
    expect(variacion).toHaveClass('baja');
  });
});
