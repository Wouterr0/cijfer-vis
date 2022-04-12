<template>
    <tr>
        <td colspan="6">
            <hr class="tot-sep" />
        </td>
    </tr>
    <tr>
        <td colspan="2">
            <div style="display: flex">
                <div>Totaal:</div>
                <div class="stats">
                    <div :title="nl_num(min(), 1)">
                        <strong>min:</strong> {{ nl_num(min(true), 1) }}
                    </div>
                    <div :title="nl_num(max(), 1)">
                        <strong>max:</strong> {{ nl_num(max(true), 1) }}
                    </div>
                    <div :title="nl_num(median(), 1)">
                        <strong>mediaan:</strong> {{ nl_num(median(true), 1) }}
                    </div>
                </div>
            </div>
        </td>
        <td style="display: block">
            <div :title="nl_num(avg(), 1)">{{ nl_num(avg(true), 1) }}</div>
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
