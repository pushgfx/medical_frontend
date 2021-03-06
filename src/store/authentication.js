import { userService, profileService, doctorService } from '../services'
import { router } from '../router'

const localUser = JSON.parse(localStorage.getItem('localUser'))
const initialState = localUser
  ? { status: { loggedIn: true }, localUser: {role_id: 0} }
  : { status: {}, localUser: null }

//validate doctor registration
const validateDoctorRegistration = (firstName, middleInit, lastName,phone, specialistId,
  gender,email,passwordOne, passwordTwo, race,dob, street, city, state, zipcode) => {
  
    // firstName, middleInit, lastName,phone, specialistId,
      // gender,email,passwordOne, passwordTwo, race,dob, street, city, state, zipcode
  let errors = []
  const re = /^(([^<>()\]\\.,;:\s@"]+(\.[^<>()\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  
  if (!re.test(email)) {
    alert("check email " + email)
    errors.push(new Error('Valid email required.'))
  }
  if (!passwordOne) {
    alert("check pw1 " + passwordOne)

    errors.push(new Error('Password required.'))
  }
  if (!passwordTwo) {
    alert("check pw2 " + passwordTwo)
    errors.push(new Error('Must confirm password.'))
  }
  if (passwordOne !== passwordTwo) {
    errors.push(new Error('Passwords must match.'))
  }
  if (!firstName) {
    alert("check fname " + firstName)

    errors.push(new Error('First name required.'))
  }
  if (!lastName) {
    errors.push(new Error('Last name required.'))
  }
  if (!street) {
    errors.push(new Error('Street address required.'))
  }
  if (!city) {
    errors.push(new Error('city required.'))
  }
  if (!state) {
    errors.push(new Error('State required.'))
  }
  if (!zipcode) {
    errors.push(new Error('Zipcode required.'))
  }
  if (!phone) {
    errors.push(new Error('Phone number required.'))
  }
  if (!dob) {
    errors.push(new Error('Date of birth required.'))
  }
  if (!gender) {
    errors.push(new Error('Gender required.'))
  }
  if (!specialistId) {
    errors.push(new Error('SpecialistID required.'))
  }
  if (!race) {
    errors.push(new Error('Race required.'))
  }
  return errors
}
// Validate the Registration Form
const validateRegistration = (email, passwordOne, passwordTwo, firstName, middleInit, 
  lastName, street, city, state, zipcode, phone, dob, gender, marital, race) => {
  let errors = []
  const re = /^(([^<>()\]\\.,;:\s@"]+(\.[^<>()\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

  if (!re.test(email)) {
    errors.push(new Error('Valid email required.'))
  }
  if (!passwordOne) {
    errors.push(new Error('Password required.'))
  }
  if (!passwordTwo) {
    errors.push(new Error('Must confirm password.'))
  }
  if (passwordOne !== passwordTwo) {
    errors.push(new Error('Passwords must match.'))
  }
  if (!firstName) {
    errors.push(new Error('First name required.'))
  }
  if (!lastName) {
    errors.push(new Error('Last name required.'))
  }
  if (!street) {
    errors.push(new Error('Street address required.'))
  }
  if (!city) {
    errors.push(new Error('city required.'))
  }
  if (!state) {
    errors.push(new Error('State required.'))
  }
  if (!zipcode) {
    errors.push(new Error('Zipcode required.'))
  }
  if (!phone) {
    errors.push(new Error('Phone number required.'))
  }
  if (!dob) {
    errors.push(new Error('Date of birth required.'))
  }
  if (!gender) {
    errors.push(new Error('Gender required.'))
  }
  if (!marital) {
    errors.push(new Error('Marital status required.'))
  }
  if (!race) {
    errors.push(new Error('Race required.'))
  }
  return errors
}
// Validate the Login Form
const validateLogin = (email, password) => {
  let errors = []
  if (!email) {
    errors.push(new Error('email required'))
  }
  if (!password) {
    errors.push(new Error('Password required'))
  }
  return errors
}

export const authentication = {
  namespaced: true,
  state: initialState,
  mutations: {
    loadUserSuccess (state, localUser) {
      state.status = { loggingIn: true }
      state.localUser = localUser
    },
    loginRequest (state, localUser) {
      state.status = { loggingIn: true }
      state.localUser = localUser
    },
    loginSuccess (state, localUser) {
      state.status = { loggedIn: true }
      state.localUser = localUser
    },
    loginFailure (state) {
      state.status = {}
      state.localUser = null
    },
    logout (state) {
      state.status = {}
      state.localUser = null
    },
    registerRequest (state) {
      state.status = { registering: true }
    },
    registerSuccess (state, localUser) {
      state.status = { loggedIn: true }
      state.localUser = localUser
    },
    registerFailure (state) {
      state.status = {}
      state.localUser = null
    }
  },
  actions: {
    loadUser ({ dispatch, commit }) {
      const localUser = JSON.parse(localStorage.getItem('localUser'))
      commit('loadUserSuccess', localUser)
    },
    login ({ dispatch, commit }, { email, password }) {
      commit('loginRequest', { email })
      let errors = validateLogin(email, password)
      if (errors.length === 0) {
        userService.login(email, password)
          .then(
            localUser => {
              commit('loginSuccess', localUser)
              if (localUser.role_id === 1)
                router.push('/admin')
              else if (localUser.role_id === 2) {
                //get patient
                profileService.getProfile(localUser.patient_id).then(
                  response => {
                    router.push('/dashboard')
                  },
                  error => {
                    alert('Please Retry')
                  })
              }
              else if (localUser.role_id === 3) {
                // get doctor
                doctorService.getDoctorData(localUser.doctor_id).then(
                  response => {
                    if (response) {
                      router.push('./doctor-dashboard')
                    }
                  },
                  error => {
                    alert('Please Retry')
                  })
              }                

              dispatch('alert/success', 'Logged In', { root: true })
            },
            error => {
              commit('loginFailure', error)
              dispatch('alert/error', error, { root: true })
            }
          )
      } else {
        commit('loginFailure', errors)
        dispatch('alert/error', errors, { root: true })
      }
    },
    logout ({ dispatch, commit }) {
      userService.logout()
      commit('logout')
      router.push('/')
      dispatch('alert/success', 'Logged Out', { root: true })
    },
    
    register ({dispatch, commit}, { email, passwordOne, passwordTwo, firstName,
       middleInit, lastName, street, city, state, zipcode, phone, dob, gender, marital, race }) 
    {
      commit('registerRequest')
      let errors = validateRegistration(email, passwordOne, passwordTwo, firstName, middleInit, 
  lastName, street, city, state, zipcode, phone, dob, gender, marital, race)

      if (errors.length === 0) {
        userService.register(email, passwordOne, firstName, middleInit, lastName, street, 
          city, state, zipcode, phone, dob, gender, marital, race)
          .then(
            localUser => {
              commit('registerSuccess', localUser)
              profileService.getProfile(localUser.patient_id).then(
                response => {
                  router.push('/dashboard')
                },
                error => {
                  alert('registrationFailure')
                })
            },
            error => {
              commit('registerFailure', error)
              dispatch('alert/error', error, { root: true })
            }
          )
      } else {
        commit('registerFailure', errors)
        dispatch('alert/error', errors, { root: true })
      }
    },
    registerDoctor ({ dispatch, commit }, { firstName, middleInit, lastName, phone, specialistId,
      gender, email, passwordOne, passwordTwo, race, dob, street, city, state, zipcode, image,offices }) {
      commit('registerRequest')
      let errors = validateDoctorRegistration(firstName, middleInit, lastName, phone, specialistId, gender, email,
        passwordOne, passwordTwo, race, dob, street, city, state, zipcode)
      if (errors.length === 0) {
        userService.registerDoctor(firstName, middleInit,lastName, phone, specialistId, gender, email, passwordOne, 
          race, dob, street, city, state, zipcode, image,offices)
          .then(
            response => {
                  alert("Docter Added. Go to Login to Check the Doctor User")
                  router.push('/admin')
                },
            error => {
              commit('registerFailure', error)
              dispatch('alert/error', error, { root: true })
            }
          )
      } else {
        commit('registerFailure', errors)
        dispatch('alert/error', errors, { root: true })
      }
    },
  }
}
