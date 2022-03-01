<template>
    <Settings
        :optional="this.settings.extra"
        :replacing="this.settings.replacing"
        :round="this.settings.round"
        :scale="this.settings.scale"
    />
    <Content
        :subjects="this.subjects"
        :resultsMode="this.settings.resultsMode"
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
            subjects: [],
            settings: {
                extra: [],
                replacing: [],
                round: false,
                scale: 1,
                resultsMode: true,
            },
        };
    },
    created() {
        this.subjects = parse_data(rawData);
        console.log(this.subjects);
    },
};
</script>

<style></style>
