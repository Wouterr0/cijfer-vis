<template>
    <input
        type="range"
        :value="this.value"
        :min="this.min"
        :max="this.max"
        :step="this.step"
    />
</template>

<script>
export default {
    name: 'Slider',
    props: {
        value: Number,
        min: Number,
        max: Number,
        step: Number,
    },
};
</script>
