<template>
    <tr>
        <td>{{ assignment.shortname }}</td>
        <td>
            <AssignmentBlocks
                :assignments="assignment.assignments"
                :clickedId="clickedId"
                :hoveredId="hoveredId"
                @assignment-view="(id, c) => $emit('assignmentView', id, c)"
            />
        </td>
        <td>{{ avg }}</td>
    </tr>
</template>

<script>
import AssignmentBlocks from './AssignmentBlocks.vue';
import { calc_avg, nl_num } from '../utils.js';

export default {
    name: 'Row',
    props: {
        assignment: Object,
        resultsMode: Boolean,
        clickedId: String,
        hoveredId: String,
    },
    components: {
        AssignmentBlocks,
    },
    computed: {
        avg() {
            return nl_num(calc_avg(), 1);
        },
    },
};
</script>

<style></style>
