<template>
    <Settings
        :saved-optional="this.settings.extra"
        :saved-replacing="this.settings.replacing"
        :saved-round="this.settings.round"
        :saved-scale="this.settings.scale"
        @toggle-round="toggleRound"
    />
    <Content
        :subjects="this.subjects"
        :results-mode="this.settings.resultsMode"
    />
</template>

<script>
import rawData from './data.js';
import { parse_data } from './utils.js';
import Settings from './components/Settings.vue';
import Content from './components/Content.vue';

export default {
    name: 'App',
    components: {
        Settings,
        Content,
    },
    data() {
        return {
            test: 'red',
            subjects: [],
            results: [],
            settings: {
                extra: [],
                replacing: [],
                round: false,
                scale: 1,
                resultsMode: true,
            },
        };
    },
    // TODO: deep watcher on settings and save it to LocalStorage
    methods: {
        toggleRound() {
            this.settings.round = !this.settings.round;
        }
    },
    computed: {
        roundness() {
            return this.settings.round ? '2em' : '0';
        }
    },
    created() {
        this.subjects = parse_data(rawData);
        console.log(this.subjects);
    },
};
</script>

<style>
.assignment-block {
    border-radius: v-bind(roundness);
}
</style>
