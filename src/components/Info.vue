<template>
    <div :class="['info', assignmentId === null ? 'info-legend' : 'info-props']">
        <!-- TODO: pass calculated used types -->
        <Legend v-if="assignmentId === null" :subjects="subjects" />
        <AssignmentProps v-else :assignment-id="assignmentId" />
    </div>
</template>

<script>
import Legend from './Legend.vue'
import AssignmentProps from './AssignmentProps.vue'

export default {
    name: 'Info',
    props: {
        assignmentId: String,
        subjects: Array,
    },
    components: {
        Legend,
        AssignmentProps,
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
