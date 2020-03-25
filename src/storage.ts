import engine from 'store/src/store-engine';
import sessionStorage from 'store/storages/sessionStorage';
import localStorage from 'store/storages/localStorage';
import cookieStorage from 'store/storages/cookieStorage';
import memoryStorage from 'store/storages/memoryStorage';

const STORE_KEY = 'mt-link-javascript-sdk';

const store = engine.createStore([sessionStorage, localStorage, cookieStorage, memoryStorage]);

export function get(key: string): string | undefined {
  const data = store.get(STORE_KEY) || {};

  return data[key];
}

export function set(key: string, value: string): void {
  const data = store.get(STORE_KEY) || {};
  data[key] = value;

  store.set(STORE_KEY, data);
}

export default {
  set,
  get
};
