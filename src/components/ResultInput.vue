<template>
    <label>
        Resultaat:
        <br />
        <!-- TODO: v-bind value? -->
        <input type="number" min="1" step="0.1" placeholder="6,9" required />
        <input type="button" value="invullen" @click="submitResult" />
        <input type="button" value="wissen" @click="clearResult" />
    </label>
</template>

<script>
export default {
    name: 'ResultInput',
    props: {
        assignmentId: String,
        
    },
    methods: {
        clearResult() {
            this.$emit('submitResult', assignmentId, null)
        }
    }
};
</script>

<style></style>
