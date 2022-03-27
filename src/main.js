import { createApp } from 'vue';
import { createStore } from 'vuex';
import App from './App.vue';
import data from './data.js';
import { parse_data } from './utils.js';

// Create a new store instance.
const store = createStore({
    state: {
        allSubjects: parse_data(data),
        mode: 'results',
        settings: {
            extra: ['zzhzstumsx'],
            replacing: ['ns17jgif2b-vrzx1r9o5w'],
            round: false,
            scale: 1,
        },
        results: {
            '3645gcx0n4': 8.3,
            '4sf3nykl59': 9.6,
            ttzm0zf9m7: 10,
            gw7p763u55: 9.2,
            '0otgmtlnnu': 6.4,
            ia3n5mpq8h: 8.8,
            bibthnx1dj: 7.1,
            gbx6hdqihp: 8.8,
            d4vz6v5b99: 8.6,
            x4mnsu5pms: 8.3,
            '4jgnsh723y': 6.9,
            yt5n5xsuya: 6.8,
            '7rd6f0gaah': 8.2,
            '95yy7a2zk': 8.6,
            ejsxrxx47q: 8.3,
            davve54u4w: 9.4,
            hfhyyrjk40: 8.7,
            w3tfmzaq0o: 7.3,
            ywoflqkdxz: 7.9,
            '8ulmc1jqp7': 8.5,
            qvkw1mzs5y: 6,
            zswpp19h9x: 7,
            wo4mih1hcq: 6.3,
            mfqfmo2l85: 7.1,
        },
    },
    getters: {
        subjects(state) {
            return state.allSubjects;
        },
        showResults(state) {
            return state.mode === 'results';
        }
    },
    mutations: {
        setRround(state, round) {
            console.log('round', round);
            state.settings.round = round;
        },
        setMode(state, mode) {
            console.log('mode', mode);
            state.mode = mode;
        },
        setScale(state, scale) {
            console.log('scale', scale);
            state.scale = scale;
        },
    },
});

// TODO: Improve accessibility (lighthouse, etc.)
const app = createApp(App);
app.use(store);
app.mount('#app');
