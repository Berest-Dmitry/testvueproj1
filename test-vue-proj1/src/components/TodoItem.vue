<script setup lang="ts">
    const props = defineProps({
        todo: Object
    });
</script>

<template>
    <li class="todo-item">
        <div class="row list-item">
            <span class="hobbyItem col-2"><check-bold/>{{ todo?.id }}</span>
            <span class="col-8">{{ todo?.name }} </span>
            <button class="col-2" id="removeTodo"><trash-can class="trash-can-big" /></button>
        </div>
    </li>
</template>

<style>
.todo-item{
    list-style-type: none;
    font-weight: bold;
    border-style: solid;
    margin: 2px;
    border-radius: 3px;
    border-width: 1px;
    padding: 5px;
}

.list-item{
    display: flex;
    justify-content: space-evenly;

}

#removeTodo{
    border-radius: 50%;
    width: 50px;
    height: 50px;
    margin-right: 10px;
}
.trash-can-big{
    transform: scale(1.5);
}
</style>