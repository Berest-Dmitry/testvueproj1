<script setup lang="ts">
    //#region imports
    import {ref, reactive, onMounted, computed} from 'vue';
    import settings from '@/requestSettings.js';
    import AddTodoItem from '@/components/AddTodoItem.vue';
    import SelectUserModal from '@/components/SelectUserModal.vue';
    import type { Header, Item, ClickRowArgument, BodyRowClassNameFunction } from "vue3-easy-data-table";
    import { createConfirmDialog } from 'vuejs-confirm-dialog';
    import { notify } from "@kyvg/vue3-notification";
    import {openModal} from '@kolirt/vue-modal';
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
    const _todoSearch = ref('');
    //const _selectedRows = ref<Item[]>([]);

    const _disabledBtn = computed(() => {
        return !_userName.value;
    });
    //#endregion

    const { reveal, onConfirm, onCancel } = createConfirmDialog(AddTodoItem, { question: "Do you want to add todo?", userId: _userId })

    async function ChooseUser(){
        if(!_selectedRow.value || !_selectedRow.value?.id ){
            notify({
                title: "Please, select todo",
                type: 'info'
            });
            return;
        }

        openModal(SelectUserModal, 
            {usersList: _users.value, todoId: _selectedRow.value?.id})
            .then(async (data: any) => await ReloadTodos())
            .catch((err) => {
                console.log('An error occured while binding user and todo:' + err);
             });
    }

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

        const onCellClicked = async (ev: any) => {
            if(!_userId.value){
                return;
            }

            var cellElem = <HTMLTableCellElement> ev?.currentTarget;
            if(cellElem.getElementsByClassName('check-bold-icon').length == 0){
                var currDataInput = <HTMLElement> cellElem?.parentElement
                ?.parentElement?.firstElementChild?.firstElementChild;
                var todoId = currDataInput.getAttribute('id');
                await CompleteTodo(todoId ?? '');  
            }
              
        }

        const onHideCompletedClicked = (ev: any) => {
            var table = document.getElementsByClassName('vue3-easy-data-table__main')[0]?.firstElementChild;
            var completedRows = table?.querySelectorAll('tr.completed-row');
            completedRows?.forEach((row: Element) => {
                var currRow = <HTMLElement> row;
                currRow.hidden = !ev.currentTarget?.parentElement?.querySelector('input').checked;
            })
        }
    //#endregion

    //#region methods
    const loadTodosCallback = async (response: any) => {
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

    async function LoadUserTodos() {
        var url = settings.defaultSiteUrl + '/api/TodoItems/GetTodosOfUser?userId=' + _userId.value;
        var headers = {
        "Content-Type": "text/plain"
        }
        var callback = loadTodosCallback;
        await settings.getMethodAsync(url, headers, callback);
    }

    async function LoadAllUnusedTodos(){
        var url = settings.defaultSiteUrl + '/api/TodoItems/GetUnusedTodoItems';
        var headers = {
        "Content-Type": "text/plain"
        }
        var callback = loadTodosCallback;
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
            await LoadAllUnusedTodos();
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

    async function CompleteTodo(todoId: string){
        var url = settings.defaultSiteUrl + `/api/TodoItems/CompleteTodo?todoId=${todoId}`;
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
                            title: 'successfully updated todo status'
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
            else {
                notify({
                    type: "error",
                    title: "Server error",
                    text: "An error occured while updating todo: " + response.status
                });
            }
        }
        await settings.postMethodAsync(url, headers,null, callback);
    }

    const bodyRowClassNameFunction: BodyRowClassNameFunction = (item: Item): string => {
        if(item?.isComplete)
            return 'completed-row'
        else
            return 'non-completed-row'
    }
    //#endregion

</script>

<template>
    <div class="todos-main">
        <h1 class="page-header"> List of todos </h1>
        <h2>{{ _pageHeader }}</h2>
        <div class="row">
            <div class="row mb-2">
                <p>List of all users</p>
                <select id="usersSelect" v-model="_userName" @change="usersSelectChange($event)" >
                        <option>Not selected</option>
                        <option v-for="user in _users" :key="user?.id" :item-id="user?.id">
                            {{ user?.username }}
                        </option>
                </select>
            </div>
            <div class="row col-12">
                <div class="row col-6">
                    <div class="input-group col-md-4 py-2" style="max-width: 65%;">
                          <input class="form-control input-group-prepend border-right-0 border" v-model="_todoSearch" type="search">
                          <span class="input-group-append">
                                <div class="input-group-text bg-transparent" style="height: 100%;"><magnify class="table-icon"/></div>
                        </span>
                    </div>
                    <div class="row col-4">
                        <span class="col-6"> Hide completed </span>
                        <div class="switch col-auto">
                            <input id="toggle-complete" type="checkbox" class="switch-input">
                            <label for="toggle-complete" class="switch-label" @click="onHideCompletedClicked($event)"></label>
                        </div>
                    </div>
                    
                </div>
                <div class="col-6 btn-row">
                    <!-- <button class="btn btn-info">Load todos</button> -->
                    <div v-if="_userId">
                        <button class="btn btn-danger" :disabled="_disabledBtn" @click="RemoveTodo()">Remove todo</button>
                        <button class="btn btn-success" :disabled="_disabledBtn" @click="reveal">Add todo</button>
                    </div>
                    <div v-else>
                        <button class="btn btn-info" @click="ChooseUser()">Bind todo</button>
                    </div>
                </div>
            </div>
            <div class="row table-container">
                <EasyDataTable
                :headers="headers"
                :items="items"
                alternating  
                @click-row="onRowClicked"
                :search-value="_todoSearch"
                :body-row-class-name="bodyRowClassNameFunction"             
                >
                    <template #item-id="item">
                        <input type="radio" :id="item?.id"/>
                    </template>

                    <template #item-number="item">
                        <span :item-id="item?.id">{{ item.number }}</span>
                    </template>
                    
                    <template #item-isComplete="item">
                        <div @click="onCellClicked($event)">
                            <span v-if="item.isComplete"><check-bold class="table-icon success-color"/></span>
                            <span v-else><close-thick class="table-icon danger-color"/></span>
                        </div>
                        
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
    max-height: 45px;
}

#usersSelect{
    max-width: 400px;
}



/* Switch Container */
.switch {
  position: relative;
  display: inline-block;
}

/* Hide the checkbox input (only needed for `:checked` property) */
.switch-input {
  display: none;
}

/* Switch */
.switch-label {
  display: block;
  width: 48px;
  height: 24px;
  text-indent: -150%;
  clip: rect(0 0 0 0);
  color: transparent;
  user-select: none;
  margin-top: 10px;
  
  /* Switch Rail & Knob */
  &:before,
  &:after {
    content: "";
    display: block;
    position: absolute;
    cursor: pointer;
  }
  
  /* Switch Rail */
  &:before {
    width: 48px;
    height: 24px;
    background-color: #dedede;
    border-radius: 9999em;
    transition: background-color 250ms ease;
  }
  
  /* Switch Knob */
  &:after {
    top: 10px;
    /* left: 0; */
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background-color: #fff;
    box-shadow: 0 0 2px rgba(0, 0, 0, 0.45);;
    transition: left 250ms ease;
  }
}

/* When input is checked */
.switch-input:checked + .switch-label {
  /* Switch Rail */
  &:before {
    background-color: #89c12d;
  }
  
  /* Switch Knob */
  &:after {
    left: 36px;
  }
}
</style>