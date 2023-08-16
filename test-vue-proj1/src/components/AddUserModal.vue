<script setup lang="ts">
    import {ModalTarget, closeModal, confirmModal} from '@kolirt/vue-modal';
    import {ref, reactive} from 'vue';
    import VueDatePicker from '@vuepic/vue-datepicker';
    import { notify } from "@kyvg/vue3-notification";
    import '@vuepic/vue-datepicker/dist/main.css';
    import settings from '/src/requestSettings.js';
    const props = defineProps({
        additionalInfo: null
    });

    //const emit = defineEmits(['postSuccess', 'postFail']);

    var userInfo = reactive({
        firstName: null,
        lastName: null,
        region: null,
        gender: null,
        dateOfBirth: null
    });

    async function SendRequestSaveUser(){
        var url = settings.defaultSiteUrl + '/api/UserDatas';
        var headers = {
            "Content-Type": "application/json;charset:utf-8;"
        }
        var body = JSON.stringify(userInfo);
        var callback = async (response: any) => {
            if(!response || !response.ok){
                notify({
                    type: "error",
                    title: "Server error",
                    text: "An error occured while posting user data: " + response.status
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
                        text: "Successfully added new user!"
                    });
                }
                else{
                    notify({
                        type: "error",
                        title: "Server error",
                        text: "An error occured while posting user data: " + data.errorInfo
                    });
                }
            }
        }
        await settings.postMethodAsync(url, headers, body, callback);
    }
</script>

<template>
    <SimpleModal title="Create User">
        <div class="row gap-2 d-flex">
            <div class="row col-12">
                <div class="col-6">
                    <label for="firstName">First Name</label>
                    <input id="firstName" type="text" v-model="userInfo.firstName" placeholder="..."/>
                </div>
                <div class="col-6">
                    <label for="lastName">Last Name</label>
                    <input id="lastName" type="text" v-model="userInfo.lastName" placeholder="..."/>
                </div>
            </div>
            <div class="row col-12">
                <div class="col-4">
                    <label for="region">Country</label>
                    <select id="region" class="select-input" v-model="userInfo.region">
                        <option disabled>Please, select your region</option>
                        <option>Russia</option>
                        <option>Belarus</option>
                        <option>Kazakhstan</option>
                        <option>China</option>
                        <option>Turkey</option>
                    </select>
                </div>
                <div class="col-3 ml-2">
                    <label for="gender">Gender</label>
                    <select id="gender" class="select-input" v-model="userInfo.gender">
                        <option disabled>Please, select your gender</option>
                        <option>Male</option>
                        <option>Female</option>                  
                    </select>
                </div>
                <div class="col-4 birthday-block">
                    <label for="dateOfBirth">Birth date</label>
                    <VueDatePicker id="dateOfBirth" v-model="userInfo.dateOfBirth">
                    </VueDatePicker>
                </div>
            </div>
        </div>
        <template #footer>
            <button @click="closeModal()" class="btn btn-danger">
                Close
            </button>
            <button @click="SendRequestSaveUser()" class="btn btn-success">
                Confirm
            </button>
        </template>
    </SimpleModal>
</template>

<style scoped>
    .select-input{
        font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
        font-style: italic;
        max-width: 150px;
    }
    .birthday-block{
        margin-left: 30px;
        align-self: flex-end;
    }
</style>