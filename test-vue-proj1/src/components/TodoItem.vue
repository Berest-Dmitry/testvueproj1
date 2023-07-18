<script setup lang="ts">
    const props = defineProps({
        todo: Object
    });
</script>

<template>
    <li class="todo-item">
        <div class="row list-item">
            <span class="hobbyItem col-2"><i class="mdi mdi-check"></i>{{ todo?.number }}</span>
            <span class="col-8">{{ todo?.text }} </span>
            <button class="col-2" id="removeTodo"><i class="mdi mdi-trash-can"></i></button>
        </div>
    </li>
</template>

<style>
.todo-item{
    list-style-type: none;
    font-style: bold;
    border-style: solid;
    margin: 2px;
    border-radius: 3px;
    border-width: 1px;
}
</style>