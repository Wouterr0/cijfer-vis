<template>
    <tr>
        <td colspan="2">
            <hr class="tot-sep" />
            <div style="display: flex">
                <div>Totaal:</div>
                <div class="stats">
                    <div :title="nl_num(min())">
                        <strong>min:</strong> {{ nl_num(min(true)) }}
                    </div>
                    <div :title="nl_num(max())">
                        <strong>max:</strong> {{ nl_num(max(true)) }}
                    </div>
                    <div :title="nl_num(median())">
                        <strong>mediaan:</strong> {{ nl_num(median(true)) }}
                    </div>
                </div>
            </div>
        </td>
        <td style="display: block">
            <hr class="tot-sep" />
            <div :title="nl_num(avg())">{{ nl_num(avg(true)) }}</div>
        </td>
    </tr>
</template>

<script>
import { mapGetters } from 'vuex';
import { nl_num } from '../utils.js';

export default {
    name: 'TotalRow',
    computed: mapGetters(['min', 'max', 'median', 'avg']),
    methods: { nl_num },
};
</script>

<style>
.tot-sep {
    border: 0;
    height: 0;
    margin: 0.25em 0;
    border-top: 0.07em dashed #aaa;
}

.stats {
    display: flex;
    justify-content: space-evenly;
    flex: 1;
}
</style>
