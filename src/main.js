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

            for (const subject of getters.subjects) {
                for (const assignment of subject.assignments) {
                    recurse(assignment);
                }
            }

            return new Map(
                [...Object.entries(counted_types)].sort((a, b) => b[1] - a[1])
            ).keys();
        },
        showResults(state) {
            return state.mode === 'results';
        },
        assignment: (state) => (id) => {
            function recurse(assignments) {
                for (const assignment of assignments) {
                    if (assignment.id === id) {
                        return assignment;
                    }
                    if (assignment.assignments) {
                        const res = recurse(assignment.assignments);
                        if (res) {
                            return res;
                        }
                    }
                }
            }

            return recurse(state.allSubjects);
        },
        total_subweight: (state) => (assignment) => {
            let total_subweight = 0;
            for (const sub_assignment of assignment.assignments) {
                total_subweight += sub_assignment.weight;
            }
            return total_subweight;
        },
        result:
            (state, getters) =>
            (id, rounding = false) => {
                let result;
                if (id in state.results) {
                    result = state.results[id];
                } else {
                    const assignment = getters.assignment(id);

                    if (assignment.assignments) {
                        let total_subweight =
                            getters.total_subweight(assignment);
                        let weighted_sum = 0;
                        let weight_sum = 0;

                        for (const sub_assignment of assignment.assignments) {
                            const score = getters.result(
                                sub_assignment.id,
                                rounding
                            );
                            if (score === undefined) continue;
                            const weight =
                                sub_assignment.weight / total_subweight;
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
                for (const subject of getters.subjects) {
                    const score = getters.result(subject.id, rounding);
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
                for (const subject of getters.subjects) {
                    const score = getters.result(subject.id, rounding);
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
                for (const subject of getters.subjects) {
                    const score = getters.result(subject.id, rounding);
                    if (score > max) max = score;
                }
                if (max > -Infinity) {
                    return max;
                }
            },
        median:
            (state, getters) =>
            (rounding = false) => {
                return 0;
            },
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
