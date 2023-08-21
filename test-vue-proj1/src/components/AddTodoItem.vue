<script setup lang="ts">
import {ref, reactive} from 'vue'
import settings from '@/requestSettings.js';
import { notify } from "@kyvg/vue3-notification";
 //import { defineProps, defineEmits } from 'vue'

    const props = defineProps({
        question: String,
        userId: String
    });
    const emit = defineEmits(['confirm', 'cancel'])
    var todoText = ref('')

    async function CreateTodo(){
      var url = settings.defaultSiteUrl + '/api/TodoItems/AddUserTodo?todo=' + todoText.value + '&userId=' + props.userId;
      var headers = {
        'Accept': 'text/plain',
        'Content-Type': 'text/plain'
      }
      var callback = async (response: any) => {
        var res = await response.json();
        if(!res || !res.result){
          notify({
            type: 'error',
            title: 'An error occurred while adding todo',
            text: 'An error occurred while adding todo' + res.errorInfo
          });
          return;
        }
        emit('confirm');
      }
      await settings.postMethodAsync(url, headers, null, callback);

    }
</script>

<template>
    <div class="modal-container">
        <div class="modal-container">
            <div class="modal-body" style="z-index: 2;">
              <span class="modal-close" @click="emit('cancel')">🗙</span>
              <h2>{{ question }}</h2>
              <div class="row">
                    <input type="text" id="todoTextInput" v-model="todoText" placeholder="what do you want to do?"/>
              </div>
              <div class="modal-action">
                <button class="modal-button" @click="CreateTodo">Confirm</button>
                <button class="modal-button" @click="emit('cancel')">Cancel</button>
              </div>
            </div>
          </div>
    </div>
</template>

<style>
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
</style>