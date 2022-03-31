<template>
    <div :class="['info', assignment ? 'info-props' : 'info-legend']">
        <!-- TODO: pass calculated used types -->
        <Legend v-if="!assignment" />
        <div v-else>
            <AssignmentProps :assignment="assignment" />
            <div class="result-input" v-if="showResults">
                <br />
                <ResultInput :assignment="assignment" />
            </div>
        </div>
    </div>
</template>

<script>
import Legend from './Legend.vue';
import AssignmentProps from './AssignmentProps.vue';
import ResultInput from './ResultInput.vue';
import { mapGetters } from 'vuex';

export default {
    name: 'Info',
    props: {
        assignment: Object,
    },
    components: {
        Legend,
        AssignmentProps,
        ResultInput,
    },
    computed: mapGetters(['showResults']),
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
