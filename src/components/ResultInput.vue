<template>
    <label>
        Resultaat:
        <br />
        <input
            type="number"
            min="1"
            step="0.1"
            v-model="result"
            :disabled="!canInput"
            required
        />
        <input
            type="button"
            value="invullen"
            :disabled="!canInput"
            @click="submitResult"
        />
        <input
            type="button"
            value="wissen"
            :disabled="!canInput"
            @click="clearResult"
        />
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
            result: this.$store.getters.result(this.assignment, true),
        };
    },
    computed: {
        canInput() {
            return ['SET', 'MET', 'PO'].includes(this.assignment.type);
        },
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
            this.result = this.$store.getters.result(this.assignment, true);
        },
    },
};
</script>

<style></style>
