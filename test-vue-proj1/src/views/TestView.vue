<script setup>
    import {ref, reactive, onMounted} from 'vue'
    import VueDatePicker from '@vuepic/vue-datepicker';
    import '@vuepic/vue-datepicker/dist/main.css';
    import HobbyItem from '/src/components/Hobbies.vue';
    import settings from '/src/requestSettings.js';
   
    //#region reactive fields
        var firstName = ref('');
        var lastName = ref('');
        var selectedRegion = ref('');
        var selectedGender = ref('');
        var dateOfBirth = ref();
    //#endregion

    //#region props
    const format = (date) => {
        var day = date.getDate();
        var month = date.getMonth() + 1;
        var year = date.getFullYear();

        return `${day}.${month}.${year}`;
    }
    var hobbiesList = ref([
        {id: 0, number: 1, text: "Swimming"},
        {id: 1, number: 2, text: "Skateboarding"},
        {id: 2, number: 3, text: "Singing"}
    ])
     //#endregion

    //#region methods
    async function SaveUserData(){
        var userData = {
            firstName: firstName.value,
            lastName: lastName.value,
            region: selectedRegion.value,
            gender: selectedGender.value,
            dateOfBirth: dateOfBirth.value
        };

        var body = JSON.stringify(userData);
        var url = settings.defaultSiteUrl + '/api/UserDatas';
        var headers = {
            "Content-Type": "application/json;charset:utf-8;"
        }
        var callbackMethod = async (response) => {
            if(!response || !response.ok){
                alert("An error occured while updating user entry!");
            }
            var data = await response.json();
        }
        await settings.postMethodAsync(url, headers, body, callbackMethod);
        
    }
    //#endregion

    //#region lifecycle hooks
    onMounted(async () => {
        var url = settings.defaultSiteUrl + '/api/UserDatas/GetExistingUser';
        var headers = {
            "Content-Type": "text/plain"
        }
        var callbackMethod = async (response) => {
            if(response && response.ok){
                var data = await response.json()
                if(data){
                firstName.value = data.firstName;
                lastName.value = data.lastName;
                selectedRegion.value = data.region;
                selectedGender.value = data.gender;
                dateOfBirth.value = data.dateOfBirth;
                }
            }
            else{
                alert("An error occured while loading user data: " + response.status);
            }
        }
        await settings.getMethodAsync(url, headers, callbackMethod);       
       
    });
    //#endregion
</script>

<template>
    <div class="account-form">
        <div class="row">
            <h1 class="account-header">Your private data:</h1>
        </div>
        <div class="row">
            <div class="col-6">
                <label for="firstname">Your firstname:</label>
                <input id="firstname" class="account-input " placeholder=" enter firstname..." v-model="firstName"/>
                
            </div>
            <div class="col-6">
                <label for="lastname">Your lastname:</label>
                <input id="lastname" class="account-input" placeholder=" enter lastname..." v-model="lastName"/>              
            </div>
        </div>
        <div class="row mt-4">
            <div class="col-6">
                <select class="select-input" v-model="selectedRegion">
                    <option disabled>Please, select your region</option>
                    <option>Russia</option>
                    <option>Belarus</option>
                    <option>Kazakhstan</option>
                    <option>China</option>
                    <option>Turkey</option>
                </select>
            </div>
            <div class="col-6">
                <select class="select-input" v-model="selectedGender">
                    <option disabled>Please, select your gender</option>
                    <option>Male</option>
                    <option>Female</option>                  
                </select>
            </div>
        </div>
        <div class="row">
            <div class=" col-6 mt-4">
                <Label for="BirthDate"> Birth date:</Label>
                <VueDatePicker id="BirthDate" v-model="dateOfBirth" :format="format"></VueDatePicker>
                <button id="SaveData" @click="SaveUserData()" class="mt-3">Send data to server</button>
            </div>
            <div class=" col-6 mt-4">
                <label for="hobbies-list" style="text-decoration:underline;"> My interests: </label>
                <ul id="hobbies-list">
                    <HobbyItem
                        v-for="item in hobbiesList"
                        :hobby="item"
                        :key="item.id"
                    >
                    </HobbyItem>
                </ul>
                
            </div>
        </div>
        
    </div>
</template>

<style>
    .account-form{
        border-radius: 10px;
        background-color: blanchedalmond;
        font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
        border-width: 3pt;
        padding-left: 15px;
        padding-right: 15px;
    }
    .account-header{
        text-align: center;
        text-decoration: underline;
    }
    .account-input{
        font-size: 12px;
        font-style: normal;
        margin-left: 5px;

    }
    .select-input{
        font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
        font-style: italic;
    }

</style>