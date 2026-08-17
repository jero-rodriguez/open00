import { defineConfig } from 'vite';
import foundryvtt from 'vite-plugin-foundryvtt';

export default defineConfig({
  build: {
    outDir: 'dist',
    sourcemap: true,
    lib: {
      entry: 'src/vsd-system.ts',
      formats: ['es'],
      fileName: 'vsd-system',
    },
  },
  plugins: [
    ...foundryvtt({
      id: 'vsd',
      title: 'Against the Darkmaster (VsD)',
      version: '0.1.0',
      compatibility: { minimum: '14', verified: '14' },
      esmodules: ['vsd-system.js'],
      languages: [
        { lang: 'en', name: 'English', path: 'lang/en.json' },
        { lang: 'es', name: 'Español', path: 'lang/es.json' },
      ],
      documentTypes: {
        Actor: {
          character: {},
          npc: {},
        },
        Item: {
          weapon: {},
          armor: {},
          spell: {},
          equipment: {},
          kin: {},
          culture: {},
          vocation: {},
          trait: {},
          itemOfPower: {},
        },
      },
    }, { buildPacks: false }),
  ],
});
