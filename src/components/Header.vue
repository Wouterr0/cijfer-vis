<template>
    <th class="small-row">VAK</th>
    <th>SE OPDRACHTEN</th>
    <th v-if="showResults" class="small-row">SE</th>
    <th v-if="showCE">Centraal Examen</th>
    <th v-if="showResults && showCE" class="small-row">CE</th>
    <th v-if="showResults" class="small-row">Eind.</th>
</template>

<script>
export default {
    name: 'Header',
    props: {
        showResults: Boolean,
        showCE: Boolean,
    },
};
</script>

<style>
.small-row {
    width: 5%;
}
</style>
