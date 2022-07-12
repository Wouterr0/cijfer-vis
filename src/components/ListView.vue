<template>
    <table class="listview">
        <ListHeader
            :selectionType="selectionType"
            @set-all-toggle="setAllToggle"
        />
        <tbody>
            <ListRow
                :assignment="assignment"
                :selectionType="selectionType"
                :selectedAssignmentIDs="selectedAssignmentIDs"
                :key="assignment.id"
                v-for="assignment in assignments"
                @set-toggle="setToggle"
            />
            <!-- TODO: total -->
        </tbody>
    </table>
</template>

<script>
import ListHeader from './ListHeader.vue';
import ListRow from './ListRow.vue';
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
            selectedAssignmentIDs: [],
            selectionType: listSelectionTypes.None,
        };
    },
    methods: {
        setToggle(toggle, assignment) {
            console.log('set toggle', toggle, assignment.id);
            if (toggle) {
                if (this.selectionType === listSelectionTypes.None) {
                    this.selectionType = listSelectionTypes.Some;
                }
                this.selectedAssignmentIDs.push(assignment.id);
            } else {
                if (this.selectionType === listSelectionTypes.All) {
                    this.selectionType = listSelectionTypes.Some;
                }
                this.removeSelectedAssignment(assignment);
            }
            this.selectionType = listSelectionTypes.Some;
        },
        removeSelectedAssignment(assignment) {
            this.selectedAssignmentIDs = this.selectedAssignmentIDs.filter(
                (id) => id != assignment.id
            );
        },
        setAllToggle(toggle) {
            if (toggle) {
                this.selectionType = listSelectionTypes.All;
                this.selectedAssignmentIDs = this.assignments.map(
                    (assignment) => assignment.id
                );
            } else {
                this.selectionType = listSelectionTypes.None;
                this.selectedAssignmentIDs = [];
            }
        },
    },
    components: { ListHeader, ListRow },
};
</script>

<style>
.listview {
    width: 100%;
    display: table;

    height: 1px;
    margin-inline: 1em;
    border-collapse: collapse;
    font-size: calc(var(--table-font-size) * 0.6);
}

.listview th {
    padding: 0.4em;
    background: #ddd;
}

.listview th:first-child {
    border-top-left-radius: v-bind(roundness);
}

.listview th:last-child {
    border-top-right-radius: v-bind(roundness);
}

.header-row {
    border-bottom: 0.05em solid #444;
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
