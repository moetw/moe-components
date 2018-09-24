import createStore from 'redux/src/createStore';
import compose from 'redux/src/compose';
import PolymerRedux from 'polymer-redux';
import * as actions from './redux-actions';

const initial = {
    // ${boardId}:${threadNo} => thread object
    threadMap: {},

    // [${boardId}:${threadNo}]
    pageThreadKeys: [],

    ui: {
        scrollToThread: {
            boardId: undefined,
            threadNo: undefined
        }
    }
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
            return updateThread(state, action.thread);
        }

        // {thread}
        case actions.UNSHIFT_THREADS: {
            state = updateThread(state, action.thread);
            state.pageThreadKeys.unshift(threadKey(action.thread));
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

const threadKey = (thread) => `${thread.boardId}:${thread.no}`;
const updateThread = (state, thread) => {
    if (state.threadMap[threadKey(thread)]) {
        Object.assign(state.threadMap[threadKey(thread)], thread);
    } else {
        Object.assign(state.threadMap, {[threadKey(thread)]: thread})
    }
    return state;
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