'use strict';

var colors = {
    'PO': 'LightGreen',
    'SET': 'LightCoral',
    'MET': 'LightSalmon',
    'VAK': 'MediumSlateBlue',
    'COMB': 'LightSkyBlue',
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

function set_info(assignment) {
    let info = d3.select('#info');
    info.selectAll('*').remove();
    if (!assignment) {
        info.attr('class', 'info-legend')
            .append('div')
            .attr('class', 'heading')
            .text('LEGENDA');
        for (const type in colors) {
            info.append('div')
                .attr('class', 'legend-item')
                .style('background-color', colors[type])
                .text(type);
        }
    } else {
        console.log(assignment);
        info.attr('class', 'info-props')
        add_prop(info, 'soort', assignment.type)
            .style('background-color', colors[assignment.type])
            .style('padding', '0 .25em');
        add_prop(info, 'weging', `${assignment.global_weight_percent}%`);
        add_prop(info, 'leerjaar', assignment.year);
        add_prop(info, 'periode', assignment.period);
        if (assignment.domains) {
            add_prop(info, 'domeinen', assignment.domains.join(', '));
        }
        add_prop(info, 'beschrijving', assignment.description);
        


    }
}

function get_total_subweight(assignment) {
    return d3.sum(assignment.assignments, assignment => assignment.weight);
}

function add_assignment(assignment, div, color, weight_percent) {
    return div.append('div')
        .attr('class', 'assign-block')
        .style('width', `${weight_percent}%`)
        .style('background-color', color)
        .on('mouseover', (e) => {
            set_info(assignment);
        })
        .on('mouseout', (e) => {
            set_info();
        });
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

for (const grade of schema) {

    let row = d3.select('#overview')
        .append('tr')

    row.append('td')
        .text(grade.shortname)
        .style('width', '10%');
    let assign = row.append('td')
        .append('div')
        .attr('class', 'noout assign-block')
        .style('width', '100%')
        .style('height', '100%');

    fill_div_assignment(assign, grade);
    // console.log(grade);
}

set_info();
