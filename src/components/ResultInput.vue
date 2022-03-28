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
        assignmentId: String,
    },
    data() {
        return {
            result: this.$store.state.results[this.assignmentId],
        };
    },
    methods: {
        clearResult() {
            this.$store.commit('setResult', {
                id: this.assignmentId,
            });
        },
        submitResult() {
            this.$store.commit('setResult', {
                id: this.assignmentId,
                result: this.result,
            });
        },
    },
    watch: {
        assignmentId() {
            this.result = this.$store.state.results[this.assignmentId];
        },
    },
};
</script>

<style></style>
