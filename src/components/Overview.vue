<template>
    <table class="overview">
        <Header :resultsMode="resultsMode" />
        <Row
            :key="subject.id"
            v-for="subject in subjects"
            :assignment="subject"
            :resultsMode="resultsMode"
        />
    </table>
</template>
<script>
import Header from './Header.vue';
import Row from './Row.vue';

export default {
    name: 'Overview',
    props: {
        subjects: Array,
        resultsMode: Boolean,
    },
    components: {
        Header,
        Row,
    },
};
</script>

<style>
.overview {
    width: min(100vw, max(45em, 80vw));
    height: 1px;
    border-spacing: var(--assign-gap);
    margin: 0 0.3em 0.3em 0;
    font-size: var(--table-font-size);
}

th,
tr,
td {
    padding: 0;
}
</style>
