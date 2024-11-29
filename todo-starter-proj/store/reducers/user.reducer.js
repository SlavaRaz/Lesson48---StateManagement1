import { userService } from "../../services/user.service.js"


//* User
export const SET_USER = 'SET_USER'
export const SET_USER_BALANCE = 'SET_USER_BALANCE'


const initialState = {

    user: userService.getLoggedinUser()

}

export function userReducer(state = initialState, cmd = {}) {
   

    switch (cmd.type) {
       
        case SET_USER:
            return {
                ...state,
                loggedInUser: cmd.user
            }

        case SET_USER_BALANCE:
            if (!state.user) return state
            return { ...state, user: { ...state.user, balance: cmd.balance } }

        default:
            return state
    }
}

