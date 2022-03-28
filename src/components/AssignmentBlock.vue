<template>
    <div
        :class="[
            'assignment-block',
            hoveredId === assignment.id ? 'hovered-block' : null,
            clickedId === assignment.id ? 'selected-block' : null,
        ]"
        :style="{
            width: widthPercentage + '%',
            background: background,
        }"
        @mouseover.stop="onOver()"
        @mouseout.stop="onLeave()"
        @click.stop="onClick()"
    >
        <AssignmentBlocks
            v-if="['COMB', 'VAK'].includes(assignment.type)"
            :assignments="assignment.assignments"
            :clicked-id="clickedId"
            :hovered-id="hoveredId"
            @assignment-view="(id, c) => $emit('assignmentView', id, c)"
        />
    </div>
</template>

<script>
import { defineAsyncComponent } from 'vue';
import { mapGetters } from 'vuex';

export default {
    name: 'AssignmentBlock',
    props: {
        assignment: Object,
        widthPercentage: Number,
        hoveredId: String,
        clickedId: String,
    },
    components: {
        AssignmentBlocks: defineAsyncComponent(() =>
            import('./AssignmentBlocks.vue')
        ),
    },
    computed: {
        background() {
            const res = this.$store.getters.result(this.assignment.id);
            const type = this.assignment.type;
            if (
                res === undefined ||
                !this.$store.getters.showResults ||
                this.assignment.assignments
            ) {
                return `var(--${type}-color)`;
            } else {
                const fill_percent =
                    ((this.$store.getters.result(this.assignment.id) - 1) / 9) *
                    100;
                return `border-box linear-gradient(0deg, \
                        var(--${type}-color-dark) 0%, \
                        var(--${type}-color-dark) ${fill_percent}%, \
                        var(--${type}-color) ${fill_percent}%, \
                        var(--${type}-color) 100%)`;
            }
        },
    },
    methods: {
        onOver() {
            this.$emit('assignmentView', this.assignment.id, false);
        },
        onLeave() {
            this.$emit('assignmentView', null, false);
        },
        onClick() {
            this.$emit('assignmentView', this.assignment.id, true);
        },
    },
};
</script>

<style></style>
