<template>
    <tr class="total-row" v-show="selectionType !== 'none'">
        <td colspan="7">
            <div class="list-summary">
                <span>
                    Aantal geselecteerd: <b>{{ selectedAssignments.length }}</b>
                </span>
                <span>
                    Som wegingen:
                    <b>{{ nl_num(sumWeights * 100, undefined, 4) + '%' }}</b>
                </span>
                <span>
                    Gemiddeld cijfer:
                    <b :title="nl_num(averageResult)">
                        {{ nl_num(averageResult, 1) }}
                    </b>
                </span>
            </div>
        </td>
    </tr>
</template>

<script>
import { nl_num, round } from '../utils.js';

export default {
    name: 'ListTotal',
    props: {
        selectedAssignments: Array,
        selectionType: String,
    },
    computed: {
        sumWeights() {
            let sum = 0;
            for (let assignment of this.selectedAssignments) {
                sum += this.$store.getters.totalWeight(assignment);
            }
            return sum;
        },
        averageResult() {
            let result_sum = 0;
            let weight_sum = 0;
            for (let assignment of this.selectedAssignments) {
                let result = this.$store.getters.result(assignment);
                console.log(result);
                if (result !== undefined) {
                    let weight = this.$store.getters.totalWeight(assignment);
                    result_sum += result * weight;
                    weight_sum += weight;
                }
            }
            if (weight_sum === 0) return;
            return result_sum / weight_sum;
        },
    },
    methods: {
        nl_num,
    },
};
</script>

<style>
.list-summary {
    display: flex;
    width: 100%;
    justify-content: space-around;
}
</style>
