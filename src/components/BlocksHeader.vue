<template>
    <th class="small-row">Vak</th>
    <th>SE Opdrachten</th>
    <th v-if="showResults" class="small-row">SE</th>
    <th v-if="showCE">Centraal Examen</th>
    <th v-if="showResults && showCE" class="small-row">CE</th>
    <th v-if="showResults" class="small-row">Eind.</th>
</template>

<script>
export default {
    name: 'BlocksHeader',
    props: {
        showResults: Boolean,
        showCE: Boolean,
    },
};
</script>

<style>
</style>
