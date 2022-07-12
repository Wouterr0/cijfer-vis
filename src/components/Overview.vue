<template>
    <table class="overview">
        <BlocksHeader :showCE="showCE" :showResults="showResults" />
        <BlocksRow
            :key="grade.id"
            v-for="grade in subjects"
            :grade="grade"
            :showCE="showCE"
            :showResults="showResults"
        />
        <TotalRow v-if="showResults" :showCE="showCE" />
    </table>
</template>
<script>
import BlocksHeader from './BlocksHeader.vue';
import BlocksRow from './BlocksRow.vue';
import TotalRow from './TotalRow.vue';
import { mapGetters, mapState } from 'vuex';

export default {
    name: 'Overview',
    components: {
        BlocksHeader,
        BlocksRow,
        TotalRow,
    },
    computed: {
        ...mapGetters(['subjects', 'showResults']),
        ...mapState({
            showCE: (state) => state.settings.showCE,
        }),
    },
};
</script>

<style>
.overview {
    width: 100%;
    max-width: 65em;
    height: 1px;
    border-spacing: var(--assign-gap);
    font-size: var(--table-font-size);
}

.overview th,
.overview tr,
.overview td {
    padding: 0;
}
</style>
