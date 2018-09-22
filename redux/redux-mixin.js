import createStore from 'redux/src/createStore';
import compose from 'redux/src/compose';
import PolymerRedux from 'polymer-redux';
import * as actions from './redux-actions';

const initial = {
    // ${boardId}:${threadNo} => thread object
    threadMap: {},

    // [${boardId}:${threadNo}]
    pageThreadKeys: []
};

const reducer = function (state, action) {
    switch (action.type) {
        // {threads}
        case actions.UPDATE_THREADS: return Object.assign(state, {
            threadMap: Object.assign(state.threadMap, (() => {
                let map = {};
                action.threads.forEach(thread => state.threadMap[`${thread.boardId}:${thread.no}`] = thread);
                return map;
            })()),
            pageThreadKeys: action.threads.map(thread => `${thread.boardId}:${thread.no}`)
        });

        // {thread}
        case actions.UPDATE_THREAD: {
            const thread = action.thread;
            const key = `${thread.boardId}:${thread.no}`;
            Object.assign(state.threadMap[key], thread);
            return state;
        }

        // {reply: {boardId, threadNo}}
        case actions.APPEND_REPLY_TO_THREAD: {
            const reply = action.reply;
            const key = `${reply.boardId}:${reply.threadNo}`;
            state.threadMap[key].replies.push(reply);
            return state;
        }

        default: return state;
    }
};

const store = createStore(
    reducer,
    initial,

    // The best part 8)
    compose(
        window.devToolsExtension
            ? window.devToolsExtension()
            : v => v
    )
);

// Create the Polymer mixin
export const ReduxMixin = PolymerRedux(store);