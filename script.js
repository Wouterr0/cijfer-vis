'use strict';

let mode = 'RES';  // RES mode or PLAN mode
let selected_assign;
let results = {};
// let results = JSON.parse(atob('eyIwb3RnbXRsbm51Ijo2LjQsImlhM241bXBxOGgiOjguOCwiYmlidGhueDFkaiI6Ny4xLCJnYng2aGRxaWhwIjo4LjgsImQ0dno2djViOTkiOjguNiwieDRtbnN1NXBtcyI6OC4zLCI0amduc2g3MjN5Ijo2LjksIjM2NDVnY3gwbjQiOjguMywiNHNmM255a2w1OSI6OS42LCJ0dHptMHpmOW03IjoxMCwiZ3c3cDc2M3U1NSI6OS4yLCJ5d29mbHFrZHh6Ijo3LjksIjh1bG1jMWpxcDciOjguNSwiaGZoeXlyams0MCI6OC43LCJ3M3RmbXphcTBvIjo3LjMsImVqc3hyeHg0N3EiOjguMywiZGF2dmU1NHU0dyI6OS40LCJxdmt3MW16czV5Ijo2LCJ6c3dwcDE5aDl4Ijo3LCJ3bzRtaWgxaGNxIjo2LjMsInl0NW41eHN1eWEiOjYuOCwiN3JkNmYwZ2FhaCI6OC4yfQ=='));
let used_types = {};

function nl_num(n, fract_digits) {
    if (fract_digits) {
        return n.toLocaleString('nl', { minimumFractionDigits: fract_digits, maximumFractionDigits: fract_digits });
    } else {
        return n.toLocaleString('nl');
    }
}

function gen_id() {
    return Math.random().toString(36).slice(2, 12);
}

function rgb_to_str(rgb) {
    return `rgb(${rgb.join(', ')})`;
}

function get_assign_by_id(id, assignments = schema) {
    for (const assign of assignments) {
        if (assign.id === id) {
            return assign;
        }
        if (assign.assignments) {
            let res = get_assign_by_id(id, assign.assignments);
            if (res) {
                return res;
            }
        }
    }
}

function calc_avg(grade, layer_rounding = false) {
    if (!['VAK', 'COMB'].includes(grade.type)) {
        throw `cannot calculate average of assignment type ${grade.type}`;
    }
    if (grade.assignments.length === 0) {
        return;
    }
    let total_subweight = get_total_subweight(grade);

    let weighted_sum = 0;
    let weight_sum = 0;
    for (const assign of grade.assignments) {
        let score;
        if (['PO', 'MET', 'SET'].includes(assign.type)) {
            score = results[assign.id];
            if (!score) {
                continue;
            }
        } else {
            score = calc_avg(assign, layer_rounding);
            if (!score) {
                continue;
            }
        }
        let weight = assign.weight / total_subweight;
        weighted_sum += score * weight;
        weight_sum += weight;
    }
    if (weight_sum === 0) {
        return;
    }

    let avg = weighted_sum / weight_sum;
    return layer_rounding ? Math.round((avg + Number.EPSILON) * 10) / 10 : avg;
}

function select_id(id) {
    return d3.select(`[id="${id}"]`);
}

function apply_assign_result(id) {
    if (!(id in results)) {
        return;
    }
    let assign_div = select_id(id);
    let type = get_assign_by_id(id).type;
    let fill_percent = (results[id] - 1) / 9 * 100;
    assign_div
        .style('background', `border-box linear-gradient(0deg, var(--${type}-color-dark) 0%, var(--${type}-color-dark) ${fill_percent}%, var(--${type}-color) ${fill_percent}%, var(--${type}-color) 100%)`);
}

function add_prop(info, key, value) {
    info.append('span')
        .attr('class', 'info-key')
        .text(`${key}: `);
    let value_span = info.append('span')
        .attr('class', 'info-value')
        .text(value);
    info.append('br');
    return value_span;
}

