<template>
    <span class="info-key">{{ key_ }}: </span>
    <span class="info-value" :style="style">{{ value.toString() }}</span>
    <br />
</template>

<script>
export default {
    name: 'AssignmentProp',
    props: {
        key_: String,
        value: null,
        style: Object,
    },
    methods: {
        toString,
    },
};
</script>

<style>
.info-key {
    font-weight: 700;
}
</style>
