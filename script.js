'use strict';

var colors = {
    'PO': 'LightGreen',
    'SET': 'LightCoral',
    'MET': 'LightSalmon',
    'VAK': 'MediumSlateBlue',
    'COMB': 'LightSkyBlue',
}

function set_info(assignment) {
    if (!assignment) {
        let info = d3.select('#info');
        info.append('div')
            .attr('class', 'heading')
            .text('LEGENDA');
        for (const type in colors) {
            info.append('div')
                .attr('class', 'legend-item')
                .style('background-color', colors[type])
                .text(type);
        }
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
            set_info(assignment);
        });
}

function fill_div_assignment(div, assignment, weight, first = true) {
    if (assignment.type === 'VAK' || assignment.type === 'COMB') {
        if (!first) {
            div = add_assignment(assignment, div, colors[assignment.type], weight ? weight : 100);
        }
        let total_weight = get_total_subweight(assignment);
        for (const sub_assign of assignment.assignments) {
            fill_div_assignment(div, sub_assign, sub_assign.weight / total_weight * 100, false);
        }
    } else if (['PO', 'MET', 'SET'].includes(assignment.type)) {
        add_assignment(assignment, div, colors[assignment.type], weight)
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
        .attr('class', 'noout')
        .attr('class', 'assign-block')
        .style('width', '100%')
        .style('height', '100%');

    fill_div_assignment(assign, grade);
    // console.log(grade);
}

set_info();
