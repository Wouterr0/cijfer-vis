<template>
    <div
        :class="['info', assignmentId === null ? 'info-legend' : 'info-props']"
    >
        <!-- TODO: pass calculated used types -->
        <Legend v-if="assignmentId === null" :subjects="subjects" />
        <div v-else>
            <AssignmentProps :assignment-id="assignmentId" />
            <div class="result-input">
                <br>
                <ResultInput :assignment-id="assignmentId" />
            </div>
        </div>
    </div>
</template>

<script>
import Legend from './Legend.vue';
import AssignmentProps from './AssignmentProps.vue';
import ResultInput from './ResultInput.vue';

export default {
    name: 'Info',
    props: {
        assignmentId: String,
        subjects: Array,
    },
    components: {
        Legend,
        AssignmentProps,
        ResultInput,
    },
};
</script>

<style>
.info {
    background: GhostWhite;
    border: 0.2rem solid DarkGrey;
    font-size: calc(var(--font-size) * 2 / 3);
    padding: 0.5em;
    flex: 1;
    max-width: 30em;
    min-width: 15em;
}
</style>
