<template>
    <input
        type="button"
        :value="UIValue"
        @click="nextValue"
    />
</template>

<script>
export default {
    name: 'ToggleButton',
    props: {
        values: Object,
        modelValue: String,
    },
    computed: {
        UIValue() {
            return this.values[this.modelValue];
        }
    },
    methods: {
        nextValue() {
          	const keys = Object.keys(this.values);
            const val = keys[(keys.indexOf(this.modelValue) + 1) % keys.length];
            this.$emit('update:modelValue', val);
        },
    },
};
</script>
