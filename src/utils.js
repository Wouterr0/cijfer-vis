import raw_diploma from './data.js';
import { check_validity } from './validate_data.js';

export const modi = { results: 'RESULTATEN', list: 'LIJST', plan: 'PLANNEN' };

export const listSelectionTypes = {
    All: 'all',
    Some: 'some',
    None: 'none',
};

export function all_sub_assignments(assignment) {
    let sub_assignments = [];
    if (assignment.grades) sub_assignments.push(...assignment.grades);
    if (assignment.assignments) sub_assignments.push(...assignment.assignments);
    if (assignment.se_assignments)
        sub_assignments.push(...assignment.se_assignments);
    if (assignment.ce_assignments)
        sub_assignments.push(...assignment.ce_assignments);
    return sub_assignments;
}

export function assignment_where(f, assignment = raw_diploma) {
    if (f(assignment)) {
        return assignment;
    } else {
        let assignments = all_sub_assignments(assignment);

        if (assignments) {
            for (const sub_assignment of assignments) {
                const result = assignment_where(f, sub_assignment);
                if (result) {
                    return result;
                }
            }
        }
    }
}

export function parent_where(f, assignment) {
    if (assignment.parent == undefined) return null;
    let parent = assignment.parent;
    if (f(parent)) return parent;
    return parent_where(f, parent);
}

export function assignments_where(f, assignment = raw_diploma, result = []) {
    let assignments;
    if (Array.isArray(assignment)) {
        assignments = assignment;
    } else {
        if (f(assignment)) result.push(assignment);
        assignments = all_sub_assignments(assignment);
    }

    if (assignments) {
        for (const sub_assignment of assignments) {
            assignments_where(f, sub_assignment, result);
        }
    }
    return result;
}

export function assignment_by_id(id) {
    return assignment_where((a) => a.id === id);
}

export function parse_data(diploma) {
    /*
     * Steps:
     * 1. copy and remove like references
     * 2. reference parent back (.parent)
     * 3. cache se/ce_total_subweight for easy access
     * 4. check validity of loaded data
     */

    // copy and remove like references
    function replace_like(assignment) {
        if (assignment.like) {
            if (assignment.se_assignments || assignment.ce_assignments) {
                throw new Error('A like assignment cannot have children');
            }
            const src = assignment_by_id(assignment.like);
            if (src === undefined) {
                throw new Error(
                    `Cannot find like reference ${assignment.like}`
                );
            }
            if (src.se_assignments || src.ce_assignments) {
                throw new Error('A liked assignment cannot have children');
            }
            for (const key in src) {
                if (!(key in assignment))
                    // don't duplicate key if aready exists
                    assignment[key] = src[key];
            }
            delete assignment.like;
        }
        if (assignment.grades) {
            for (const sub_assignment of assignment.grades) {
                replace_like(sub_assignment);
            }
        }
        if (assignment.se_assignments) {
            for (const sub_assignment of assignment.se_assignments) {
                replace_like(sub_assignment);
            }
        }
        if (assignment.ce_assignments) {
            for (const sub_assignment of assignment.ce_assignments) {
                replace_like(sub_assignment);
            }
        }
    }
    replace_like(diploma);

    // reference parent back (.parent)
    function link_back(assignment, parent) {
        if (parent) {
            assignment.parent = parent;
        }
        // cache se/ce_total_subweight for easy access
        let sub_assignments = all_sub_assignments(assignment);
        if (sub_assignments) {
            let weight_sum = 0;
            for (const sub_assignment of sub_assignments) {
                link_back(sub_assignment, assignment);
                if (sub_assignment.weight === undefined)
                    sub_assignment.weight = 1;
                if (sub_assignment.type !== 'CSE') {
                    weight_sum += sub_assignment.weight;
                }
            }
            assignment.total_subweight = weight_sum;
        }
    }
    link_back(diploma);

    // check validity of loaded data
    check_validity(diploma, (msg) => {
        throw new Error(msg);
    });

    return diploma;
}

export function round(n, decimals) {
    return Math.round((n + Number.EPSILON) * 10 ** decimals) / 10 ** decimals;
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
            /<span\s+id="([A-Z]+).{0,16}?(\d+)"\s+title="(\d+,\d+)"[\s\n]/g
        ),
    ];
    if (magister_results.length === 0) {
        throw 'Kon geen magister resultaten vinden op het klipbord';
    }

    let results = [];

    for (const [, subj, n, score] of magister_results) {
        const magister = subj + n;

        const assignments = assignments_where((a) => a.magister === magister);
        if (assignments.length === 0)
            err_callback(`Onbekende magister kolomnaam: ${magister}`);
        for (const assignment of assignments) {
            results.push({
                magister,
                assignment,
                score: parseFloat(score.replace(',', '.')),
            });
        }
    }
    return results;
}
