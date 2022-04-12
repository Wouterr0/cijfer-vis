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
    <!-- TODO: also display weight per subject -->
    <AssignmentProp
        key_="weging per cijfer"
        :value="nl_num(subjectWeight(assignment) * 100, undefined, 4) + '%'"
    />
    <!-- TODO: get also in rational form (a / b) eg. 1/40 -->
    <AssignmentProp
        key_="weging diplomacijfer"
        :value="nl_num(totalWeight(assignment) * 100, undefined, 4) + '%'"
    />
    <div v-if="['PO', 'MET', 'SET'].includes(assignment.type)">
        <AssignmentProp key_="leerjaar" :value="assignment.year" />
        <AssignmentProp key_="periode" :value="assignment.period" />
        <AssignmentProp
            v-if="'domains' in assignment"
            key_="domeinen"
            :value="assignment.domains.join(', ')"
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
