import { createApp } from 'vue';
import { createStore } from 'vuex';
import App from './App.vue';
import data from './data.js';
import { assignment_by_id, parse_data } from './utils.js';

// Create a new store instance.
const store = createStore({
    state: {
        grade: parse_data(data),
        mode: 'results',
        hovered: null,
        clicked: null,
        settings: {
            extra: ['9i65zn7fb7'],
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
            let subjects = [];
            for (const subject of state.grade.assignments) {
                /* Show subject if:
                 *
                 *  it is not (
                 *       the subject is extra and it's turned off
                 *    or the subject is replaced
                 *    of the subject can replace and doesn't
                 *  )
                 */
                // TODO: this should preferibly be recursive
                if (
                    !(
                        (subject.optional &&
                            !state.settings.extra.includes(subject.id)) ||
                        state.settings.replacing.some((replacer) =>
                            replacer.startsWith(subject.id)
                        ) ||
                        (subject.replaces &&
                            !state.settings.replacing.some((replacer) =>
                                replacer.endsWith(subject.id)
                            ))
                    )
                ) {
                    subjects.push(subject);
                }
            }
            return subjects;
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

            for (const subject of getters.subjects) {
                for (const assignment of subject.assignments) {
                    recurse(assignment);
                }
            }

            return new Map(
                [...Object.entries(counted_types)].sort((a, b) => b[1] - a[1])
            ).keys();
        },
        allOptional(state) {
            let allOptionalAssignments = [];
            function checkOptional(assignment) {
                if (assignment.optional) {
                    allOptionalAssignments.push(assignment);
                }
                if (assignment.assignments) {
                    for (const sub_assignment of assignment.assignments) {
                        checkOptional(sub_assignment);
                    }
                }
            }
            checkOptional(state.grade);
            return allOptionalAssignments;
        },
        allReplacing(state) {
            let allReplacingAssignments = [];
            function checkReplacing(assignment) {
                if (assignment.replaces) {
                    allReplacingAssignments.push({
                        replaces: assignment_by_id(assignment.replaces),
                        replacing: assignment,
                    });
                }
                if (assignment.assignments) {
                    for (const sub_assignment of assignment.assignments) {
                        checkReplacing(sub_assignment);
                    }
                }
            }
            checkReplacing(state.grade);
            return allReplacingAssignments;
        },
        isOptional: (state) => (assignment) => {
            return state.settings.extra.includes(assignment.id);
        },
        isReplacing: (state) => (replacing, replaces) => {
            return state.settings.replacing.includes(
                replaces.id + '-' + replacing.id
            );
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
                for (const subject of getters.subjects) {
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
                for (const subject of getters.subjects) {
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
                for (const subject of getters.subjects) {
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
                for (const subject of getters.subjects) {
                    const score = getters.result(subject, rounding);
                    if (score) results.push(score);
                }
                if (results.length === 0) return;
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
        setOptional(state, { assignment, turnedOn }) {
            if (turnedOn && !state.settings.extra.includes(assignment.id)) {
                state.settings.extra.push(assignment.id);
            }
            if (!turnedOn) {
                state.settings.extra = state.settings.extra.filter(
                    (optional_id) => optional_id !== assignment.id
                );
            }
        },
        setReplacer(state, { replaces, replacing, turnedOn }) {
            let replacer_s = replaces.id + '-' + replacing.id;
            if (turnedOn && !state.settings.replacing.includes(replacer_s)) {
                state.settings.replacing.push(replacer_s);
            }
            if (!turnedOn) {
                state.settings.replacing = state.settings.replacing.filter(
                    (replacer) => replacer !== replacer_s
                );
            }
        },
        setResult(state, { assignment, result }) {
            state.results[assignment.id] = result;
        },
        clearAll(state) {
            state.results = {};
        },
    },
});

// TODO: Improve accessibility (lighthouse, etc.)
// TODO: Color grades based on their value and cum laude
// TODO: Fix averages and make a better overview
// https://wetten.overheid.nl/jci1.3:c:BWBR0004593&hoofdstuk=V&artikel=52a&z=2021-08-01&g=2021-08-01
const app = createApp(App);
app.use(store);
app.mount('#app');
