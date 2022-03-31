<template>
    <div
        :class="[
            'assignment-block',
            hovered && hovered.id === assignment.id ? 'hovered-block' : null,
            clicked && clicked.id === assignment.id ? 'selected-block' : null,
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
            v-if="assignment.assignments"
            :assignments="assignment.assignments"
        />
    </div>
</template>

<script>
import { defineAsyncComponent } from 'vue';
import { mapState } from 'vuex';

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
        ...mapState(['hovered', 'clicked']),
        background() {
            const res = this.$store.getters.result(this.assignment);
            const type = this.assignment.type;
            if (
                res === undefined ||
                !this.$store.getters.showResults ||
                this.assignment.assignments
            ) {
                return `var(--${type}-color)`;
            } else {
                const fill_percent =
                    ((this.$store.getters.result(this.assignment) - 1) / 9) *
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
            this.$store.commit('hover', this.assignment);
        },
        onLeave() {
            this.$store.commit('hover', null);
        },
        onClick() {
            this.$store.commit('click', this.assignment);
        },
    },
};
</script>

<style></style>
