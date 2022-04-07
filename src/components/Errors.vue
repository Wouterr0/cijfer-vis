<template>
    <div
        class="errors"
        :style="{ display: errors.length ? 'initial' : 'none' }"
    >
        <div class="error" :key="index" v-for="(error, index) in errors">
            {{ error }}
        </div>
    </div>
</template>

<script>
export default {
    name: 'Errors',
    props: {
        errors: Array,
    },
};
</script>

<style>
.errors {
    margin: 1em 0;
}

.error {
    background-color: lightcoral;
    color: crimson;
    font-weight: 700;
    line-height: 1.6;
    padding: 0.1em 0.5em;
    white-space: pre-wrap;
}
</style>
