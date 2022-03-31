<template>
    <tr>
        <td>{{ assignment.shortname }}</td>
        <td>
            <AssignmentBlocks :assignments="assignment.assignments" />
        </td>
        <td v-if="showResults" :title="nl_num(result(assignment))">
            {{ nl_num(result(assignment, true), 1) }}
        </td>
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
