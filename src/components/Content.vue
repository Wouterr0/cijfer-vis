<template>
    <div class="content-outer">
        <div class="content">
            <template v-if="mode == 'list'">
                <ListView />
            </template>
            <template v-else>
                <Overview />
                <Info :assignment="focussed" />
            </template>
        </div>
    </div>
</template>

<script>
import ListView from './ListView.vue';
import Overview from './Overview.vue';
import Info from './Info.vue';
import { mapGetters, mapState } from 'vuex';

export default {
    name: 'Content',
    components: {
        ListView,
        Overview,
        Info,
    },
    computed: {
        ...mapGetters(['focussed']),
        ...mapState({ mode: (state) => state.settings.mode }),
    },
};
</script>

<style>
.content-outer {
    width: calc(100vw - 17px);
}

.content {
    width: 100%;
    padding: 1em;
    box-sizing: border-box;
    display: flex;
    flex-flow: row wrap;
    align-items: flex-start;
}

.small-row {
    width: 5%;
}
</style>
