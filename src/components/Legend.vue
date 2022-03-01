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
            return new Map(
                [...Object.entries(count_types(this.subjects))].sort(
                    (a, b) => b[1] - a[1]
                )
            ).keys();
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
