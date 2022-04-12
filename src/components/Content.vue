<template>
    <div class="content">
        <Overview />
        <Info :assignment="focussed" />
    </div>
</template>

<script>
import Overview from './Overview.vue';
import Info from './Info.vue';
import { mapGetters } from 'vuex';

export default {
    name: 'Content',
    components: {
        Overview,
        Info,
    },
    computed: mapGetters(['focussed']),
};
</script>

<style>
.content {
    width: 100vw;
    box-sizing: border-box;
    padding: 1em;
    display: flex;
    flex-flow: row wrap;
    align-items: flex-start;
}
</style>
