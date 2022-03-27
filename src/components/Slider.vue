<template>
    <input
        type="range"
        :value="modelValue"
        :min="min"
        :max="max"
        :step="step"
        @input="$emit('update:modelValue', $event.target.value)"
    />
</template>

<script>
export default {
    name: 'Slider',
    props: {
        modelValue: Number,
        min: Number,
        max: Number,
        step: Number,
    },
};
</script>
