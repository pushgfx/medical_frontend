<template  >

    <div>
      <template v-for="profile in patients">
        <div class="patientBlock" v-if="profile" style="display:inline-block; padding-top:30px;">
          <div class="col">
            <img class="profile-icon" src="https://image.flaticon.com/icons/svg/1077/1077012.svg" alt="">
          </div>
          <div class="col">
             <div class="patient-name">{{ profile.firstName }}  <span>{{ profile.middleInit }}</span> <span>{{ profile.lastName }}</span></div>
              <div class="col">
              <div class="text"><p ><p class="align-left">MRN: </p><p class="align-right"> {{profile.patientId}}</p></div>
              <div style="clear:both;"></div>
              <div class="text"><p class="align-left">Phone: </p><p class="align-right">{{ profile.phone }}</p></div>
              <div style="clear:both;"></div>
          </div>
          <div class="col">
              <div class="text"><p class="align-left">DOB </p><p class="align-right">{{ profile.dob }}</p></div>
              <div style="clear:both;"></div>
              <div class="text"><p class="align-left">Gender: </p><p class="align-right">{{ profile.gender }}</p></div>
              <div style="clear:both;"></div>
              <div class="text"><p class="align-left">Race: </p><p class="align-right">{{ profile.race }}</p></div>
              <div style="clear:both;"></div>
              <div class="text"><p class="align-left">Address: </p><p class="align-right">{{profile.street}}, {{profile.city}}</p></div>
              <div style="clear:both;"></div>
              <div class="text"><p class="align-left"> </p><p class="align-right">{{profile.state}} {{profile.zipcode}}</p></div>
              <div style="clear:both;"></div>
              <div class="editPatient"><a href="#" v-on:click="patient(profile.patientId)">Edit Patient</a></div>
          </div>
          </div>
      </div>
      </template>

    </div>
</template>
<script>

import { mapState, mapActions } from 'vuex'
import Vue from "vue";
export default {

   name: 'AdminPatient',
   created () {
      this.loadAdminPatients()
   },
   computed: {
     ...mapState('admin', {
       patients: state => state.patients
     })
   },
   methods: {
     ...mapActions('admin', [
       'loadAdminPatients',
       'editPatient'
     ]),
    ...mapActions('profile', [
      'reloadPatient'
    ]),
    patient(value) {
      const res = this.reloadPatient(value)
    }
   
   }
}
</script>
<style media="screen">

.editPatient {
  font-size: 15px;
  font-weight: 600;
  text-align: center;
  float: left;
  background-color: #00c7db;
  color: white;
  transition: 0.3s;
  opacity: 0.7;
  padding: 7px 15px;
  border-radius: 25px;
}

.editPatient:hover {
background-color: #00c7db;
opacity: 1
}

.patientBlock {
  margin-left: 170px;
}

.patient-name{
  font-weight: bold;
  font-size: 20px;
  margin-left: 40%;
}
.text{
  display:block;
  margin-left:25px;
  margin-right:25px;
  font-size:14px;
}
.align-left{
  float:left;
  padding:0 30px;
  color: #063d77;

  }
.align-right{
  float:right;
  color:#898790;
  padding:0 30px;
}
.profile-icon{
  padding:10px;
  background-color: #cbe4ec;
  width:190px;
  border-radius: 5px;
  border-color:#81d4f7;
}

/* TABS*/
.tabs-component-tabs {
  border-radius: 25px;
}
.tabs-component-tab {
  color: #999;
  font-size: 13px;
  font-weight: 600;
  margin-right: 0;
  list-style: none;
  border-radius:25px;
  border: 2px;
}
.tabs-component-tab.is-active {
  border: 2px #00c7db;
  transition-duration: 0.4s;
  background-color: #00c7db;
  color:#fff;
  /*z-index: 2;*/
  /*transform: translateY(0);*/
}
  .tabs-component-tab-a {
  align-items: center;
  color: inherit;
  display: flex;
  padding: 0.4em 1.5em;
  text-decoration: none;
    border-radius:25px
}
  .tabs-component-panels {
  padding: 4em 0;
}


    .db{display: flex;  margin-top: 30px;}
  .db>*{background-color: #fff;  border: 1px solid rgba(0,0,0,0.1); border-radius: 7px;}
</style>