function update_info() {
    let info = d3.select('#info');
    info.selectAll('*').remove();
    if (!selected_assign) {
        info.attr('class', 'info-legend')
            .append('div')
            .attr('class', 'heading')
            .text('LEGENDA');
        
        let types = Object.assign({}, used_types);
        while (Object.keys(types).length !== 0) {
            let type = Object.keys(types).reduce((t, c) => { return types[t] > types[c] ? t : c });
            info.append('div')
                .attr('class', 'legend-item')
                .style('background-color', `var(--${type}-color)`)
                .text(type);
            delete types[type];
        }
    } else {
        info.attr('class', 'info-props')
        add_prop(info, 'soort', selected_assign.type)
            .style('background-color', `var(--${selected_assign.type}-color)`)
            .style('padding', '0 .25em');
        if (['VAK', 'COMB'].includes(selected_assign.type)) {
            add_prop(info, 'naam', selected_assign.fullname);
        }
        add_prop(info, 'cijfer weging', `${nl_num(selected_assign.global_weight_percent)}%`);
        if (['PO', 'MET', 'SET'].includes(selected_assign.type)) {
            add_prop(info, 'leerjaar', selected_assign.year);
            add_prop(info, 'periode', selected_assign.period);
            if (selected_assign.domains) {
                add_prop(info, 'domeinen', selected_assign.domains.join(', '));
            }
            add_prop(info, 'beschrijving', selected_assign.description)
                .style('white-space', 'pre-wrap');
        }

        if (!plan_mode()) {
            let can_input = ['PO', 'MET', 'SET'].includes(selected_assign.type);

            let value;
            if (can_input) {
                if (selected_assign.id in results) {
                    value = results[selected_assign.id];
                } else {
                    value = 5.5;
                }
            } else {
                let avg = calc_avg(selected_assign, true);
                if (avg) {
                    value = avg;
                } else {
                    value = 5.5;
                }
            }

            info.append('p');
            info.append('label')
                .attr('for', 'result')
                .text('Resultaat');
            info.append('br');
            info.append('input')
                .attr('id', 'result')
                .attr('type', 'number')
                .attr('min', '1')
                .attr('step', '0.1')
                .property('disabled', !can_input)
                .property('required', true)
                .attr('lang', 'nl')
                .node().valueAsNumber = value;
            info.append('input')
                .attr('type', 'button')
                .property('disabled', !can_input)
                .attr('value', 'invullen')
                .on('click', () => {
                    let result = d3.select('#result').node();
                    if (!result.checkValidity()) {
                        alert(result.validationMessage);
                    } else {
                        results[selected_assign.id] = result.valueAsNumber;
                        save_results();
                        show_table();
                    }
                });
            info.append('input')
                .attr('type', 'button')
                .property('disabled', !can_input)
                .attr('value', 'wissen')
                .on('click', () => {
                    delete results[selected_assign.id];
                    save_results();
                    show_table();
                    update_info();
                });
            // TODO: add remove result button

        }
    }
}

function set_button_text() {
    d3.select('#mode').attr('value', (plan_mode() ? 'plannen' : 'resultaten').toUpperCase());
}

function plan_mode() {
    return mode === 'PLAN';
}

function change_mode() {
    mode = plan_mode() ? 'RES' : 'PLAN';

    show_page();
}

function get_total_subweight(assignment) {
    return d3.sum(assignment.assignments, assignment => assignment.weight);
}

function show_assign(assignment, selected = false) {
    if (assignment) {
        selected_assign = Object.assign(assignment);
        selected_assign.selected = selected;
    } else {
        selected_assign = assignment;
    }
    update_info();
}

function use_type(type) {
    if (!(type in used_types)) {
        used_types[type] = 0;
    }
    used_types[type]++;
}

function add_assignment(assignment, div, weight_percent) {
    let assign_div = div.append('div')
        .attr('id', assignment.id)
        .classed('assign-block', true)
        .classed('selected', selected_assign && assignment.id === selected_assign.id)
        .style('width', `${weight_percent}%`)
        .style('background-color', `var(--${assignment.type}-color)`);
    if (!plan_mode()) {
        apply_assign_result(assignment.id);
    }

    assign_div
        .on('mouseover', (e) => {
            e.stopPropagation();
            assign_div.style('filter', 'brightness(85%)');
            if (!selected_assign) {
                show_assign(assignment);
            }
        })
        .on('mouseout', (e) => {
            e.stopPropagation();
            assign_div.style('filter', null);
            if (!selected_assign.selected) {
                show_assign(null);
            }
        })
        .on('click', (e) => {
            e.stopPropagation();
            if (assign_div.attr('id') === selected_assign.id) {
                show_assign(assignment, !selected_assign.selected);
            } else {
                d3.select('.selected').classed('selected', false);
                show_assign(assignment, true);
            }
            assign_div.classed('selected', selected_assign.selected);
        });
    return assign_div;
}

