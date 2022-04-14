<template>
    <Errors :errors="errors" />
    <Settings @paste="onPaste" />
    <Content />
</template>

<script>
import Settings from './components/Settings.vue';
import Content from './components/Content.vue';
import Errors from './components/Errors.vue';
import { gen_id, load, save, parsePaste } from './utils.js';
import { mapState } from 'vuex';

export default {
    name: 'App',
    components: {
        Settings,
        Content,
        Errors,
    },
    computed: {
        ...mapState(['settings', 'results']),
        roundness() {
            return this.$store.state.settings.round ? '2em' : '0';
        },
    },
    data() {
        return {
            errors: [],
        };
    },
    methods: {
        onPaste(e) {
            console.log('onPaste', e);
            e.preventDefault();
            try {
                let copiedResults = parsePaste(
                    e.clipboardData.getData('text/html'),
                    (error) => {
                        this.errors.push(error);
                    }
                );

                let results = { ...load('results', {}) };
                for (const result of copiedResults) {
                    results[result.assignment.id] = result.score;
                }
                // TODO: Also turn on apropiate optional subjects
                this.$store.state.results = load('results', results);
            } catch (err) {
                console.error(err);
                this.errors.push(err);
                return;
            }
        },
    },
    watch: {
        settings: {
            handler() {
                save('settings', this.$store.state.settings);
            },
            deep: true,
        },
        results: {
            handler() {
                save('results', this.$store.state.results);
            },
            deep: true,
        },
    },
    created() {
        console.log(this.$store.state);
        // console.log(this.$store.getters.result(this.$store.state.diploma.grades[0], true));
        console.log(
            this.$store.getters.result(this.$store.state.diploma, true)
        );
        window.gen_id = gen_id;
    },
    errorCaptured(err, vm, info) {
        this.errors.push(err);
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
