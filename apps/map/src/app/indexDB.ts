import Dexie from 'dexie';

const db = new Dexie('mapboxstore');

db.version(4).stores({
  pbfStore: 'key,data',
  geojsonStore: 'key,data',
});

export default db;
