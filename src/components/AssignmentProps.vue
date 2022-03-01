<template>
    <AssignmentProp
        key_="soort"
        :value="assignment.type"
        :style="{
            background: `var(--${assignment.type}-color)`,
            padding: '0 .25em',
        }"
    />
    <AssignmentProp
        v-if="['VAK', 'COMB'].includes(assignment.type)"
        key_="naam"
        :value="assignment.fullname"
    />
    <AssignmentProp
        key_="cijfer weging"
        :value="nl_num(assignment.global_weight_percent) + '%'"
    />
    <div v-if="['PO', 'MET', 'SET'].includes(assignment.type)">
        <AssignmentProp key_="leerjaar" :value="assignment.year" />
        <AssignmentProp key_="periode" :value="assignment.period" />
        <AssignmentProp
            v-if="'domains' in assignment"
            key_="domeinen"
            :value="assignment.domains"
        />
        <AssignmentProp
            key_="beschrijving"
            :value="assignment.description"
            :style="{
                whiteSpace: 'pre-wrap',
            }"
        />
    </div>
</template>

<script>
import { assignment_by_id, nl_num } from '../utils.js';
import AssignmentProp from './AssignmentProp.vue';

export default {
    props: {
        assignmentId: String,
    },
    methods: {
        nl_num,
    },
    computed: {
        assignment() {
            return assignment_by_id(this.assignmentId);
        },
    },
    components: {
        AssignmentProp,
    },
};
</script>
