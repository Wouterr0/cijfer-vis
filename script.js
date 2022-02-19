'use strict';

let mode = 'RES';  // RES mode or PLAN mode
let selected_assign;  // TODO: store `selected` not on the object but in a separate object
let results = {};
// let results = JSON.parse(atob('eyIwb3RnbXRsbm51Ijo2LjQsImlhM241bXBxOGgiOjguOCwiYmlidGhueDFkaiI6Ny4xLCJnYng2aGRxaWhwIjo4LjgsImQ0dno2djViOTkiOjguNiwieDRtbnN1NXBtcyI6OC4zLCI0amduc2g3MjN5Ijo2LjksIjM2NDVnY3gwbjQiOjguMywiNHNmM255a2w1OSI6OS42LCJ0dHptMHpmOW03IjoxMCwiZ3c3cDc2M3U1NSI6OS4yLCJ5d29mbHFrZHh6Ijo3LjksIjh1bG1jMWpxcDciOjguNSwiaGZoeXlyams0MCI6OC43LCJ3M3RmbXphcTBvIjo3LjMsImVqc3hyeHg0N3EiOjguMywiZGF2dmU1NHU0dyI6OS40LCJxdmt3MW16czV5Ijo2LCJ6c3dwcDE5aDl4Ijo3LCJ3bzRtaWgxaGNxIjo2LjMsInl0NW41eHN1eWEiOjYuOCwiN3JkNmYwZ2FhaCI6OC4yfQ=='));
let settings = { extra: [], replacing: [] };
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

/**
 * Transform schema to parse and remove `like` refrences
 */
function preprocess_schema() {

    function recurse(assign) {
        if (assign.like) {
            const src = get_assign_by_id(assign.like);
            for (const key in src) {
                if (!(key in assign)) {  // don't duplicate key if aready exists
                    assign[key] = src[key];
                }
            }
            delete assign.like;
        }

        if (['PO', 'MET', 'SET'].includes(assign.type)) { }
        else {
            for (const i in assign.assignments) {
                recurse(assign.assignments[i]);
            }
        }
    }

    for (const i in schema) {
        recurse(schema[i]);
    }
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
                }
            } else {
                let avg = calc_avg(selected_assign, true);
                if (avg) {
                    value = avg;
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
                .attr('placeholder', nl_num(6.9))
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

    show_page_for_mode();
}

function set_scale() {
    let scale_val = d3.select('.scale').property('valueAsNumber');
    settings.scale = scale_val;
    save_settings();
    d3.select(':root')
        .style('--table-font-size', `calc(min(4vh, min(5vw, 2em)) * ${scale_val})`);
}

function set_round() {
    let is_round = d3.select('#round').property('checked');
    settings.round = is_round;
    save_settings();
    if (is_round) {
        d3.select('body').append('style').attr('class', 'round-style').text('.assign-block{border-radius: 2em;}');
    } else {
        d3.select('.round-style').remove();
    }
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

function show_import_link() {
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

function show_clear_button() {
    if (!plan_mode()) {
        d3.select('#settings')
            .insert('input', '#mode + *')
            .attr('type', 'button')
            .attr('class', 'clear-btn')
            .attr('value', 'ALLE RESULTATEN WISSEN')
            .on('click', () => {
                if (confirm('Weet je zeker dat je alle resultaten wilt wissen?')) {
                    results = {};
                    save_results();
                    show_table();
                }
            })
    } else {
        d3.select('.clear-btn').remove();
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

    for (let grade of schema) {
        if (grade.replaces) {
            continue;
        }

        for (const ids of settings.replacing) {
            let [replacing, replaced] = ids.split('-');
            if (replacing === grade.id) {
                grade = get_assign_by_id(replaced);
            }
        }

        let toggle = d3.select(`#toggle-${grade.id}`);
        if (!toggle.empty() && !toggle.property('checked')) {
            continue;
        }
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

function get_optional_assigns(pure, replacing, assignments = schema) {
    for (const assign of assignments) {
        if (assign.type === 'VAK') {
            if (assign.optional === true) {
                pure.push(assign);
            }
            if (assign.replaces) {
                replacing.push([get_assign_by_id(assign.replaces), assign]);
            }
        } else if (assign.type === 'COMB') {
            get_optional_assigns(pure, replacing, assign.assignments);
        }
    }
}

function add_optional_settings() {
    let pure = [];
    let replacing = [];  // [the subject that is default, the subject that can replace it], ...
    get_optional_assigns(pure, replacing);
    for (const optional of pure) {
        let id = `toggle-${optional.id}`;
        let chbx = d3.select('#settings').insert('input', '.scale')
            .attr('type', 'checkbox')
            .attr('id', id)
            .property('checked', settings.extra.includes(optional.id))
            .on('click', () => {
                if (chbx.property('checked')) {
                    if (!settings.extra.includes(optional.id)) {
                        settings.extra.push(optional.id);
                    }
                } else {
                    if (settings.extra.includes(optional.id)) {
                        settings.extra.splice(settings.extra.indexOf(optional.id), 1);
                    }
                }
                save_settings();
                show_table();
            });
        d3.select('#settings').insert('label', '.scale')
            .attr('for', id)
            .attr('title', optional.fullname)
            .text(optional.shortname);
        d3.select('#settings').insert('br', '.scale');
    }
    d3.select('#settings').insert('hr', '.scale');
    for (const replaced of replacing) {
        console.log(replaced);
        let ids = replaced[0].id + '-' + replaced[1].id;
        let id = 'replace-' + ids;
        let chbx = d3.select('#settings').insert('input', '.scale')
            .attr('type', 'checkbox')
            .attr('id', id)
            .property('checked', settings.replacing.includes(ids))
            .on('click', () => {
                if (chbx.property('checked')) {
                    if (!settings.replacing.includes(ids)) {
                        settings.replacing.push(ids);
                    }
                } else {
                    if (settings.replacing.includes(ids)) {
                        settings.replacing.splice(settings.replacing.indexOf(ids), 1);
                    }
                }
                save_settings();
                show_table();
                selected_assign = undefined;
                update_info();
            });
        d3.select('#settings').insert('label', '.scale')
            .attr('for', id)
            .attr('title', replaced[1].fullname)
            .text(replaced[1].shortname);
        d3.select('#settings').insert('br', '.scale');

    }
}

function load_ui_settings() {
    if ('scale' in settings) {
        d3.select('.scale')
            .property('value', settings.scale);
    }
    set_scale()

    if ('round' in settings) {
        d3.select('#round')
            .property('checked', settings.round);
    }
    set_round();
}

function apply_settings() {
    add_optional_settings();
    load_ui_settings();
}

function show_page_for_mode() {
    set_button_text();
    show_clear_button();
    show_table();
    show_import_link();
    update_info();
}

// TODO: ensure no errors in data.js
preprocess_schema();
load_results();
load_settings();
apply_settings();
show_page_for_mode();
