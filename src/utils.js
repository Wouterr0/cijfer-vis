import raw_subjects from './data.js';

export const modi = { results: 'RESULTATEN', plan: 'PLANNEN' };

export function assignment_by_id(id, assignments = raw_subjects) {
    for (const assignment of assignments) {
        if (assignment.id === id) {
            return assignment;
        }
        if (['COMB', 'VAK'].includes(assignment.type)) {
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

export function parse_data(subjects) {
    function recurse(assignment, weight = 100, global_weight_percent = 100) {
        assignment.global_weight_percent = global_weight_percent;
        if (['VAK', 'COMB'].includes(assignment.type)) {
            let total_weight = sum_assignment_weights(assignment.assignments);
            for (const sub_assignment of assignment.assignments) {
                recurse(
                    sub_assignment,
                    (sub_assignment.weight / total_weight) * 100,
                    (sub_assignment.weight / total_weight) *
                        global_weight_percent
                );
            }
        }
    }

    for (const subject of subjects) {
        recurse(subject);
    }
    return subjects;
}

/* export function calc_global_weight_percent(
    id,
    weight_percent = 100,
    assignments = raw_subjects
) {
    let weight_sum = sum_assignment_weights(assignments);
    for (const assignment of assignments) {
        if (assignment.id === id) {
            return (weight_percent * assignment.weight) / weight_sum;
        } else if (['COMB', 'VAK'].includes(assignment.type)) {
            let ret = calc_global_weight_percent(
                id,
                assignment.assignments,
                (weight_percent * assignment.weight) / weight_sum
            );
            if (ret) {
                return ret;
            }
        }
    }
}
*/

export function gen_id() {
    return Math.random().toString(36).slice(2, 12);
}

export function nl_num(n, fract_digits) {
    if (n === undefined) {
        return '-';
    }

    const options = {
        maximumFractionDigits: 3,
    };
    if (fract_digits) {
        return n.toLocaleString('nl', {
            ...options,
            minimumFractionDigits: fract_digits,
            maximumFractionDigits: fract_digits,
        });
    } else {
        return n.toLocaleString('nl', options);
    }
}
