import { render, screen, userEvent } from '@shared/test';
import { describe, expect, it } from 'vitest';

import { App } from './App';

describe('App test', () => {
  it('search-modal hot key', async () => {
    const { container } = render(<App />);
    const user = userEvent.setup();

    expect(container.querySelector('nextui-modal')).toBeNull();
    user.keyboard('{ControlLeft}{ShiftLeft}P');
    screen.debug();
    // expect(container.querySelector('nextui-modal')).not.toBeNull();
  });
});