function fill_div_assignment(div, assignment, weight, first = true, global_weight_percent = 100) {
    if (assignment.type === 'VAK' || assignment.type === 'COMB') {
        if (!first) {
            use_type(assignment.type);
            assignment.global_weight_percent = global_weight_percent;
            div = add_assignment(assignment, div, weight ? weight : 100);
        }
        let total_weight = get_total_subweight(assignment);
        for (const sub_assign of assignment.assignments) {
            fill_div_assignment(div, sub_assign, sub_assign.weight / total_weight * 100, false, sub_assign.weight / total_weight * global_weight_percent);
        }
    } else if (['PO', 'MET', 'SET'].includes(assignment.type)) {
        use_type(assignment.type);
        assignment.global_weight_percent = global_weight_percent;
        add_assignment(assignment, div, weight, global_weight_percent);
    }
}

function show_clipboard_import() {
    if (!plan_mode()) {
        d3.select('.grid')
            .append('a')
            .attr('class', 'import-btn')
            .attr('href', 'import.html')
            .text('Importeer cijfers van magister');
    } else {
        d3.select('.import-btn').remove();
    }
}

function show_table() {
    let table = d3.select('#overview');
    table.selectChildren().remove();

    table.append('th')
        .text('VAK')
        .style('width', '5%');
    table.append('th')
        .text('OPDRACHTEN');
    if (!plan_mode()) {
        table.append('th')
            .text('GEM.')
            .style('width', '5%');
    }

    let avgs = [];

    for (const grade of schema) {
        let row = table.append('tr');

        row.append('td')
            .text(grade.shortname)
            .attr('title', grade.fullname);
        let assign = row.append('td')
            .style('height', '100%')
            .append('div')
            .attr('class', 'noout assign-block')
            .style('width', '100%')
            .style('height', '100%')
            .style('padding', '0')
            .style('border-width', '0');
        if (!plan_mode()) {
            let avg = calc_avg(grade, true);
            let avg_elem = row.append('td');
            if (avg) {
                avg_elem.text(nl_num(avg, 1))
                    .attr('title', nl_num(calc_avg(grade)));
            } else {
                avg_elem.text('-');
            }

            if (avg) {
                avgs.push([avg, calc_avg(grade)]);
            }
        }

        fill_div_assignment(assign, grade);
    }


    if (!plan_mode()) {
        let minv = Infinity;
        let maxv = -Infinity;
        let sum = 0;
        let rsum = 0;
        for (const avg of avgs) {
            sum += avg[0];
            rsum += avg[1];
            minv = Math.min(minv, avg[0]);
            maxv = Math.max(maxv, avg[0]);
        }

        // TODO: sort avgs
        let median;
        if (avgs.length === 0) { }
        else if (avgs.length % 2 == 0) {
            median = (avgs[avgs.length / 2 - 1][0] + avgs[avgs.length / 2][0]) / 2;
        } else {
            median = avgs[Math.floor(avgs.length / 2)][0];
        }

        let total_row = table.append('tr')
        let tot_hr = total_row.append('td')
            .attr('colspan', '2');
        tot_hr.append('hr').attr('class', 'tot-sep');
        let total = tot_hr.append('div')
            .style('display', 'flex');
        total.append('div')
            .text('Totaal:');
        let stats = total.append('div')
            .attr('class', 'stats');
        stats.append('div').html(`<strong>min:</strong> ${avgs.length === 0 ? '-' : nl_num(minv, 1)}`);
        stats.append('div').html(`<strong>max:</strong> ${avgs.length === 0 ? '-' : nl_num(maxv, 1)}`);
        stats.append('div').html(`<strong>mediaan:</strong> ${avgs.length === 0 ? '-' : nl_num(median, 1)}`);


        let total_avg_elem = total_row.append('td');
        total_avg_elem.append('hr').attr('class', 'tot-sep');

        let avg_div = total_avg_elem.append('div');
        if (avgs.length === 0) {
            avg_div.text('-');
        } else {
            avg_div.text(nl_num(sum / avgs.length, 1))
                .attr('title', nl_num(rsum / avgs.length));
        }
    }
}

function show_page() {
    set_button_text();
    show_table();
    show_clipboard_import();
    update_info();
}

// TODO: ensure no errors in data.js

load_results();
show_page();
