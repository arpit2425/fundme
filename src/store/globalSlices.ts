import {createSlice} from "@reduxjs/toolkit"
import { globalAction as GlobalAction } from "./actions/globalActions"
import {globalStates as GlobalStates} from "./states/globalState"

const globalSlicer= createSlice({
    name:"global",
    initialState:GlobalStates,
    reducers:GlobalAction
})
export const globalAction=globalSlicer.actions;
export default globalSlicer.reducer;