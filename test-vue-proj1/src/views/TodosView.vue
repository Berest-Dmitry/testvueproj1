<script setup lang="ts">
    //#region imports
    import {ref, reactive, onMounted, computed} from 'vue';
    import settings from '@/requestSettings.js';
    import AddTodoItem from '@/components/AddTodoItem.vue';
    import type { Header, Item, ClickRowArgument } from "vue3-easy-data-table";
    import { createConfirmDialog } from 'vuejs-confirm-dialog';
    import { notify } from "@kyvg/vue3-notification";
    //#endregion

    //#region fields
    const headers: Header[] = [
        {text: "", value: "id"},
        { text: "#", value: "number" },
        { text: "Content", value: "name" },
        { text: "Completed", value: "isComplete" },
    ]
    const items = ref<Item[]>([]);
    const _userId = ref('');
    const _userName = ref('');
    const _pageHeader = ref('');
    const _users = ref<any[]>([]);
    const _selectedRow = ref({
        id: null,
        name: null,
        isComplete: null,
    });
    //const _selectedRows = ref<Item[]>([]);

    const _disabledBtn = computed(() => {
        return !_userName.value;
    });
    //#endregion

    const { reveal, onConfirm, onCancel } = createConfirmDialog(AddTodoItem, { question: "Do you want to add todo?", userId: _userId })


    //#region lifecycle hooks/ events
        onMounted(async () => {
            await LoadUsers();
            _userId.value = localStorage.getItem("userId") ?? '';
            if(_userId.value){
                _userName.value = _users.value.find(u => u.id == _userId.value).username;
                localStorage.removeItem("userId");
                await ReloadTodos();
            }

        });

        async function usersSelectChange(ev: Event){
            var selectEl = <HTMLSelectElement> ev?.currentTarget;
            _userId.value = selectEl.selectedOptions[0].getAttribute("item-id") ?? '';
            _userName.value = selectEl.selectedOptions[0].text;

            var radioBtns = document.querySelectorAll('input[type=radio]');
            radioBtns.forEach((el: any) => {el.checked = false});
            _selectedRow.value = {
                id: null,
                name: null,
                isComplete: null
            };
            await ReloadTodos();
        }

        onConfirm(async () => {
            await ReloadTodos();
        });

        onCancel(() => {
            notify({
                type: "info",
                title: "The action was aborted"
            });
        });

        const onRowClicked = (item : ClickRowArgument ) => {
            _selectedRow.value = {
                id: item.id,
                name: item.name,
                isComplete: item.isComplete
            };
            var radioBtns = document.querySelectorAll('input[type=radio]');
            radioBtns.forEach((el: any) => {el.checked = false});
            var currentBtn: HTMLInputElement = 
                document.querySelector(`input[id="${item.id}"]`) 
                ?? new HTMLInputElement;
            currentBtn.checked = true;
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
                items.value = [];
                if(data && data.result){
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

    async function RemoveTodo(){
        if(!_selectedRow.value || !_selectedRow.value?.id){
            notify({
                type: 'info',
                title: 'Please, select todo to remove...'
            });
        }
        else{
            var url = settings.defaultSiteUrl + `/api/TodoItems/RemoveUserTodo?userId=${_userId.value}&todoId=${_selectedRow.value?.id}`;
            var headers = {
            "Content-Type": "text/plain"
            }
            var callback = async (response: any) => {
                if(response && response.ok){
                    var data = await response.json();
                    if(data && data.result){
                        await ReloadTodos();
                        notify({
                            type: 'success',
                            title: 'successfully removed todo'
                        });
                    }
                    else{
                        notify({
                            type: "error",
                            title: "Server error",
                            text: "An error occured while removing todo: " + data.errorInfo
                        });
                    }
                }
                else{
                    notify({
                        type: "error",
                        title: "Server error",
                        text: "An error occured while removing todo: " + response.status
                    });
                }
            }
            await settings.deleteMethodAsync(url, headers, callback);
        }
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
                    <!-- <button class="btn btn-info">Load todos</button> -->
                    <button class="btn btn-danger" :disabled="_disabledBtn" @click="RemoveTodo()">Remove todo</button>
                    <button class="btn btn-success" :disabled="_disabledBtn" @click="reveal">Add todo</button>
                </div>
            </div>
            <div class="row table-container">
                <EasyDataTable
                :headers="headers"
                :items="items"
                alternating  
                @click-row="onRowClicked"             
                >
                    <template #item-id="item">
                        <input type="radio" :id="item?.id"/>
                    </template>

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

  .btn-row{
    display: flex;
    justify-content: flex-end;
    padding-left: 15px;
}
</style>