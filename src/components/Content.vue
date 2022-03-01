<template>
    <div class="content">
        <Overview
            :subjects="subjects"
            :resultsMode="resultsMode"
            @assignment-hover="assignmentHover"
        />
        <Info :assignment-id="focusId" />
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
    props: {
        resultsMode: Boolean,
        subjects: Array,
    },
    methods: {
        assignmentHover(id) {
            console.log('focus assignment with id', id);
            this.focusId = id;
        }
    },
    data() {
        return {
            focusId: null,
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
