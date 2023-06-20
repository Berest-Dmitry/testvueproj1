<script setup>
    import {ref, reactive} from 'vue'
    //#region reactive fields
        var firstName = ref('');
        var lastName = ref('');
        var selectedRegion = ref('');
        var selectedGender = ref('');
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
                    <option>Ukraine</option>
                    <option>China</option>
                    <option>Turkey</option>
                </select>
            </div>
            <div class="col-6">
                <select class="select-input" v-model="selectedGender">
                    <option disabled>Please, select your gender</option>
                    <option>Male</option>
                    <option>Female</option>
                    <option>Chupacabra</option>
                </select>
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