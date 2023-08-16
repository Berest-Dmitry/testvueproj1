<script setup lang="ts">
    import {ref, reactive} from 'vue'
    import settings from '@/requestSettings.js';
    import {notify} from "@kyvg/vue3-notification";
    const emit = defineEmits(['confirm', 'cancel']);

    const props = defineProps({
        question: String,
        userId: String
    });

    async function DeleteUser(){
        var url = settings.defaultSiteUrl + '/api/UserDatas/' + props.userId;
        var headers = {
            'Accept': 'text/plain',
            'Content-Type': 'text/plain'
        };
        var callback = async (response: any) => {
            if(!response || !response.ok){
                notify({
                    type: "error",
                    title: "Server error",
                    text: "An error occured while removing user: " + response.status
                });
              return;
            }
            emit('confirm');
        }
        await settings.deleteMethodAsync(url, headers, callback);
    }
</script>

<template>
    <div class="modal-container">
        <div class="modal-container">
            <div class="modal-body remove-modal">
              <span class="modal-close" @click="emit('cancel')">🗙</span>
              <h2>{{ question }}</h2>
              
              <div class="modal-action">
                <button class="modal-button btn-danger" @click="DeleteUser">Delete</button>
                <button class="modal-button" @click="emit('cancel')">Abort action</button>
              </div>
            </div>
          </div>
    </div>
</template>

<style scoped>
 .modal-container {
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    width: 100%;
    height: 100%;
    background-color: #cececeb5;
  }
  .modal-body {
    background-color: #fff;
    border: 2px solid #74a2cf;
    border-radius: 10px;
    text-align: center;
    padding: 20px 40px;
    min-width: 250px;
    max-width: 500px;
    display: flex;
    flex-direction: column;
  }
  .modal-action {
    display: flex;
    flex-direction: row;
    gap: 40px;
    justify-content: center;
  }
  .modal-button {
    cursor: pointer;
    height: 30px;
    padding: 0 25px;
    border: 2px solid #74a2cf;
    border-radius: 5px;
    background-color: #80b2e4;
    color: #fff;
  }
  .modal-close {
    cursor: pointer;
    position: relative;
    align-self: end;
    right: -33px;
    top: -17px;
  }

  .btn-danger{
    background-color: #c01313 !important;
    border-color: black;
  }

  .remove-modal{
    z-index: 2;
  }
</style>