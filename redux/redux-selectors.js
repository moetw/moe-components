// import { createSelector } from 'reselect'

export const threadsSelector = state => state.pageThreadKeys.map(key => state.threadMap[key]);

export const scrollToThreadBoardId = state => state.ui.scrollToThread.boardId;
export const scrollToThreadThreadNo = state => state.ui.scrollToThread.threadNo;