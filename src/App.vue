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
import Settings from './components/Settings.vue';
import Content from './components/Content.vue';
import rawData from './data.js';

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
        this.subjects = rawData;
        console.log(rawData);
    },
};
</script>

<style></style>
