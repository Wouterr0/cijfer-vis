'use strict';

const colors = {
    'PO': [144, 238, 144],
    'SET': [240, 128, 128],
    'MET': [255, 160, 122],
    'VAK': [123, 104, 238],
    'COMB': [135, 206, 250],
}

let mode = 'RES';  // RES mode or PLAN mode
let selected_assign;
let results = {};  // TODO: load saved results from localStorage if available

function nl_num(n) {
    return n.toLocaleString('nl');
}

function gen_id() {
    return Math.random().toString(36).slice(2, 12);
}

function rgb_to_str(rgb) {
    return `rgb(${rgb.join(', ')})`;
}

function storageAvailable(type) {
    var storage;
    try {
        storage = window[type];
        var x = '__storage_test__';
        storage.setItem(x, x);
        storage.removeItem(x);
        return true;
    }
    catch (e) {
        return e instanceof DOMException && (
            // everything except Firefox
            e.code === 22 ||
            // Firefox
            e.code === 1014 ||
            // test name field too, because code might not be present
            // everything except Firefox
            e.name === 'QuotaExceededError' ||
            // Firefox
            e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
            // acknowledge QuotaExceededError only if there's something already stored
            (storage && storage.length !== 0);
    }
}

function load_results() {
    if (!storageAvailable('localStorage')) {
        console.error('localStorage is not accessible');
        return false;
    }
    let saved_results = localStorage.getItem('results');
    if (saved_results === null) {
        results = {};
        return false;
    }
    results = JSON.parse(atob(saved_results));
    return true;
}

function save_results() {
    if (!storageAvailable('localStorage')) {
        console.error('localStorage is not accessible');
        return false;
    }
    localStorage.setItem('results', btoa(JSON.stringify(results)));
    return true;
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
        console.warn(`grade of type ${grade.type} has 0 assignments`);
        return 0;
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
    return weighted_sum / weight_sum;  // TODO: round appropriately
}

function select_id(id) {
    return d3.select(`[id="${id}"]`);
}

function apply_assign_result(id) {
    if (!(id in results)) {
        return;
    }
    let assign_div = select_id(id);
    const dark_factor = .7;
    let color = colors[get_assign_by_id(id).type];
    let dark_color = rgb_to_str(color.map(i => i * dark_factor));
    color = rgb_to_str(color)
    let fill_percent = (results[id] - 1) / 9 * 100;
    assign_div
        .style('background', `border-box linear-gradient(0deg, ${dark_color} 0%, ${dark_color} ${fill_percent}%, ${color} ${fill_percent}%, ${color} 100%)`);

    /*
    color_strings = [`${colors[0]} 0%`];
    for (var i = 1; i < colors.length; i++) {
        var color_percent = (1 - 1 / 2 ** i) * 100 + "%";
        color_strings.push(`${colors[i - 1]} ${color_percent}`);
        color_strings.push(`${colors[i]} ${color_percent}`);
    }
    color_strings.push(`${colors[colors.length - 1]} 100%`);
    document.body.style.background = `linear-gradient(90deg, ${color_strings.join(
        ", "
    )})`;
    */
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
        for (const type in colors) {
            info.append('div')
                .attr('class', 'legend-item')
                .style('background-color', rgb_to_str(colors[type]))
                .text(type);
        }
    } else {
        info.attr('class', 'info-props')
        add_prop(info, 'soort', selected_assign.type)
            .style('background-color', rgb_to_str(colors[selected_assign.type]))
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
            let can_input = !['PO', 'MET', 'SET'].includes(selected_assign.type);

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
                .property('disabled', can_input)
                .property('required', true)
                .attr('lang', 'nl')
                .node().valueAsNumber = selected_assign.id in results ? results[selected_assign.id] : (5.5);
            info.append('input')
                .attr('type', 'button')
                .property('disabled', can_input)
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

    show_table();
    set_button_text();
    update_info();
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

function add_assignment(assignment, div, color, weight_percent) {
    let assign_div = div.append('div')
        .attr('id', assignment.id)
        .classed('assign-block', true)
        .classed('selected', selected_assign && assignment.id === selected_assign.id)
        .style('width', `${weight_percent}%`)
        .style('background-color', rgb_to_str(color));
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
            assignment.global_weight_percent = global_weight_percent;
            div = add_assignment(assignment, div, colors[assignment.type], weight ? weight : 100);
        }
        let total_weight = get_total_subweight(assignment);
        for (const sub_assign of assignment.assignments) {
            fill_div_assignment(div, sub_assign, sub_assign.weight / total_weight * 100, false, sub_assign.weight / total_weight * global_weight_percent);
        }
    } else if (['PO', 'MET', 'SET'].includes(assignment.type)) {
        assignment.global_weight_percent = global_weight_percent;
        add_assignment(assignment, div, colors[assignment.type], weight, global_weight_percent)
    }
}

function show_table() {
    let table = d3.select('#overview');
    table.selectChildren().remove();

    table.append('th')
        .text('VAK')
        .style('width', '10%');
    table.append('th')
        .text('OPDRACHTEN');
    if (!plan_mode()) {
        table.append('th')
            .text('GEM.')
            .style('width', '10%');
    }

    for (const grade of schema) {
        let row = table.append('tr');

        row.append('td')
            .text(grade.shortname);
        let assign = row.append('td')
            .append('div')
            .attr('class', 'noout assign-block')
            .style('width', '100%')
            .style('height', '100%')
            .style('padding', '0')
            .style('border-width', '0');
        if (!plan_mode()) {
            let avg = calc_avg(grade, true);
            row.append('td')
                .text(avg ? nl_num(avg) : '-');
        }

        fill_div_assignment(assign, grade);
        // console.log(grade);
    }
}

// TODO: ensure no duplicate id's

load_results();

show_table();
set_button_text();
update_info();