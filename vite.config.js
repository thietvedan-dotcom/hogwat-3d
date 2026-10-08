import { defineConfig } from 'vite';
export default defineConfig({
  build: {
    rollupOptions: {
      output: { manualChunks: { 'three-engine': ['three'], 'postprocessing': ['three/addons/postprocessing/EffectComposer.js','three/addons/postprocessing/UnrealBloomPass.js'] } }
    },
    chunkSizeWarningLimit: 600
  }
});
