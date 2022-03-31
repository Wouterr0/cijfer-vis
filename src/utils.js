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

export function grade_weight(assignment) {
    let weight = assignment.weight;
    do {
        assignment = assignment.parent;
        weight /= assignment.total_subweight;
    } while (assignment.parent);
    return weight;
}

export function subject_weight(assignment) {}

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
