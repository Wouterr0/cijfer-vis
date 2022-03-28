<template>
    <div class="content">
        <Overview
            :clickedId="clickedId"
            :hoveredId="hoveredId"
            @assignment-view="assignmentView"
        />
        <Info :assignment-id="focussedId" />
    </div>
</template>

<script>
import Overview from './Overview.vue';
import Info from './Info.vue';

export default {
    name: 'Content',
    components: {
        Overview,
        Info,
    },
    props: {},
    methods: {
        assignmentView(id, clicked) {
            if (clicked) {
                // Deselect block if clicked while aready selected
                this.clickedId = this.clickedId === id ? null : id;
            } else {
                this.hoveredId = id;
            }

            this.focussedId =
                this.clickedId !== null ? this.clickedId : this.hoveredId;

            // console.log(id, clicked, '-', this.hoveredId, this.hoveredId);
        },
    },
    data() {
        return {
            focussedId: null,
            clickedId: null,
            hoveredId: null,
        };
    },
};
</script>

<style>
.content {
    display: flex;
    flex-flow: row wrap;
    align-items: flex-start;
}
</style>
