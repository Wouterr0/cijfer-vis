<template>
    <div class="grid">
        <Overview :subjects="this.subjects" :resultsMode="resultsMode" />
        <Info />
    </div>
</template>

<script>
import Overview from './Overview.vue';
import Info from './Info.vue';

export default {
    name: 'Content',
    components: {
        Overview,
        Info,
    },
    props: {
        resultsMode: Boolean,
        subjects: Array,
    },
    data() {
        return {};
    },
};
</script>

<style scoped>
.grid {
    display: flex;
    flex-flow: row wrap;
    align-items: flex-start;
}
</style>
