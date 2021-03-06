import {  
    FORGOT_PASSWORD_OTP_START,
    FORGOT_PASSWORD_OTP_SUCCESS,
    FORGOT_PASSWORD_OTP_ERROR
} from '../actions/index.actions';

const initialState = {
    isLoading: false,
    success: false,
    error: false,
    data: {},
}
export default function(state = initialState, action) {
    switch (action.type) {
        case FORGOT_PASSWORD_OTP_START:
            return {
                ...state,
                isLoading: true
            };
        case FORGOT_PASSWORD_OTP_SUCCESS:
            return {
                ...state,
                data: action.payload,
                success: true,
                isLoading: false
            }
        case FORGOT_PASSWORD_OTP_ERROR:
            return {
                ...state,
                ...action.payload,
                isLoading: false,
                error: true
            }
        default:
            return state
    }
}