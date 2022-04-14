<template>
    <div class="assignment-block group-block">
        <AssignmentBlock
            :key="assignment.id"
            :assignment="assignment"
            :widthPercentage="(assignment.weight / totalSubweight) * 100"
            v-for="assignment in assignments"
        />
    </div>
</template>

<script>
import AssignmentBlock from './AssignmentBlock.vue';

export default {
    name: 'AssignmentBlocks',
    props: {
        assignments: Array,
    },
    components: {
        AssignmentBlock,
    },
    computed: {
        totalSubweight() {
            let totalSubweight = 0;
            for (const assignment of this.assignments) {
                totalSubweight += assignment.weight;
            }
            return totalSubweight;
        },
    },
};
</script>

<style>
.assignment-block {
    display: flex;
    gap: var(--assign-gap);
    padding: var(--assign-padd);
    border: var(--select-border-size) solid transparent;
}

.hovered-block {
    filter: brightness(85%);
}

.selected-block {
    border: var(--select-border-size) solid rgba(0, 0, 0, 0.6);
}

.group-block {
    width: 100%;
    height: 100%;
    padding: 0;
    border-width: 0;
}
</style>
