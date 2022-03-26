<template>
    <input
        type="checkbox"
        v-model="checked"
        @change="$emit('checkboxChange', checked)"
    />
</template>

<script>
export default {
    name: 'Checkbox',
    data() {
        return {
            checked: false,
        };
    },
};
</script>
