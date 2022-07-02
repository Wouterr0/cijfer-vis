<template>
    <div class="settings">
        <ToggleButton :values="modi" v-model="mode" style="font-weight: 700" />
        <hr />
        <Optionals />
        <hr />
        <Replacings />
        <hr />
        <input type="checkbox" id="show-ce" v-model="showCE" />
        <label for="show-ce" title="Toon centrale examens"
            >Centrale Examens</label
        >
        <hr class="left" />
        <template v-if="showResults">
            <input
                type="button"
                value="ALLE RESULTATEN WISSEN"
                @click="clearAll"
            />
            <input
                placeholder="Importeer resultaten"
                title="Plak hier je magister resultaten"
            />
            <a
                class="import-btn"
                href="import.html"
                title="Voor als je een beetje hulp nodig hebt bij het importeren van je magister cijfers"
            >
                help me
            </a>
            <hr />
        </template>

        <input
            type="range"
            v-model="scale"
            :min="0.7"
            :max="1.3"
            :step="0.05"
            list="tickmarks"
            title="Stel de grootte van de tabel in"
        />
        <datalist id="tickmarks">
            <option value="1.0"></option>
        </datalist>
        <input
            type="checkbox"
            v-model="round"
            title="Schakel tussen ronde en rechthoekige opdrachten"
        />
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
                return this.$store.state.settings.mode;
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
                return this.$store.state.settings.round;
            },
            set(value) {
                this.$store.commit('setRound', value);
            },
        },
        showCE: {
            get() {
                return this.$store.state.settings.showCE;
            },
            set(value) {
                this.$store.commit('setShowCE', value);
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
    padding: 8px;
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

.import-btn {
    margin: -0.3em;
    padding: 0.3em 0.5em;
    border-width: 0.03em;
    border-radius: 0.2em;
    border-style: solid;
    border-color: transparent;
    font-family: Verdana, Geneva, Tahoma, sans-serif;
    font-weight: 700;
}

.import-btn:hover {
    background-color: #0683ea;
    color: white;
    border-color: black;
}

.import-btn:active {
    outline: 0.15em solid black;
}

input[type='range'] {
    margin: 0;
}
</style>
