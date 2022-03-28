<template>
    <table class="overview">
        <Header :showResults="showResults" />
        <Row
            :key="subject.id"
            v-for="subject in subjects"
            :assignment="subject"
            :showResults="showResults"
            :clickedId="clickedId"
            :hoveredId="hoveredId"
            @assignment-view="(id, c) => $emit('assignmentView', id, c)"
        />
        <TotalRow v-if="showResults" />
    </table>
</template>
<script>
import Header from './Header.vue';
import Row from './Row.vue';
import TotalRow from './TotalRow.vue';
import { mapGetters } from 'vuex';

export default {
    name: 'Overview',
    props: {
        clickedId: String,
        hoveredId: String,
    },
    components: {
        Header,
        Row,
        TotalRow,
    },
    computed: mapGetters(['subjects', 'showResults']),
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
