<template>
    <Settings />
    <Content />
</template>

<script>
import Settings from './components/Settings.vue';
import Content from './components/Content.vue';
import { gen_id, storageAvailable, load, save } from './utils.js';
import { mapState } from 'vuex';

export default {
    name: 'App',
    components: {
        Settings,
        Content,
    },
    computed: {
        ...mapState(['settings', 'results']),
        roundness() {
            return this.settings.round ? '2em' : '0';
        },
    },
    watch: {
        settings: {
            handler() {
                save('settings', this.settings);
            },
            deep: true,
        },
        results: {
            handler() {
                save('results', this.results);
            },
            deep: true,
        },
    },
    created() {
        console.log(this.$store.state);

        window.gen_id = gen_id;
    },
};
</script>

<style>
.content {
    --table-font-size: calc(v-bind(settings.scale) * min(4vh, min(5vw, 2em)));
}

.assignment-block {
    border-radius: v-bind(roundness);
}
</style>
