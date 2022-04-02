<template>
    <input type="checkbox" :id="assignment.id" v-model="optional" />
    <label :for="assignment.id">
        {{ assignment.shortname }}
    </label>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
    name: 'Optional',
    props: {
        assignment: Object,
    },
    computed: {
        ...mapGetters(['isOptional']),
        optional: {
            get() {
                return this.$store.getters.isOptional(this.assignment);
            },
            set(turnedOn) {
                this.$store.commit('setOptional', {
                    assignment: this.assignment,
                    turnedOn,
                });
            },
        },
    },
};
</script>

<style></style>
