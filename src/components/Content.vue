<template>
    <div class="content">
        <Overview />
        <Info :assignment="focussed" />
        <a class="import-btn" href="import.html">
            Importeer cijfers van magister
        </a>
    </div>
</template>

<script>
import Overview from './Overview.vue';
import Info from './Info.vue';
import { mapGetters } from 'vuex';

export default {
    name: 'Content',
    components: {
        Overview,
        Info,
    },
    computed: mapGetters(['focussed']),
};
</script>

<style>
.content {
    width: 100vw;
    box-sizing: border-box;
    padding: 1em;
    display: flex;
    flex-flow: row wrap;
    align-items: flex-start;
}

.import-btn {
    margin: 1em;
    padding: 0.5em 1em;
    background-color: white;
    /* color: black; */
    border-width: 0.03em;
    border-radius: 0.2em;
    border-style: solid;
    border-color: transparent;
    font-size: calc(var(--font-size) * 1);
    font-family: Verdana, Geneva, Tahoma, sans-serif;
    font-weight: 700;
}

.import-btn:hover {
    background-color: #0683ea;
    color: white;
    border-color: black;
}

.import-btn:active {
    outline: 0.1em solid black;
}
</style>
