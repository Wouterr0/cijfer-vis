<template>
    <Settings />
    <Content />
</template>

<script>
import Settings from './components/Settings.vue';
import Content from './components/Content.vue';
import { gen_id } from './utils.js';

export default {
    name: 'App',
    components: {
        Settings,
        Content,
    },
    computed: {
        roundness() {
            return this.$store.state.settings.round ? '2em' : '0';
        },
    },
    created() {
        console.log(this.$store.state);

        window.gen_id = gen_id;
    },
};
</script>

<style>
.assignment-block {
    border-radius: v-bind(roundness);
}
</style>
