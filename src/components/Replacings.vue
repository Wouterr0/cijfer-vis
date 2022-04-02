<template>
    <Replacing
        :key="replacer.replaces.id + '-' + replacer.replacing.id"
        v-for="replacer in replacers"
        :replaces="replacer.replaces"
        :replacing="replacer.replacing"
    />
</template>

<script>
import Replacing from './Replacing.vue';
import { mapGetters } from 'vuex';

export default {
    name: 'Replacings',
    components: {
        Replacing,
    },
    computed: {
        replacers() {
            return this.$store.getters.allReplacing;
        },
    },
};
</script>

<style></style>
