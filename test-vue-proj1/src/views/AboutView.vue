
<template>
  <div class="row about" >
    <h1 style="display: block; height: 150px;">{{WelcomeMsg}}</h1>
    <div class="row">
      <div class="input-form col-6">
        <input type="text" class="user-input" placeholder="type something..." v-model="UserMsg">
        
      </div>
      <div class="col-6 row" style="margin-left: 10px;">
        <button type="button" @click="submit()" class="vue-button col-4"> Send </button>
        <button type="button" @click="SaveLastMessage()" class="vue-button col-4">Save Message</button>
        <button type="button" @click="ClearLastMessage()" class="vue-button col-4">Clear Message</button>
      </div>
    </div>
    <div class="row">
      <span class="vue-span" :class="colorClass" :title="ideasCount" @click="pickColor()">Your thoughts: {{LastMsg}}</span>
    </div>
    <div class="row mt-2 todo-container">
        <div class="col-8">
            <ul id="PlansList">
              <TodoItem
                v-for="item in todoItems"
                :todo="item"
                :key="item.id"
                @item-removed="onItemRemoved"
              >                
              </TodoItem>
            </ul>
        </div>
        <div class="col-4" style="display:flex; justify-content:flex-end;">
            <button id="loadbtn" style="max-height: 30px;" @click="LoadTodos">Load Items</button>
            <button id="addbtn" style="max-height: 30px;" @click="reveal">Add Item</button>
        </div>
    </div>
  </div>
</template>

<script setup>
  import {ref, reactive} from 'vue'
  import TodoItem from '/src/components/TodoItem.vue'
  import AddTodoItem from '/src/components/AddTodoItem.vue'
  import { createConfirmDialog } from 'vuejs-confirm-dialog'
  import settings from '/src/requestSettings.js'
    const WelcomeMsg = ref('Hello from test project!');
    const UserMsg = ref('');
    const LastMsg = ref('');
    const count = ref(0);
    const ideasCount = ref('');
    const colorClass = ref('');
    const colors = [
      "red",
      "green",
      "blue"
    ]
    const todoItems = ref([]);
    
    const { reveal, onConfirm, onCancel } = createConfirmDialog(AddTodoItem, { question: "Do you want to add todo?" })

    onConfirm(async () => {
      await LoadTodos(); 
    })

    onCancel(() => alert("The action was aborted"))

    function submit(){
      alert("You've written: " + UserMsg.value);
    }

    function SaveLastMessage(){
      LastMsg.value = UserMsg.value;
      UserMsg.value = '';
    }
    function ClearLastMessage(){
      if(LastMsg.value){
        LastMsg.value = '';
        count.value++;
        ideasCount.value = "Total ideas count is " + count.value;
      }
      
    }

    function pickColor(){
      let colorIndex = getRndInteger(0, 2);
      colorClass.value = colors[colorIndex];
    }
    function getRndInteger(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    //#region RequestMethods
    async function LoadTodos(){
      var url = settings.defaultSiteUrl + '/api/TodoItems';
      var headers = {
        "Content-Type": "text/plain"
      }
      var callback = async (response) =>{
        var data = await response.json();
        var count = 0;
        todoItems.value = [];
        data.entity.forEach(element => {
          count++;
          //todoItems.value.push(element);
          todoItems.value.push({
            id: element.id,
            name: element.name,
            isComplete: element.isComplete,
            number: count
          });
        });
      }
      await settings.getMethodAsync(url, headers, callback);

    }

    async function onItemRemoved(){
      await LoadTodos();
    }

    //#endregion
</script>


<style>
@media (min-width: 1024px) {
  .about {
    /*min-height: 100vh;*/
    display: flex;
    align-items: center;
  }
  .user-input{
    text-decoration: underline;
    font-size: 25px;
    font-style: italic;
  }
  .input-form{
    border: 1pt black solid;
    border-radius: 5px;
    background-color: bisque;
  }
  .vue-button{
    background-color: lightgreen;
    color: whitesmoke;
    border-color: white;
    border-radius: 3px;  
  }
  .vue-span{
    margin-top: 10px;
    margin-bottom: 10px;
    font-size: large;
    font-weight: 600;
    font-family: 'Times New Roman', Times, serif;
    background-color: cadetblue;
  }

  .todo-container{
    /*align-items: flex-end;*/
    padding: 5px;
    border: 2px solid black;
  }

  .red{
    color: red;
  }
  .green{
    color: green;
  }
  .blue{
    color: blue;
  }
}
</style>
