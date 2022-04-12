<template>
    <AssignmentProp
        key_="soort"
        :style="{
            background: `var(--${assignment.type}-color)`,
            padding: '0 .25em',
        }"
        >{{ assignment.type }}</AssignmentProp
    >
    <AssignmentProp
        v-if="['VAK', 'COMB'].includes(assignment.type)"
        key_="naam"
        >{{ assignment.fullname }}</AssignmentProp
    >
    <!-- TODO: also display weight per subject -->
    <AssignmentProp key_="weging per cijfer">{{
        nl_num(subjectWeight(assignment) * 100, undefined, 4) + '%'
    }}</AssignmentProp>
    <!-- TODO: get also in rational form (a / b) eg. 1/40 -->
    <AssignmentProp key_="weging diplomacijfer">{{
        nl_num(totalWeight(assignment) * 100, undefined, 4) + '%'
    }}</AssignmentProp>
    <template v-if="['PO', 'MET', 'SET'].includes(assignment.type)">
        <AssignmentProp key_="leerjaar">{{ assignment.year }}</AssignmentProp>
        <AssignmentProp key_="periode">{{ assignment.period }}</AssignmentProp>
        <AssignmentProp v-if="'domains' in assignment" key_="domeinen">{{
            assignment.domains.join(', ')
        }}</AssignmentProp>
        <AssignmentProp
            key_="beschrijving"
            :style="{
                whiteSpace: 'pre-wrap',
            }"
            >{{ assignment.description }}</AssignmentProp
        >
    </template>
    <AssignmentProp v-if="assignment.link" key_="link">
        <a :href="assignment.link" target="_blank">
            {{ assignment.link }}
        </a>
    </AssignmentProp>
</template>

<script>
import { mapGetters } from 'vuex';
import { nl_num } from '../utils.js';
import AssignmentProp from './AssignmentProp.vue';

export default {
    props: {
        assignment: Object,
    },
    computed: mapGetters(['subjectWeight', 'totalWeight']),
    methods: {
        nl_num,
    },
    components: {
        AssignmentProp,
    },
};
</script>
