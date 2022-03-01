<template>
    <div
        :class="[
            'assignment-block',
            hoveredId === assignment.id ? 'hovered-block' : null,
            clickedId === assignment.id ? 'selected-block' : null,
        ]"
        :style="{
            width: widthPercentage + '%',
            background: `var(--${assignment.type}-color)`,
        }"
        @mouseover.stop="onOver()"
        @mouseout.stop="onLeave()"
        @click.stop="onClick()"
    >
        <AssignmentBlocks
            v-if="['COMB', 'VAK'].includes(assignment.type)"
            :assignments="assignment.assignments"
            :clickedId="clickedId"
            :hoveredId="hoveredId"
            @assignment-view="(id, c) => $emit('assignmentView', id, c)"
        />
    </div>
</template>

<script>
import { defineAsyncComponent } from 'vue';

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
    methods: {
        onOver() {
            this.$emit('assignmentView', this.assignment.id, false);
        },
        onLeave() {
            this.$emit('assignmentView', null, false);
        },
        onClick() {
            this.$emit(
                'assignmentView',
                this.assignment.id,
                true
            );
        },
    },
};
</script>

<style></style>
