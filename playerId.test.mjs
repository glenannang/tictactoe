import test from 'node:test';
import assert from 'node:assert/strict';

import { playerId, playerState } from './js/state/playerState.js';

test('playerId is a single shared UUID value', () => {
  assert.equal(typeof playerId, 'string');
  assert.equal(playerId, playerState.playerId);
  assert.match(playerId, /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
});
