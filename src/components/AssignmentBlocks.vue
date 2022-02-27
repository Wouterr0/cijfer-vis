<template>
    <div class="assignment-block group-block">
        <AssignmentBlock
            :key="assignment.id"
            :assignment="assignment"
            :widthPercentage="assignment.weight / totalSubweight * 100"
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
    data() {
        return {
            totalSubweight: 0,
        }
    },
    created() {
        this.totalSubweight = 0;
        for (const assignment of this.assignments) {
            this.totalSubweight += assignment.weight;
        }
    }
    
};
</script>

<style>
.assignment-block {
    display: flex;
    gap: var(--assign-gap);
    padding: var(--assign-padd);
    border: var(--select-border-size) solid transparent;
    /* box-sizing: border-box; */
}

.group-block {
    width: 100%;
    height: 100%;
    padding: 0;
    border-width: 0;
}
</style>
