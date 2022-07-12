<template>
    <thead>
        <tr class="header-row">
            <th>
                <span
                    class="material-symbols-outlined clickable unselectable"
                    @click="batchSelect"
                >
                    {{ batchSelectionSymbol }}
                </span>
            </th>
            <th>Vak</th>
            <th>Soort</th>
            <th title="Leerjaar en periode">Periode</th>
            <th>Beschrijving</th>
            <th title="Weging eindcijfer">Weging</th>
            <th>Cijfer</th>
        </tr>
    </thead>
</template>

<script>
import { listSelectionTypes } from '../utils.js';

export default {
    name: 'ListHeader',
    props: {
        selectionType: String,
    },
    computed: {
        batchSelectionSymbol() {
            if (this.selectionType == listSelectionTypes.All) {
                return 'check_box';
            } else if (this.selectionType == listSelectionTypes.None) {
                return 'check_box_outline_blank';
            } else if (this.selectionType == listSelectionTypes.Some) {
                return 'indeterminate_check_box';
            }
        },
    },
    methods: {
        batchSelect() {
            if (this.selectionType == listSelectionTypes.All) {
                this.$emit('set-all-toggle', false);
            } else if (this.selectionType == listSelectionTypes.Some) {
                this.$emit('set-all-toggle', false);
            } else if (this.selectionType == listSelectionTypes.None) {
                this.$emit('set-all-toggle', true);
            }
        },
    },
};
</script>

<style></style>
