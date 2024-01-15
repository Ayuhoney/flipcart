import { getProductsReducer } from "./Reducers/productReducer";
import thunkMiddleware from 'redux-thunk';
import {createStore, combineReducers, applyMiddleware} from "redux"
import { composeWithDevTools } from "redux-devtools-extension";
import {cartReducer} from "../Redux/Reducers/cartReducer"
import {wishlistReducer} from '../Redux/Reducers/wishlistReducer'

const reducer = combineReducers({
    getProducts:getProductsReducer,
    cart: cartReducer,
    wishlist:wishlistReducer,
})

const middleware = [thunkMiddleware ];

const store = createStore(
    reducer,
    composeWithDevTools(applyMiddleware(...middleware))

)


export default store;

