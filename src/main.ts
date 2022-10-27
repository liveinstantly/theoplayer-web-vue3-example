import { createApp } from 'vue';
import './style.css';
import App from './App.vue';

// Import types for THEOplayer
import theoplayer from "theoplayer";

declare global {
    interface Window {
        THEOplayer: typeof theoplayer;
    }
}

createApp(App).mount('#app');
