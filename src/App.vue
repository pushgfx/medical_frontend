<template>
  <div id="app" class="row">
    <header class="row">
      <div class="row-flex container top-header">
        <div class="logo"><img src="/static/images/logo.png" alt=""></div>
        <div class="logo-text left">Health Hub</div>
        <ul class="nav-links">
          <li><a to="/" href="/">Home</a></li>
          <li><a href="search-doctor">Search Doctor</a> </li>
          <li v-if="userStatus.localUser != null && userStatus.localUser.role_id === 2" class="menu-item-has-children">
            Patients
            <ul class="sub-menu">
              <hr class="style1">
              <li><a href="appointment">Book Appointment</a></li>
              <hr class="style1">
              <li><a href="dashboard">Patient Dashboard</a></li>
              <hr class="style1">
              <li><a href="update-profile">Update Profile</a></li>
            </ul>
          </li>
          <li v-if="userStatus.localUser != null && userStatus.localUser.role_id === 3" class="menu-item-has-children">
            Doctors
            <ul class="sub-menu">
              <li><a href="doctor-dashboard">Doctor Dashboard</a></li>
              <hr class="style1">
              <li><a href="doctor-patients">Patients List</a></li>
              <hr class="style1">
              <li><a href="update-doctor-profile">Update Profile</a></li>
            </ul>
          </li>
          <li v-if="userStatus.localUser != null && userStatus.localUser.role_id === 1" class="menu-item-has-children">
            Admin
            <ul class="sub-menu">
              <li><a href="admin">Admin Dashboard</a></li>
              <hr class="style1">
              <li><a href="reports">Reports</a></li>
            </ul>
          </li>
          <li><a to="office" href="office">Health Offices</a></li>
        </ul>
        <div class="login-links">
          <button>
          <a href="login" v-if="userStatus.localUser" v-on:click="logout()">Logout</a>
          <a href="login" v-else>Login</a>
          </button>

        </div>
      </div>
    </header>
    <section class="row main">
      <router-view/>
    </section>

    <footer class="row">
      <div class="row return-messages" v-if="alert.messages">
        <div class="message error" v-if="alert.type == 'alert-danger'">
          <!-- <div v-for="(message, index) in alert.messages" :key="index">{{ message }}</div> -->
          <div>{{ alert.messages }}</div>
        </div>
        <div class="message success" v-if="alert.type == 'alert-success'">
          <div>{{ alert.messages }}</div>
        </div>
      </div>
    </footer>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import Vue from 'vue'
import VueBreadcrumbs from 'vue-breadcrumbs'
Vue.use(VueBreadcrumbs)
export default {
  name: 'App',
  created () {
    this.loadUser()
  },
  computed: {

    alert () {return this.$store.state.alert},
    // This Names Your Property That You Are Referencing in The Template
    userStatus () {
    // if you want to expose the entire sate
      return this.$store.state.authentication
    }
  },
  watch: {
    $route (to, from) {
      this.$store.dispatch('alert/clear')
    }
  },
  methods: {
     ...mapActions('authentication', [
       'loadUser'
     ]),
    logout (e) {
      this.$store.dispatch('authentication/logout')
    }
  }
}
</script>
<style>
#app {
  font-family: 'Open Sans', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
.return-messages{width: 150px;}
</style>
