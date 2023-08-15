<script setup lang="ts">
    //#region imports
    import {ref, reactive, onMounted} from 'vue';
    import settings from '/src/requestSettings.js';
    import {openModal} from '@kolirt/vue-modal';
    import { createConfirmDialog } from 'vuejs-confirm-dialog';
    import RemoveUser from '/src/components/RemoveUser.vue';
    import AddUserModal from '@/components/AddUserModal.vue';
    import type { Header, Item} from "vue3-easy-data-table";
    //#endregion

    //#region reactive fields
    const _saveRes = ref(false);
    //#endregion

    //#region fields
    const headers: Header[] = [
        { text: "#", value: "number" },
        { text: "First name", value: "firstName"},
        { text: "Last name", value: "lastName"},
        { text: "Gender", value: "gender"},
        { text: "Country", value: "region"},
        {text: "Remove", value: "id"}        
    ];
    const items = ref<Item[]>([]);
    const _userId = ref('');
    //#endregion

    //#region lifecycle hooks
    onMounted(async () => {await loadUsers();})
    //#endregion

    //#region methods
    async function addUser(){
        openModal(AddUserModal, {additionalInfo: null})
        .then(async (data) => {
            await loadUsers();
        })
        .catch((err) => {
            console.log('An error occured while creating user entry:' + err);
        });
    }

    function ConfirmRemoveUser(ev: any){
        var btn = ev.currentTarget.parentNode;
        var row = btn.closest('tr');
        // _userId.value = row.querySelector('.user-id-span').textContent;
        _userId.value = row.firstElementChild.firstElementChild.getAttribute('item-id')
        reveal();
    }

    async function loadUsers(){
        var url = settings.defaultSiteUrl + '/api/UserDatas';
        var headers = {
        "Content-Type": "text/plain"
        }
        var callback = async (response: any) => {
            if(response && response.ok){
                var count = 0;
                var data = await response.json();
                items.value = [];
                data.forEach((user: any) => {
                    count++;
                    items.value.push({
                        id: user.id,
                        number: count,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        gender: user.gender,
                        region: user.region
                    })
                });
            }
            else{
                alert("An error occured while loading user data: " + response.status);
            }
        }
        await settings.getMethodAsync(url, headers, callback);
    }
    //#endregion
    const { reveal, onConfirm, onCancel } = createConfirmDialog(RemoveUser, 
    { 
        question: "Are you sure you want to delete this user?",
        userId: _userId
    })

    //#region event listeners
    onConfirm(async () => {
        await loadUsers();
    });

    onCancel(() => alert("The action was aborted"));

    async function onPostFail(){
        console.log('An error occured while adding a user!');
    }
    //#endregion
</script>

<template>
    <div class="users-main">
        <h1 class="page-header">Users of the portal</h1>
        <div class="row">
            <div>
                <button @click="loadUsers()" class="col-2 mr-2">Load Users</button>
                <button @click="addUser()" class="col-2">Add User</button>
            </div>
            <div class="row table-container">
                <EasyDataTable              
                    :headers="headers"
                    :items="items"
                    >
                    <template #item-number="item">
                        <span :item-id="item?.id">{{ item.number }}</span>
                    </template>
                    <template #item-id="item">
                        <div>
                            <button @click="ConfirmRemoveUser" class="remove-btn"><trash-can class="trash-can-big" /></button>
                        </div>
                    </template>
                </EasyDataTable>
            </div>
        </div>
    </div>
</template>

<style scoped>
 #usersTable {
    /* we can implement some CSS for this "Vue Latest Table" here */
    margin: 0 auto;
    margin-top: 30px;

    .searchBox {
      color: #333 !important;
    }
}
.trash-can-big{
    transform: scale(1.5);
}
.remove-btn{
    border-radius: 50%;
    background-color: brown;
    color: white;
}
</style>