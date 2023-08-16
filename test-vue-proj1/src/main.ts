import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap"
import VueDatePicker from '@vuepic/vue-datepicker';
import * as ConfirmDialog from 'vuejs-confirm-dialog';
import '@vuepic/vue-datepicker/dist/main.css';
//import 'material-design-icons-iconfont/dist/material-design-icons.css'
import 'vue-material-design-icons/styles.css';
import Vue3EasyDataTable from 'vue3-easy-data-table';
import 'vue3-easy-data-table/dist/style.css';
import {createModal} from '@kolirt/vue-modal';
import Notifications from '@kyvg/vue3-notification';

import TrashCanIcon from 'vue-material-design-icons/TrashCan.vue';
import CheckBoldIcon from 'vue-material-design-icons/CheckBold.vue';


const app = createApp(App)

app.use(router)
app.use(ConfirmDialog)
app.use(createModal({
    transitionTime: 250,
    animationType: 'slideUp',
    modalStyle: {
        padding: '2rem 1rem'
    },
    overlayStyle: {
        'background-color': 'rgba(0,0,0,.3)'
    }
}))
app.use(Notifications)

app.component('VueDatePicker', VueDatePicker);
app.component('trash-can', TrashCanIcon);
app.component('check-bold', CheckBoldIcon);
app.component('EasyDataTable', Vue3EasyDataTable);

app.mount('#app')
