'use strict';

var colors = {
    'COMB': 'LightSkyBlue',
    'SUBJ': 'LightGreen',
    'PO': 'Lavender',
    'MET': 'LightSalmon',
    'SET': 'LightCoral',
}

function get_total_subweight(assignment) {
    return d3.sum(assignment.assignments, assignment => assignment.weight);
}

function add_assignment(div, color, weight_percent) {
    return div.append('div')
        .attr('class', 'assign-block')
        .style('width', `${weight_percent}%`)
        .style('background-color', color);
}

function fill_div_assignment(div, assignment, weight, first=true) {
    if (assignment.type === 'SUBJ' || assignment.type === 'COMB') {
        if (!first) {
            div = add_assignment(div, colors[assignment.type], weight ? weight : 100);
        }
        let total_weight = get_total_subweight(assignment);
        for (const sub_assign of assignment.assignments) {
            fill_div_assignment(div, sub_assign, sub_assign.weight / total_weight * 100, false);
        }
    } else if (['PO', 'MET', 'SET'].includes(assignment.type)) {
        add_assignment(div, colors[assignment.type], weight)
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
        .style('width', '100%')
        .style('height', '100%')
        .style('display', 'flex')
        .style('gap', '5px')

    row.append('td')
        .style('width', '10%')
        .text('6,9');

    fill_div_assignment(assign, grade);
    // console.log(grade);
}

// d3.select('body')
//     .append('p');
// let contain = d3.select('body')
//     .append('div').style('width', '600px').style('height', '300px').style('display', 'flex');
// for (let i = 0; i < 5; i++) {
//     contain.append('div')
//         .style('width', '100%')
//         .style('height', '100%')
//         .style('margin', '5px')
//     // .style('flex', '1')
// }