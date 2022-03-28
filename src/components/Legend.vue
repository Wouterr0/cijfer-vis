<template>
    <div class="heading">LEGENDA</div>
    <div
        :key="type"
        v-for="type in types"
        class="legend-item"
        :style="{ background: `var(--${type}-color)` }"
    >
        {{ type }}
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
    props: {},
    computed: mapGetters(['types']),
};
</script>

<style>
.heading {
    font-weight: 700;
    text-align: center;
}

.legend-item {
    margin: 0.1em 2em;
    padding: 0.1em 0.25em;
}
</style>
