<template>
    <input
        type="checkbox"
        :id="replaces.id + '-' + replacing.id"
        v-model="replacer"
    />
    <label :for="replaces.id + '-' + replacing.id">
        {{ replacing.shortname }}
    </label>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
    name: 'Replacing',
    props: {
        replaces: Object,
        replacing: Object,
    },
    computed: {
        ...mapGetters(['isReplacing']),
        replacer: {
            get() {
                return this.$store.getters.isReplacing(this.replacing, this.replaces);
            },
            set(turnedOn) {
                this.$store.commit('setReplacer', {
                    replaces: this.replaces,
                    replacing: this.replacing,
                    turnedOn,
                });
            },
        },
    },
};
</script>

<style></style>
