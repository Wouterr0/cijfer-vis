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
        <td v-if="showResults">{{ nl_num(result(assignment.id, false)) }}</td>
    </tr>
</template>

<script>
import AssignmentBlocks from './AssignmentBlocks.vue';
import { nl_num } from '../utils.js';
import { mapGetters } from 'vuex';

export default {
    name: 'Row',
    props: {
        assignment: Object,
        showResults: Boolean,
        clickedId: String,
        hoveredId: String,
    },
    components: {
        AssignmentBlocks,
    },
    computed: mapGetters(['result']),
    methods: {
        nl_num,
    },
};
</script>

<style></style>
