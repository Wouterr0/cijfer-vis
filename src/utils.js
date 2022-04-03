import { def } from '@vue/shared';
import raw_grade from './data.js';

export const modi = { results: 'RESULTATEN', plan: 'PLANNEN' };

export function assignment_by_id(id, assignments = raw_grade.assignments) {
    for (const assignment of assignments) {
        if (assignment.id === id) {
            return assignment;
        }
        if (assignment.assignments) {
            let res = assignment_by_id(id, assignment.assignments);
            if (res) {
                return res;
            }
        }
    }
}

function sum_assignment_weights(assignments) {
    let sum = 0;
    for (const assignment of assignments) {
        if (assignment.weight) {
            sum += assignment.weight;
        } else {
            sum += 1;
        }
    }
    return sum;
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
    if (saved === null) {
        saved = default_value;
    } else {
        saved = JSON.parse(atob(saved));
        // populate default values
        for (const k in default_value) {
            if (!(k in saved)) saved[k] = default_value[k];
        }
    }
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
