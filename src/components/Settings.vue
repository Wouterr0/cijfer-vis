<template>
    <div class="settings">
        <ToggleButton :values="modi" v-model="mode" style="font-weight: 700" />
        <input
            type="button"
            v-if="showResults"
            value="ALLE RESULTATEN WISSEN"
            @click="clearAll"
        />
        <hr />
        <Optionals />
        <hr />
        <Replacings />
        <hr class="left" />
        <input type="range" v-model="scale" :min="0.5" :max="1.5" :step="0.1" />
        <input type="checkbox" v-model="round" />
    </div>
</template>

<script>
import ToggleButton from './ToggleButton.vue';
import Optionals from './Optionals.vue';
import Replacings from './Replacings.vue';
import { modi } from '../utils.js';
import { mapGetters, mapMutations } from 'vuex';

export default {
    name: 'Settings',
    components: {
        ToggleButton,
        Optionals,
        Replacings,
    },
    computed: {
        ...mapGetters(['showResults']),
        mode: {
            get() {
                return this.$store.state.mode;
            },
            set(value) {
                this.$store.commit('setMode', value);
            },
        },
        scale: {
            get() {
                return this.$store.state.settings.scale;
            },
            set(value) {
                this.$store.commit('setScale', Number(value));
            },
        },
        round: {
            get() {
                console.log('got round', this.$store.state.settings.round);
                return this.$store.state.settings.round;
            },
            set(value) {
                console.log('set round', value);
                this.$store.commit('setRound', value);
            },
        },
    },
    methods: {
        ...mapMutations(['setRound']),
        clearAll() {
            if (confirm('Weet je zeker dat je alle resultaten wilt wissen?')) {
                this.$store.commit('clearAll');
            }
        },
    },
    created() {
        this.modi = modi;
    },
};
</script>

<style>
.settings {
    display: flex;
    margin: 0 0 1em 0;
    gap: 0.5em;
    margin-top: auto;
    font-size: calc(var(--font-size) / 2);
}

.settings hr {
    margin: 0;
    align-self: normal;
}

.settings * {
    align-self: center;
}

.settings .left {
    margin: 0 0 0 auto;
}
</style>
