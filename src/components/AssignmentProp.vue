<template>
    <span class="info-key">{{ key_ }}: </span>
    <span class="info-value" :style="style"><slot /></span>
    <br />
</template>

<script>
export default {
    name: 'AssignmentProp',
    props: {
        key_: String,
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
