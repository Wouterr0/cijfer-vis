<template>
    <div class="heading">LEGENDA</div>
    <div
        :key="type"
        v-for="type in assigmentTypes"
        class="legend-item"
        :style="{ background: `var(--${type}-color)` }"
    >
        {{ type }}
    </div>
</template>

<script>
import { count_types } from '../utils.js';

export default {
    props: {
        subjects: Array,
    },
    computed: {
        assigmentTypes() {
            let s = count_types(this.subjects);
            let t = new Map([...Object.entries(s)].sort((a, b) => b[1] - a[1]));
            console.log(s, t);
            return Object.keys(s);
        },
    },
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
