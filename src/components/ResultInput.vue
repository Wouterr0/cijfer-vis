<template>
    <label>
        Resultaat:
        <br />
        <input type="number" min="1" step="0.1" v-model="result" required />
        <input type="button" value="invullen" @click="submitResult" />
        <input type="button" value="wissen" @click="clearResult" />
    </label>
</template>

<script>
import { mapState } from 'vuex';

export default {
    name: 'ResultInput',
    props: {
        assignment: Object,
    },
    data() {
        return {
            result: this.$store.state.results[this.assignment.id],
        };
    },
    methods: {
        clearResult() {
            this.$store.commit('setResult', {
                assignment: this.assignment,
            });
        },
        submitResult() {
            this.$store.commit('setResult', {
                assignment: this.assignment,
                result: this.result,
            });
        },
    },
    watch: {
        assignment() {
            this.result = this.$store.state.results[this.assignment.id];
        },
    },
};
</script>

<style></style>
