<template>
    <table class="overview">
        <Header :showResults="showResults" />
        <Row
            :key="subject.id"
            v-for="subject in subjects"
            :assignment="subject"
            :showResults="showResults"
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
    width: 100%;
    max-width: 45em;
    height: 1px;
    border-spacing: var(--assign-gap);
    font-size: var(--table-font-size);
}

th,
tr,
td {
    padding: 0;
}
</style>
