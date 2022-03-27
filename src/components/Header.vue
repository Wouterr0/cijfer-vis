<template>
    <th class="small-row">VAK</th>
    <th>OPDRACHTEN</th>
    <th v-if="showResults" class="small-row">GEM.</th>
</template>

<script>
export default {
    name: 'Header',
    props: {
        showResults: Boolean,
    },
};
</script>

<style>
.small-row {
    width: 5%;
}
</style>
