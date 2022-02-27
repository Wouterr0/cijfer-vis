<template>
    <div
        class="assignment-block"
        :style="{
            width: widthPercentage + '%',
            background: `var(--${assignment.type}-color)`,
            filter: isViewed ? 'brightness(85%)' : null,
        }"
        @mouseenter.stop="onEnter()"
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
        onEnter() {
            
            console.log('ENTER', this.assignment.id);
            this.isViewed = true;
        },
        onLeave() {
            console.log('LEAVE', this.assignment.id);
            this.isViewed = false;
        },
    },
};
</script>

<style></style>
