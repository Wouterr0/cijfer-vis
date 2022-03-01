<template>
    <div class="settings">
        <ToggleButton
            default="RESULTATEN"
            other="PLANNEN"
            :style="{ 'font-weight': 700 }"
        />
        <hr />
        <Optionals />
        <hr />
        <Replacings />
        <hr class="left" />
        <Slider :value="this.scale" :min="0.5" :max="1.5" :step="0.1" />
        <Checkbox />
    </div>
</template>

<script>
import ToggleButton from './ToggleButton.vue';
import Optionals from './Optionals.vue';
import Replacings from './Replacings.vue';
import Slider from './Slider.vue';
import Checkbox from './Checkbox.vue';

export default {
    name: 'Settings',
    components: {
        ToggleButton,
        Optionals,
        Replacings,
        Slider,
        Checkbox,
    },
    props: {
        optional: Array,
        replacing: Array,
        round: Boolean,
        scale: Number,
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
