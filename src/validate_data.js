export function check_validity(diploma, err_callback) {
    const id_regex = /^[a-z0-9]+$/;
    let known_ids = new Set();

    function check_string(assignment, p, regex, optional = false) {
        if (!(p in assignment)) {
            if (!optional) {
                err_callback('assignment has no property ' + p);
            }
            return;
        }
        if (typeof assignment[p] !== 'string') {
            err_callback(`assignment ${p} is not a string`);
            return;
        }
        if (regex && !regex.test(assignment[p])) {
            err_callback(`assignment ${p} contains invalid characters`);
            return;
        }
    }

    function check_number(assignment, p, optional = false) {
        if (!(p in assignment)) {
            if (!optional) {
                err_callback('assignment has no property ' + p);
            }
            return;
        }
        if (typeof assignment[p] !== 'number') {
            err_callback(`assignment ${p} is not a number`);
            return;
        }
    }

    function check_boolean(assignment, p, optional = false) {
        if (!(p in assignment)) {
            if (!optional) {
                err_callback('assignment has no property ' + p);
            }
            return;
        }
        if (typeof assignment[p] !== 'boolean') {
            err_callback(`assignment ${p} is not a boolean`);
            return;
        }
    }

    function check_array(assignment, p, optional = false) {
        if (!(p in assignment)) {
            if (!optional) {
                err_callback('assignment has no property ' + p);
            }
            return;
        }
        if (!Array.isArray(assignment[p])) {
            err_callback(`assignment ${p} is not an array`);
            return;
        }
    }

    function check_id(assignment, p = 'id', unique = true, optional = false) {
        if (!(p in assignment)) {
            if (!optional) {
                err_callback('assignment has no property ' + p);
            }
            return;
        }
        check_string(assignment, p, id_regex, optional, err_callback);
        if (assignment[p].length === 0) {
            err_callback(`assignment ${p} is empty`);
            return;
        }
        if (unique) {
            if (known_ids.has(assignment[p])) {
                err_callback(`assignment id ${assignment[p]} is not unique`);
                return;
            }
            known_ids.add(assignment.id);
        }
    }

    function check_type(assignment, one_of) {
        check_string(assignment, 'type', /^[A-Z]+$/);
        if (!one_of.includes(assignment.type)) {
            err_callback(
                `assignment type ${assignment.type} is not one of ${one_of}`
            );
            return;
        }
    }

    function check_domains(assignment, optional = false) {
        check_array(assignment, 'domains', optional);
        if (assignment.domains) {
            for (const domain of assignment.domains) {
                if (typeof domain !== 'string') {
                    if (!optional) {
                        err_callback(`domain ${domain} is not a string`);
                    }
                    return;
                }
                if (!/^[A-Z]\d*$/.test(domain)) {
                    err_callback(
                        `domain ${domain} contains invalid characters`
                    );
                    return;
                }
            }
        }
    }

    function check_school_assignment(assignment) {
        check_type(assignment, ['VAK', 'COMB', 'PO', 'MET', 'SET']);
        check_id(assignment);
        if (['PO', 'MET', 'SET'].includes(assignment.type)) {
            check_number(assignment, 'year');
            check_number(assignment, 'period');
            check_string(assignment, 'description');
            check_domains(assignment, true);
            check_number(assignment, 'weight');
            check_string(assignment, 'magister', /^[A-Z]+\d+$/, true);
        }
        if (assignment.type === 'VAK') {
            check_subject(assignment);
        }
    }

    function check_central_assignment(assignment) {
        check_type(assignment, ['CSE']);
        check_id(assignment);
        check_string(assignment, 'link');
    }

    function check_subject(assignment) {
        check_array(assignment, 'se_assignments');
        for (const se_assignment of assignment.se_assignments) {
            check_school_assignment(se_assignment);
        }
    }

    function check_combination(assignment) {
        check_array(assignment, 'assignments');
        for (const sub_assignment of assignment.assignments) {
            check_school_assignment(sub_assignment);
        }
    }

    function check_name(assignment) {
        check_string(assignment, 'fullname');
        check_string(assignment, 'shortname');
    }

    function check_top_grade(grade) {
        // only top grades
        // - can be optional
        // - can be replacing
        // - can have a name
        // top grades must be either a subject or a combination
        // and only top subjects can have a central exam
        check_boolean(grade, 'optional', true);
        check_string(grade, 'replaces', undefined, true);
        check_id(grade, 'replaces', false, true);
        check_name(grade);

        check_type(grade, ['VAK', 'COMB']);
        if (grade.type === 'VAK') {
            check_subject(grade);
            check_array(grade, 'ce_assignments', true);
            // only support one central exam
            if (grade.ce_assignments && grade.ce_assignments.length > 1) {
                err_callback(
                    `grade ${grade.id} has more than one central exam`
                );
                return;
            }

            if (grade.ce_assignments) {
                for (const ce_assignment of grade.ce_assignments) {
                    check_central_assignment(ce_assignment);
                }
            }
        }
        if (grade.type === 'COMB') {
            check_combination(grade);
        }
    }

    function check_diploma(diploma) {
        check_type(diploma, ['DIPLOMA']);
        check_name(diploma);
        check_id(diploma);
        check_array(diploma, 'grades');
        for (const grade of diploma.grades) {
            check_top_grade(grade);
        }
    }

    check_diploma(diploma);
}
