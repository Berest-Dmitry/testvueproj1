<script setup lang="ts">
    //#region imports
    import {ref, reactive, onMounted} from 'vue';
    import settings from '@/requestSettings.js';
    import type { Header, Item} from "vue3-easy-data-table";
    import { createConfirmDialog } from 'vuejs-confirm-dialog';
    import { notify } from "@kyvg/vue3-notification";
    //#endregion

    //#region fields
    const headers: Header[] = [
        { text: "#", value: "number" },
        { text: "Content", value: "name" },
        { text: "Completed", value: "isComplete" },
    ]
    const items = ref<Item[]>([]);
    const _userId = ref('');
    const _userName = ref('');
    const _pageHeader = ref('');
    const _users = ref<any[]>([]);
    //#endregion

    //#region lifecycle hooks/ events
        onMounted(async () => {
            await LoadUsers();
            _userId.value = localStorage.getItem("userId") ?? '';
            _userName.value = _users.value.find(u => u.id == _userId.value).username;
            localStorage.removeItem("userId");
            await ReloadTodos();
        });

        async function usersSelectChange(ev: Event){
            var selectEl = <HTMLSelectElement> ev?.currentTarget;
            _userId.value = selectEl.selectedOptions[0].getAttribute("item-id") ?? '';
            _userName.value = selectEl.selectedOptions[0].text;
            await ReloadTodos();

        }
    //#endregion

    //#region methods
    async function LoadUserTodos() {
        var url = settings.defaultSiteUrl + '/api/TodoItems/GetTodosOfUser?userId=' + _userId.value;
        var headers = {
        "Content-Type": "text/plain"
        }
        var callback = async (response: any) => {
            if(response && response.ok){
                var count = 0;
                var data = await response.json();
                if(data && data.result){
                    items.value = [];
                    data.entity.forEach((todo: any) => {
                        count++;
                        items.value.push({
                            id: todo.id,
                            number: count,
                            name: todo.name,
                            isComplete: todo.isComplete
                        });
                    });
                    notify({
                        type: "success",
                        title: "Todos loaded",
                        text: "Successfully loaded todo list from server"
                    });
                }
                else{
                    notify({
                         type: "error",
                         title: "Server error",
                         text: "An error occured while loading todos: " + data.errorInfo
                     });
                }
            }
            else{
                notify({
                    type: "error",
                    title: "Server error",
                    text: "An error occured while loading data: " + response.status
                });
            }
        }
        await settings.getMethodAsync(url, headers, callback);
    }

    async function LoadUsers(){
        var url = settings.defaultSiteUrl + '/api/UserDatas';
        var headers = {
        "Content-Type": "text/plain"
        }
        var callback = async (response: any) => {
            if(response && response.ok){
                var usersList = await response.json();
                if(usersList && usersList.result){
                    usersList.entity.forEach((user: any) => {
                        _users.value.push({
                            id: user.id,
                            username: user.firstName + " " + user.lastName
                        });
                        });
                    notify({
                        type: "success",
                        title: "Users loaded",
                        text: "Successfully loaded users list from server"
                    });
                }
                else{
                    notify({
                         type: "error",
                         title: "Server error",
                         text: "An error occured while loading user data: " + usersList.errorInfo
                     });
                }               
            }
            else{
                notify({
                    type: "error",
                    title: "Server error",
                    text: "An error occured while loading user data: " + response.status
                });
            }
        }
        await settings.getMethodAsync(url, headers, callback);
    }

    async function ReloadTodos(){
        if(_userId.value){
            await LoadUserTodos();
            _pageHeader.value = "Loaded todos for user: " + _userName.value;
        }
        else{
            _pageHeader.value = "Choose a user to display his/her todos!"
        }
    }

    async function AddTodo(){

    }

    async function RemoveTodo(){

    }
    //#endregion

</script>

<template>
    <div class="todos-main">
        <h1 class="page-header"> List of todos </h1>
        <h2>{{ _pageHeader }}</h2>
        <div class="row">
            <div class="row col-12">
                <div class="col-6">
                    <label for="usersSelect">List of all users</label>
                    <select id="usersSelect" v-model="_userName" @change="usersSelectChange($event)" >
                        <option v-for="user in _users" :key="user?.id" :item-id="user?.id">
                            {{ user?.username }}
                        </option>
                </select>
                </div>
                <div class="col-6 btn-row">
                    <button class="btn btn-info">Load todos</button>
                    <button class="btn btn-danger" disabled>Remove todo</button>
                    <button class="btn btn-success" disabled>Add todo</button>
                </div>
            </div>
            <div class="row table-container">
                <EasyDataTable
                :headers="headers"
                :items="items"    
                >
                    <template #item-number="item">
                        <span :item-id="item?.id">{{ item.number }}</span>
                    </template>
                    
                    <template #item-isComplete="item">
                        <span v-if="item.isComplete"><check-bold class="table-icon success-color"/></span>
                        <span v-else><close-thick class="table-icon danger-color"/></span>
                    </template>
                </EasyDataTable>
            </div>
        </div>
    </div>
</template>

<style scoped>
  .danger-color{
    color: #CC0000;
  }
  .success-color{
    color: #007E33;
  }

  .table-icon{
    transform: scale(1.5);
  }
</style>