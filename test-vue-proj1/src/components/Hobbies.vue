<script setup lang="ts">
    const props = defineProps({
        hobby: Object
    });
</script>

<template>
    <li class="hobby-item">
        <div class="row list-item">
            <span class="hobbyItem col-2"><i class="mdi mdi-check"></i>{{ hobby?.number }}</span>
            <span class="col-8">{{ hobby?.text }} </span>
        </div>
    </li>
</template>

<style>
.hobby-item{
    list-style-type: none;
    font-style: italic;
    border-style: dashed;
    margin: 2px;
    border-radius: 3px;
}
</style>