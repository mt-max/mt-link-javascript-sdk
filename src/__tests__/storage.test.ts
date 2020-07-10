import { set, get } from '../storage';

describe('storage', () => {
  test('set, get', () => {
    expect(get('key1')).toBeUndefined();

    set('key1', 'value1');

    expect(get('key1')).toBe('value1');
  });
});
