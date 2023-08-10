<script setup>
    //#region imports
    import {ref, reactive, onMounted} from 'vue';
    import settings from '/src/requestSettings.js';
    import { createConfirmDialog } from 'vuejs-confirm-dialog';
    import RemoveUser from '/src/components/RemoveUser.vue'
    import AmhVueTable from "am_table_vue";
    // import css
    import "am_table_vue/dist/style.css";
    //#endregion

    //#region reactive fields
    const state = reactive({
         data: [
          
         ],
         columns: [
            {
                title: "id",
                field: "id",
                EnableFilter: false,
                sortable: false,
                hidden: true,
                Cssclass: "user-id-span"
            },
            {
                title: "#",
                field: "number",
                EnableFilter: false,
                sortable: false,
            },
            {
                title: "First name",
                field: "firstName",
                EnableFilter: false,
                sortable: true,
            },
            {
                title: "Last name",
                field: "lastName",
                EnableFilter: false,
                sortable: true,
            },
            {
                title: "Gender",
                field: "gender",
                EnableFilter: false,
                sortable: false,
            },
            {
                title: "Country",
                field: "region",
                EnableFilter: false,
                sortable: true,
            },
            {
                 title: "Remove",
                 isHtml: true,
                 EnableFilter: false,
            },
        ],
         config: {
           EnableSearch: true,
           searchplaceholder: "Search in Table",
           EnableUseDarkMode: true,
           EnableCardsTemp: true,
           SearchInFields: ["name", "age", "date"],
           EnablePagination: true,
           PaginationConfig: {
             itemsPerPage: 20,
             CurrentPage: 2,
           },
         },
   });
    //#endregion

    //#region fields
    const _userId = ref('');
    //#endregion

    //#region lifecycle hooks
    onMounted(async () => {await loadUsers();})
    //#endregion

    //#region methods
    function addUser(){

    }

    function ConfirmRemoveUser(ev){
        var btn = ev.currentTarget.parentNode;
        var row = btn.closest('tr');
        _userId.value = row.querySelector('.user-id-span').textContent;
        reveal();
    }

    async function loadUsers(){
        var url = settings.defaultSiteUrl + '/api/UserDatas';
        var headers = {
        "Content-Type": "text/plain"
        }
        var callback = async (response) => {
            if(response && response.ok){
                state.data = [];
                var data = await response.json();
                var count = 0;
                data.forEach(user => {
                    count++;
                    state.data.push({
                        id: user.id,
                        number: count,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        gender: user.gender,
                        region: user.region
                    });
                });
                var nextBtn = document.querySelectorAll('[rel="next"]');
                nextBtn[0].click();
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

    onConfirm(async () => {
        await loadUsers();
    });

    onCancel(() => alert("The action was aborted"));
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
                <AmhVueTable
                      :data="state.data"
                      :columns="state.columns"
                      :config="state.config"
                >
                <template v-slot="{ column, row }">
                    <div v-if="column.title == 'Remove'">
                      <button @click="ConfirmRemoveUser" class="remove-btn"><trash-can class="trash-can-big" /></button>
                    </div>
                </template>
                </AmhVueTable>
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