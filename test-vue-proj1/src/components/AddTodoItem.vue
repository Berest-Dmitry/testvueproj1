<script setup lang="ts">
import {ref, reactive} from 'vue'
 //import { defineProps, defineEmits } from 'vue'

    const props = defineProps({
        question: String
    });
    const emit = defineEmits(['confirm', 'cancel'])
    var todoText = ref('')

    async function CreateTodo(){
        var result_create = await fetch('https://localhost:7175/api/TodoItems/PostWithText?todo=' + todoText.value, {
            method: "POST",
            headers:{
                'Accept': 'text/plain',
                'Content-Type': 'text/plain'
            },
        });
        var res = await result_create.json();
        if(!res || !res.id){
            alert("An error occured while adding todo!");
            return;
        }
        emit('confirm');
    }
</script>

<template>
    <div class="modal-container">
        <div class="modal-container">
            <div class="modal-body">
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