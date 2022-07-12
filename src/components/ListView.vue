<template>
    <table class="listview">
        <ListHeader
            :selectionType="selectionType"
            @set-all-toggle="setAllToggle"
        />
        <tbody>
            <ListTotal
                :selectionType="selectionType"
                :selectedAssignmentIDs="selectedAssignments"
            />
            <ListRow
                :assignment="assignment"
                :selectionType="selectionType"
                :selectedAssignments="selectedAssignments"
                :key="assignment.id"
                v-for="assignment in assignments"
                @set-toggle="setToggle"
            />
        </tbody>
    </table>
</template>

<script>
import ListHeader from './ListHeader.vue';
import ListRow from './ListRow.vue';
import ListTotal from './ListTotal.vue';
import { mapGetters } from 'vuex';
import { listSelectionTypes } from '../utils.js';

export default {
    name: 'ListView',
    computed: {
        ...mapGetters(['assignments']),
        roundness() {
            return this.$store.state.settings.round ? '1.5em' : '0';
        },
    },
    data() {
        return {
            selectedAssignments: [],
            selectionType: listSelectionTypes.None,
        };
    },
    methods: {
        setToggle(toggle, assignment) {
            if (toggle) {
                if (this.selectionType === listSelectionTypes.None) {
                    this.selectionType = listSelectionTypes.Some;
                }
                this.selectedAssignments.push(assignment);
            } else {
                this.removeSelectedAssignment(assignment);
                if (this.selectedAssignments.length === 0) {
                    this.selectionType = listSelectionTypes.None;
                    return;
                }
            }
            this.selectionType = listSelectionTypes.Some;
        },
        removeSelectedAssignment(assignment) {
            this.selectedAssignments = this.selectedAssignments.filter(
                (a) => a.id != assignment.id
            );
        },
        setAllToggle(toggle) {
            if (toggle) {
                this.selectionType = listSelectionTypes.All;
                this.selectedAssignments = this.assignments;
            } else {
                this.selectionType = listSelectionTypes.None;
                this.selectedAssignments = [];
            }
        },
    },
    components: { ListHeader, ListTotal, ListRow },
};
</script>

<style>
.listview {
    width: 100%;
    display: table;

    height: 1px;
    margin-inline: 1vw;
    border-collapse: collapse;
    font-size: calc(var(--table-font-size) * 0.6);
}

.listview th {
    padding: 0.4em;
    background: #ddd;
}

.listview th:first-child {
    padding: 0.5em 0 0 0.4em;
    border-top-left-radius: v-bind(roundness);
}

.listview th:last-child {
    padding-right: 0.6em;
    border-top-right-radius: v-bind(roundness);
}

.header-row {
    border-bottom: 0.05em solid #888;
}

.content-row {
    border-bottom: 0.05em solid #ccc;
    cursor: pointer;
}

.content-row:hover {
    background-color: #eee;
}

.selected-row {
    background-color: #def;
}

.selected-row:hover {
    background-color: #bdf;
}

.total-row {
    background-color: #fdb;
}

.listview td {
    padding: 0.1em 0.4em;
}

.fixed-table {
    display: table;
    table-layout: fixed;
    width: 100%;
    border-collapse: collapse;
}

.big-cell {
    display: table-cell;
}

.ellipsis {
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    /* min-width: 0; */
}
</style>
