<template>
    <template :key="optional.id" v-for="optional in optionals">
        <Optional :assignment="optional" />
    </template>
</template>

<script>
import Optional from './Optional.vue';

export default {
    name: 'Optionals',
    components: {
        Optional,
    },
    computed: {
        optionals() {
            return this.$store.getters.allOptional;
        },
    },
};
</script>

<style></style>
