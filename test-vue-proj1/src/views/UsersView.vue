<script setup lang="ts">
    //#region imports
    import {ref, reactive, onMounted} from 'vue';
    import settings from '@/requestSettings.js';
    import utilityFunctions from '@/utils.js';
    import {openModal} from '@kolirt/vue-modal';
    import { createConfirmDialog } from 'vuejs-confirm-dialog';
    import { notify } from "@kyvg/vue3-notification";
    import RemoveUser from '@/components/RemoveUser.vue';
    import AddUserModal from '@/components/AddUserModal.vue';
    import type { Header, Item} from "vue3-easy-data-table";
    import { useRouter } from 'vue-router';
    //#endregion

    //#region reactive fields
    const items = ref<Item[]>([]);
    const _userId = ref('');
    const _userSearch = ref('');
    const _searchField = ref('');
    //#endregion

    //#region fields
    const headers: Header[] = [
        { text: "#", value: "number" },
        { text: "First name", value: "firstName"},
        { text: "Last name", value: "lastName"},
        { text: "Gender", value: "gender"},
        { text: "Country", value: "region"},
        { text: "Birth date", value: "dateOfBirth"},
        {text: "Remove", value: "id"} ,
        {text: "Link", value: "linkId"}       
    ];

    const searchFields: string[] = ['firstName', 'lastName', 'region']

    const router = useRouter();
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
                if(data && data.result){
                    items.value = [];
                    data.entity.forEach((user: any) => {
                        count++;
                        items.value.push({
                            id: user.id,
                            linkId: user.id,
                            number: count,
                            firstName: user.firstName,
                            lastName: user.lastName,
                            gender: user.gender,
                            region: user.region,
                            dateOfBirth: utilityFunctions.convertToDate(user.dateOfBirth)
                        })
                    });
                    notify({
                        type: "success",
                        title: "Users loaded",
                        text: "Successfully loaded users list from server"
                    });
                }
                else {
                     notify({
                         type: "error",
                         title: "Server error",
                         text: "An error occured while loading user data: " + data.errorInfo
                     });
                }
            }
            else{
                // alert("An error occured while loading user data: " + response.status);
                notify({
                    type: "error",
                    title: "Server error",
                    text: "An error occured while loading user data: " + response.status
                });
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

    onCancel(() => notify("The action was aborted"));

    function onLinkClicked(userId: any){
        localStorage.setItem("userId", userId);
        router.push({path: '/todos'});
    }
    //#endregion
</script>

<template>
    <div class="users-main">
        <h1 class="page-header">Users of the portal</h1>
        <div class="row">
            <div class="row my-2">
                <div class="col-8 row search-row">
                    <div class="input-group py-2" style="max-width: 50%;">
                          <input class="form-control input-group-prepend border-right-0 border" v-model="_userSearch" type="search">
                          <span class="input-group-append">
                                <div class="input-group-text bg-transparent" style="height: 100%;"><magnify class="table-icon"/></div>
                            </span>
                    </div>
                    <div class="row col-6">
                        <span class="col-auto">Search by: </span>
                        <select class="form-select col-6" style="max-width: 50%;" v-model="_searchField">
                            <option v-for="field in searchFields">{{ field }}</option>
                        </select>
                    </div>
                </div>
                <div class="btn-row col-4">
                    <button @click="loadUsers()" class="col-5 btn btn-info" style="margin-right: 10px;">Load Users</button>
                    <button @click="addUser()" class="col-5 btn btn-success">Add User</button>
                </div>
            </div>
            
            <div class="row table-container">
                <EasyDataTable              
                    :headers="headers"
                    :items="items"
                    alternating
                    :search-value="_userSearch"
                    :search-field="_searchField"
                    >
                    <template #item-number="item">
                        <span :item-id="item?.id">{{ item.number }}</span>
                    </template>
                    <template #item-id="item">
                        <div>
                            <button @click="ConfirmRemoveUser" class="remove-btn"><trash-can class="table-icon" /></button>
                        </div>
                    </template>
                    <template #item-linkId="item">
                            <span ><redirect-link class="table-icon link-color" @click="onLinkClicked(item?.id)"/></span>
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
.table-icon{
    transform: scale(1.5);
}
.remove-btn{
    border-radius: 50%;
    background-color: brown;
    color: white;
}
.btn-row{
    display: flex;
    justify-content: flex-end;
    padding-right: 25px;
    max-height: 45px;
}

.search-row{
    align-items: center;
}

.link-color{
    color: #0099CC;
}
</style>