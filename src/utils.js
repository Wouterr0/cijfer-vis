import { def } from '@vue/shared';
import raw_grade from './data.js';

export const modi = { results: 'RESULTATEN', plan: 'PLANNEN' };

function assignment_were(f, assignment = raw_grade) {
    if (f(assignment)) {
        return assignment;
    } else {
        if (assignment.assignments) {
            for (const sub_assignment of assignment.assignments) {
                const result = assignment_were(f, sub_assignment);
                if (result) {
                    return result;
                }
            }
        }
    }
}

export function assignment_by_id(id) {
    return assignment_were((a) => a.id === id);
}

export function parse_data(grade) {
    /*
     * Steps:
     * 0. TODO: check validity of data
     * 1. copy and remove like references
     * 2. reference parent back (.parent)
     * 3. cache total_subweight for easy access
     */

    // copy and remove like references
    function replace_like(assignment) {
        if (assignment.like) {
            if (assignment.assignments) {
                throw 'A like assignment cannot have children';
            }
            const src = assignment_by_id(assignment.like);
            if (src.assignments) {
                throw 'A liked assignment cannot have children';
            }
            for (const key in src) {
                if (!(key in assignment))
                    // don't duplicate key if aready exists
                    assignment[key] = src[key];
            }
            delete assignment.like;
        }
        if (assignment.assignments) {
            for (const sub_assignment of assignment.assignments) {
                replace_like(sub_assignment);
            }
        }
    }
    replace_like(grade);

    // reference parent back (.parent)
    function link_back(assignment, parent) {
        if (parent) {
            assignment.parent = parent;
        }
        if (assignment.assignments) {
            let weight_sum = 0;
            for (const sub_assignment of assignment.assignments) {
                link_back(sub_assignment, assignment);
                weight_sum += sub_assignment.weight ? sub_assignment.weight : 1;
            }
            assignment.total_subweight = weight_sum;
        }
    }
    link_back(grade);

    return grade;
}

export function gen_id() {
    return Math.random().toString(36).slice(2, 12);
}

export function nl_num(n, min_fract_digits, max_fract_digits) {
    if (n === undefined) {
        return '-';
    }

    let options = {
        minimumFractionDigits: min_fract_digits,
        maximumFractionDigits: max_fract_digits,
    };

    return n.toLocaleString('nl', options);
}

export function storageAvailable(type) {
    var storage;
    try {
        storage = window[type];
        var x = '__storage_test__';
        storage.setItem(x, x);
        storage.removeItem(x);
        return true;
    } catch (e) {
        return (
            e instanceof DOMException &&
            // everything except Firefox
            (e.code === 22 ||
                // Firefox
                e.code === 1014 ||
                // test name field too, because code might not be present
                // everything except Firefox
                e.name === 'QuotaExceededError' ||
                // Firefox
                e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
            // acknowledge QuotaExceededError only if there's something already stored
            storage &&
            storage.length !== 0
        );
    }
}

export function load(str, default_value) {
    if (!storageAvailable('localStorage')) {
        console.error('localStorage is not accessible');
        return false;
    }
    let saved = localStorage.getItem(str);
    if (saved !== null) saved = JSON.parse(atob(saved));
    saved = Object.assign({}, default_value, saved);
    return saved;
}

export function save(str, value) {
    console.log('saving');
    if (!storageAvailable('localStorage')) {
        console.error('localStorage is not accessible');
        return;
    }
    localStorage.setItem(str, btoa(JSON.stringify(value)));
    return true;
}

export function parsePaste(pastedText, err_callback) {
    let magister_results = [
        ...pastedText.matchAll(
            /<span\s+id="([A-Z]+)_[\d\.]+_(\d+)"\s+title="(\d+,\d+)"[\s\n]/g
        ),
    ];
    if (magister_results.length === 0) {
        throw 'Kon geen resultaten vinden op het klipbord';
    }

    let results = [];

    for (const [, subj, n, score] of magister_results) {
        const magister = subj + n;
        const assignment = assignment_were((a) => a.magister === magister);
        if (assignment) {
            results.push({
                magister,
                assignment,
                score: parseFloat(score.replace(',', '.')),
            });
        } else {
            err_callback(`Onbekende magister_id ${magister}`);
        }
    }
    return results;
}
