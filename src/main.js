import { createApp } from 'vue';
import { createStore } from 'vuex';
import App from './App.vue';
import data from './data.js';
import { parse_data } from './utils.js';

// Create a new store instance.
const store = createStore({
    state: {
        grade: parse_data(data),
        mode: 'results',
        hovered: null,
        clicked: null,
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
        grade(state) {
            return state.grade;
        },
        showResults(state) {
            return state.mode === 'results';
        },
        focussed(state) {
            return state.clicked !== null ? state.clicked : state.hovered;
        },
        types(state, getters) {
            const counted_types = {};
            function recurse(assignment) {
                if (!(assignment.type in counted_types)) {
                    counted_types[assignment.type] = 0;
                }
                counted_types[assignment.type]++;

                if (assignment.assignments) {
                    for (const sub_assignment of assignment.assignments) {
                        recurse(sub_assignment);
                    }
                }
            }

            for (const subject of getters.grade.assignments) {
                for (const assignment of subject.assignments) {
                    recurse(assignment);
                }
            }

            return new Map(
                [...Object.entries(counted_types)].sort((a, b) => b[1] - a[1])
            ).keys();
        },
        result:
            (state, getters) =>
            (assignment, rounding = false) => {
                let result;
                if (assignment.id in state.results) {
                    result = state.results[assignment.id];
                } else {
                    if (assignment.assignments) {
                        let weighted_sum = 0;
                        let weight_sum = 0;

                        for (const sub_assignment of assignment.assignments) {
                            const score = getters.result(
                                sub_assignment,
                                rounding
                            );
                            if (score === undefined) continue;
                            const weight =
                                sub_assignment.weight /
                                sub_assignment.parent.total_subweight;
                            weighted_sum += score * weight;
                            weight_sum += weight;
                        }
                        if (weight_sum > 0) {
                            result = weighted_sum / weight_sum;
                        }
                    }
                }
                if (rounding && result !== undefined) {
                    result = Math.round((result + Number.EPSILON) * 10) / 10;
                }
                return result;
            },
        avg:
            (state, getters) =>
            (rounding = false) => {
                let sum = 0;
                let amount = 0;
                for (const subject of getters.grade.assignments) {
                    const score = getters.result(subject, rounding);
                    if (score) {
                        sum += score;
                        amount++;
                    }
                }
                if (amount) {
                    const result = sum / amount;
                    return rounding
                        ? Math.round((result + Number.EPSILON) * 10) / 10
                        : result;
                }
            },
        min:
            (state, getters) =>
            (rounding = false) => {
                let min = Infinity;
                for (const subject of getters.grade.assignments) {
                    const score = getters.result(subject, rounding);
                    if (score < min) min = score;
                }
                if (min < Infinity) {
                    return min;
                }
            },
        max:
            (state, getters) =>
            (rounding = false) => {
                let max = -Infinity;
                for (const subject of getters.grade.assignments) {
                    const score = getters.result(subject, rounding);
                    if (score > max) max = score;
                }
                if (max > -Infinity) {
                    return max;
                }
            },
        median:
            (state, getters) =>
            (rounding = false) => {
                let results = [];
                for (const subject of getters.grade.assignments) {
                    const score = getters.result(subject, rounding);
                    if (score) results.push(score);
                }
                results.sort((a, b) => a - b);
                let mid = Math.floor(results.length / 2);
                if (results.length % 2) return results[mid];
                return (results[mid] + results[mid + 1]) / 2;
            },
    },
    mutations: {
        setRound(state, round) {
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
        hover(state, assignment) {
            state.hovered = assignment;
        },
        click(state, assignment) {
            // deselect block if clicked while aready selected
            state.clicked = state.clicked === assignment ? null : assignment;
        },
        setResult(state, { assignment, result }) {
            console.log(`changing result for ${assignment} to ${result}`);
            state.results[assignment.id] = result;
            console.log(state);
        },
    },
});

// TODO: Improve accessibility (lighthouse, etc.)
const app = createApp(App);
app.use(store);
app.mount('#app');
