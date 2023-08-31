<script setup lang="ts">
    import {ref} from 'vue';
    import settings from '@/requestSettings.js';
    import { notify } from "@kyvg/vue3-notification";
    import { closeModal, confirmModal} from '@kolirt/vue-modal';

    const props = defineProps({
        usersList: null,
        todoId: null
    })
    const _userId = ref('');
    //const _userSelected = ref<any>({});

    function userSelected(ev: Event){
        var selectEl = <HTMLSelectElement> ev?.currentTarget;
        _userId.value = selectEl.selectedOptions[0].getAttribute("item-id") ?? '';
    }

    async function BindUser(){
        if(!_userId.value){
            notify({
                    type: "info",
                    title: "Please, select user",
                    
            });
            return;
        }

        var url = settings.defaultSiteUrl + `/api/TodoItems/BindTodoAndUser?todoId=${props.todoId}&userId=${_userId.value}`;
        var headers = {
        "Content-Type": "text/plain"
        }
        var callback = async(response: any) => {
            if(!response || !response.ok){
                notify({
                    type: "error",
                    title: "Server error",
                    text: "An error occured while binding user and todo: " + response.status
                });
               closeModal();
            }
            else{
                var data = await response.json();
                if(data && data.result){
                    confirmModal();
                    notify({
                        type: 'success',
                        title: "User added",
                        text: "Successfully binded todo with user!"
                    });
                }
                else{
                    notify({
                        type: "error",
                        title: "Server error",
                        text: "An error occured while binding user and todo: " + data.errorInfo
                    });
                }
            }
        }
        await settings.postMethodAsync(url, headers, null, callback);
    }
</script>

<template>
    <SimpleModal title="Select user to bind with">
        <div class="row gap-2 d-flex select-user">
            <select id="usersSelect" @change="userSelected($event)">
                <option v-for="user in usersList" :key="user?.id" :item-id="user?.id">
                    {{ user?.username }}
                </option>
            </select>
        </div>
        <template #footer>
            <button @click="closeModal()" class="btn btn-danger">
                Close
            </button>
            <button @click="BindUser()" class="btn btn-success">
                Confirm
            </button>
        </template>
    </SimpleModal>
</template>

<style scoped>
    #usersSelect{
        font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
        font-style: italic;
        max-width: 250px;
    }
    .vue-modal-content{
        width: fit-content !important;
    }
    .select-user {
        display: flex !important;
        justify-content: center !important;
    }
</style>