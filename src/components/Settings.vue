<template>
    <div class="settings">
        <ToggleButton :values="modi" v-model="mode" style="font-weight: 700" />
        <hr />
        <Optionals />
        <hr />
        <Replacings />
        <hr class="left" />
        <Slider v-model="scale" :min="0.5" :max="1.5" :step="0.1" />
        <Checkbox @checkbox-change="setRound" />
    </div>
</template>

<script>
import ToggleButton from './ToggleButton.vue';
import Optionals from './Optionals.vue';
import Replacings from './Replacings.vue';
import Slider from './Slider.vue';
import Checkbox from './Checkbox.vue';
import { modi } from '../utils.js';
import { mapMutations } from 'vuex';

export default {
    name: 'Settings',
    components: {
        ToggleButton,
        Optionals,
        Replacings,
        Slider,
        Checkbox,
    },
    methods: mapMutations(['setRound']),
    computed: {
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
                this.$store.commit('setScale', value);
            },
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
