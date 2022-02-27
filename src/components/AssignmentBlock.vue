<template>
    <div
        :class="['assignment-block', isViewed ? 'hovered-block' : null]"
        :style="{
            width: widthPercentage + '%',
            background: `var(--${assignment.type}-color)`,
        }"
        @mouseover.stop="onOver()"
        @mouseout.stop="onLeave()"
    >
        <AssignmentBlocks
            v-if="['COMB', 'VAK'].includes(assignment.type)"
            :assignments="assignment.assignments"
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
    },
    data() {
        return {
            isViewed: false,
        };
    },
    components: {
        AssignmentBlocks: defineAsyncComponent(() =>
            import('./AssignmentBlocks.vue')
        ),
    },
    methods: {
        onOver() {
            this.isViewed = true;
        },
        onLeave() {
            this.isViewed = false;
        },
    },
};
</script>

<style></style>
