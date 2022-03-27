<template>
    <label>
        Resultaat:
        <br />
        <input type="number" min="1" step="0.1" :value="result" required />
        <input type="button" value="invullen" @click="submitResult" />
        <input type="button" value="wissen" @click="clearResult" />
    </label>
</template>

<script>
import { mapState } from 'vuex';

export default {
    name: 'ResultInput',
    props: {
        assignmentId: String,
    },
    computed: {
        result() {
            return this.$store.state.results[this.assignmentId];
        }
    },
    methods: {
        clearResult() {
        },
        submitResult() {
        },
    },
};
</script>

<style></style>
