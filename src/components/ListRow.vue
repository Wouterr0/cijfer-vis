<template>
    <tr
        @click="toggleSelected"
        :class="{ 'content-row': true, 'selected-row': selected }"
    >
        <td>
            <input type="checkbox" :checked="selected" />
        </td>
        <td :title="subject_fullname">{{ subject_shortname }}</td>
        <td>{{ assignment.type }}</td>
        <td>{{ formattedPeriod }}</td>
        <td :title="assignment.description" class="big-cell">
            <div class="fixed-table">
                <div class="ellipsis">{{ assignment.description }}</div>
            </div>
        </td>
        <td>
            {{ nl_num(totalWeight(assignment) * 100, undefined, 4) + '%' }}
        </td>
        <td>
            {{ nl_num(result) }}
        </td>
    </tr>
</template>

<script>
import { mapGetters } from 'vuex';
import { parent_where, nl_num, listSelectionTypes } from '../utils.js';

export default {
    name: 'ListRow',
    props: {
        assignment: Object,
        selectedAssignments: Array,
        selectionType: String,
    },
    computed: {
        ...mapGetters(['totalWeight']),
        result() {
            return this.$store.getters.result(this.assignment, false) || '-';
        },
        formattedPeriod() {
            if (
                this.assignment.period !== undefined &&
                this.assignment.year !== undefined
            ) {
                return `J${this.assignment.year}P${this.assignment.period}`;
            } else {
                return '-';
            }
        },
        selected() {
            return this.selectedAssignments.some(
                (a) => a.id === this.assignment.id
            );
        },
    },
    data() {
        return {
            subject_fullname: null,
            subject_shortname: null,
        };
    },
    methods: {
        nl_num,
        toggleSelected() {
            this.$emit(
                'set-toggle',
                this.selectionType != listSelectionTypes.All &&
                    (this.selectionType == listSelectionTypes.None ||
                        !this.selected),
                this.assignment
            );
        },
    },
    created() {
        let parent_subject = parent_where(
            (a) => a.type === 'VAK',
            this.assignment
        );
        this.subject_fullname = parent_subject?.fullname || '-';
        this.subject_shortname = parent_subject?.shortname || '-';
    },
};
</script>

<style></style>
