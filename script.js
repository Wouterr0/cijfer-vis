'use strict';

function fill_div_grade(div, grade) {
    let total_weight = d3.sum(grade.assignments, assignment => assignment.weight);
    if (grade.type === 'SUBJ') {
        for (const assignment of grade.assignments) {
            div.append('div')
                .style('width', `${assignment.weight / total_weight * 100}%`)
                .style('margin', '2px')
                .style('background-color', 'LightBlue');
        }
    } else if (grade.type === 'COMB') {
        for (const assignment of grade.assignments) {
            console.log(assignment);
            if (assignment.type === 'SUBJ') {
                let sub_div = div.append('div')
                    .style('display', 'flex')
                    .style('width', `${assignment.weight / total_weight * 100}%`)
                    .style('margin', '2px')
                    .style('background-color', 'LightGreen');
                fill_div_grade(sub_div, assignment);
            } else if (['PO', 'MET', 'SET'].includes(assignment.type)) {
                div.append('div')
                    .style('width', `${assignment.weight / total_weight * 100}%`)
                    .style('margin', '2px')
                    .style('background-color', 'LightBlue');
            }
        }
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
        .style('display', 'flex');

    row.append('td')
        .style('width', '10%')
        .text('6,9');

    fill_div_grade(assign, grade);
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