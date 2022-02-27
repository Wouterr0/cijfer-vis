<template>
    <input
        type="button"
        :value="this.toggled ? this.other : this.default"
        @click="toggle()"
    />
</template>

<script>
export default {
    name: 'ToggleButton',
    props: {
        default: String,
        other: String,
    },
    data() {
        return {
            toggled: false,
        };
    },
    created() {},
    methods: {
        toggle() {
            this.toggled = !this.toggled;
        },
    },
};
</script>
