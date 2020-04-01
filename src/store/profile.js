import { profileService } from '../services'
import { router } from '../router'

const initialState = {
  profileStatus: {},
  userProfile: {}
}

// Validate the Profile Form
const validateProfile = profile => {
  const {
    firstName,
    middleInit,
    lastName,
    street,
    city,
    state,
    zipcode,
    phone,
    dob,
    gender,
    marital,
    race
  } = profile
  let errors = []
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

const checkComplete = (profile) => {
  let complete = true
  for (let [key, value] of Object.entries(profile)) {
    if (key !== 'middleInit' && value.length === 0) {
      complete = false
    }
  }
  return complete
}

export const profile = {
  namespaced: true,
  state: initialState,
  mutations: {
    loadProfileRequest (state) {
      state.profileStatus = { loadingProfile: true }
      state.userProfile = state.initialState
    },
    loadingProfileSuccess (state, profile) {
      state.profileStatus = {
        loadedProfile: true,
        profileComplete: checkComplete(profile)
      }
      state.userProfile = profile
    },
    loadingProfileFailure (state) {
      state.profileStatus = {}
      state.userProfile = initialState
    },
    loadedProfileEmpty (state, profile) {
      state.profileStatus = {
        loadedProfile: true,
        profileComplete: true
      }
    },
    createProfileRequest (state, submittedProfile) {
      state.profileStatus = { creatingProfile: true }
      state.userProfile = submittedProfile
    },
    createProfileSuccess (state, returnedProfile) {
      state.profileStatus = {
        createdProfile: true,
        profileComplete: checkComplete(profile)
      }
      state.userProfile = returnedProfile
    },
    createProfileFailure (state, submittedProfile) {
      state.profileStatus = { createProfileFailure: true }
    },
    updateProfileRequest (state, submittedProfile) {
      state.profileStatus = { updatingProfile: true }
      state.userProfile = submittedProfile
    },
    updateProfileSuccess (state, returnedProfile) {
      state.profileStatus = {
        updatedProfile: true,
        profileComplete: checkComplete(profile)
      }
      state.userProfile = returnedProfile
    },
    updateProfileFailure (state) {
      state.profileStatus = { updateProfileFailure: true }
    }
  },
  actions: {
    loadProfile ({ dispatch, commit }) {
      commit('loadProfileRequest')
      const localUser = JSON.parse(localStorage.getItem('localUser'))
      commit('loadingProfileSuccess', localUser.profile)
    },
    createProfile ({ dispatch, commit }, profile) {
      commit('createProfileRequest', profile)
      const validationErrors = validateProfile(profile)
      if (validationErrors.length > 0) {
        commit('createProfileFailure')
        dispatch('alert/error', validationErrors, { root: true })
      } else {
        profileService.postProfile(profile).then(
          response => {
            commit('createProfileSuccess', response.profile)
            router.push('/dashboard')
            dispatch('alert/success', 'Profile Created', { root: true })
          },
          error => {
            commit('createProfileFailure')
            dispatch('alert/error', error, { root: true })
          }
        )
      }
    },
    updateProfile ({ dispatch, commit }, profile) {
      commit('updateProfileRequest', profile)
      const validationErrors = validateProfile(profile)
      if (validationErrors.length > 0) {
        commit('updateProfileFailure')
        dispatch('alert/error', validationErrors, { root: true })
      } else {
        profileService.putProfile(profile).then(
          response => {
            commit('updateProfileSuccess', response.profile)
            dispatch('alert/success', 'Profile Updated', { root: true })
          },
          error => {
            commit('updateProfileFailure')
            dispatch('alert/error', error, { root: true })
          }
        )
      }
    }
  }
}
