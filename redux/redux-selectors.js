// import { createSelector } from 'reselect'

export const threadsSelector = state => state.pageThreadKeys.map(key => state.threadMap[key]);