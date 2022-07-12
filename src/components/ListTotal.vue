<template>
    <tr class="total-row" v-show="selectionType !== 'none'">
        <td colspan="7">
            <div class="list-summary">
                <span>
                    Aantal geselecteerd: <b>{{ 69 }}</b>
                </span>
                <span>
                    Totale weging: <b>{{ '69%' }}</b>
                </span>
                <span>
                    Gemiddeld cijfer: <b>{{ '6,9' }}</b>
                </span>
            </div>
        </td>
    </tr>
</template>

<script>
export default {
    name: 'ListTotal',
    props: {
        selectedAssignmentIDs: Array,
        selectionType: String,
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
