<template>
    <label>
        Resultaat:
        <br />
        <input
            type="number"
            min="1"
            step="0.1"
            v-model="result"
            @keyup.enter="submitResult"
            :disabled="!canInput"
            :title="!canInput && subAssignmentResult"
            required
        />
        <!-- TODO: add a way to view un rounded result -->
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
export default {
    name: "ResultInput",
    props: {
        assignment: Object,
    },
    data() {
        return {
            result: undefined,
        };
    },
    computed: {
        subAssignmentResult() {
            return this.$store.getters.result(this.assignment, false);
        },
        canInput() {
            return ["SET", "MET", "PO", "CSE"].includes(this.assignment.type);
        },
    },
    methods: {
        clearResult() {
            this.$store.commit("setResult", {
                assignment: this.assignment,
            });
        },
        submitResult() {
            this.$store.commit("setResult", {
                assignment: this.assignment,
                result: this.result,
            });
        },
        updateResult() {
            this.result = this.$store.getters.result(this.assignment, true);
        },
    },
    watch: {
        assignmentResult() {
            this.updateResult();
        },
    },
    created() {
        this.updateResult();
    },
};
</script>

<style></style>
