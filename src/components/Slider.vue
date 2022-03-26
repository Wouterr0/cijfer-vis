<template>
    <input
        type="range"
        :value="value"
        :min="min"
        :max="max"
        :step="step"
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
