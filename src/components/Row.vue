<template>
    <tr class="grade-row">
        <td>{{ grade.shortname }}</td>
        <td class="blocks-column">
            <AssignmentBlocks :assignments="se_assignments" />
        </td>
        <td v-if="showResults" :title="unRoundedSEresult">{{ SEresult }}</td>
        <td class="blocks-column">
            <AssignmentBlocks
                v-if="ce_assignments"
                :assignments="ce_assignments"
            />
        </td>
        <td v-if="showResults" :title="unRoundedCEresult">{{ CEresult }}</td>
        <td v-if="showResults" :title="unRoundedResult">{{ result }}</td>
    </tr>
</template>

<script>
import AssignmentBlocks from './AssignmentBlocks.vue';
import { nl_num } from '../utils.js';

export default {
    name: 'Row',
    props: {
        grade: Object,
        showResults: Boolean,
    },
    components: {
        AssignmentBlocks,
    },
    computed: {
        se_assignments() {
            if (this.grade.type === 'VAK') {
                return this.grade.se_assignments;
            } else {
                return this.grade.assignments;
            }
        },
        ce_assignments() {
            if (this.grade.type === 'VAK') {
                return this.grade.ce_assignments;
            } else {
                return [];
            }
        },
        result() {
            return nl_num(this.$store.getters.result(this.grade, true), 0);
        },
        unRoundedResult() {
            return nl_num(this.$store.getters.result(this.grade, false));
        },
        SEresult() {
            return nl_num(
                this.$store.getters.result(this.grade, true, true, false),
                this.grade.ce_assignments ? 1 : 0
            );
        },
        unRoundedSEresult() {
            return nl_num(
                this.$store.getters.result(this.grade, false, true, false),
                this.grade.ce_assignments ? 1 : 0
            );
        },
        CEresult() {
            if (this.grade.type !== 'VAK' || !this.grade.ce_assignments) {
                return 'nvt';
            }
            return nl_num(
                this.$store.getters.result(this.grade, true, false, true),
                1
            );
        },
        unRoundedCEresult() {
            if (this.grade.type !== 'VAK' || !this.grade.ce_assignments) {
                return null;
            }
            return nl_num(
                this.$store.getters.result(this.grade, false, false, true)
            );
        },
    },
};
</script>

<style>
.blocks-column {
    height: 100%;
}

.grade-row {
    white-space: nowrap;
}
</style>
