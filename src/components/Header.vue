<template>
    <th class="small-row">VAK</th>
    <th>SE OPDRACHTEN</th>
    <th v-if="showResults" class="small-row">SE</th>
    <th>CE OPDRACHTEN</th>
    <th v-if="showResults" class="small-row">CE</th>
    <th v-if="showResults" class="small-row">Eind.</th>
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
