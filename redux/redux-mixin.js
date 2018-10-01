import createStore from 'redux/src/createStore';
import compose from 'redux/src/compose';
import PolymerRedux from 'polymer-redux';
import * as actions from './redux-actions';

const initial = {
    // ${boardId}:${threadNo} => thread object
    threadMap: {},

    // [${boardId}:${threadNo}]
    pageThreadKeys: [],

    // ${boardId}:${replyNo} => reply object
    replyMap: {},

    validationCriteria: {
        nameMaxLength: 0,
        emailMaxLength: 0,
        subjectMaxLength: 0,
        commentMaxLength: 0,
        fileMaxSize: 0,
        videoMaxEmbeds: 0,
        pollTitleMaxLength: 0,
        pollMinItems: 0,
        pollMaxItems: 0,
        pollItemMaxLength: 0,
    }
};

const reducer = function (state, action) {
    switch (action.type) {
        // {threads}
        case actions.UPDATE_THREADS: {
            action.threads.forEach(thread => {
                // fill replyMap
                thread.replies.forEach(reply => state = updateReply(state, reply));

                // replace thread.replies with replyKey
                thread.replies = thread.replies.map(reply => replyKey(reply));

                // fill threadMap
                state = updateThread(state, thread);
            });
            state.pageThreadKeys = action.threads.map(thread => `${thread.boardId}:${thread.no}`);
            return state;
        }

        // {thread}
        case actions.UPDATE_THREAD: {
            return updateThread(state, action.thread);
        }

        case actions.REMOVE_THREAD: {
            // delete replies
            state.threadMap[threadKey(action.thread)].replies.forEach(reply => delete state.replyMap[replyKey(reply)]);

            // delete thread
            const threadKeyIndex = state.pageThreadKeys.indexOf(threadKey(action.thread));
            if (threadKeyIndex >= 0) {
                state.pageThreadKeys.splice(threadKeyIndex, 1);
            }
            delete state.threadMap[threadKey(action.thread)];

            return state;
        }

        case actions.PREPEND_REPLIES_TO_THREAD: {
            for (const reply of action.replies) {
                const threadKey = `${reply.boardId}:${reply.threadNo}`;
                state.threadMap[threadKey].replies.unshift(replyKey(reply));
                state = updateReply(state, reply);
            }
            return state;
        }

        // {reply: {boardId, threadNo}}
        case actions.APPEND_REPLY_TO_THREAD: {
            const reply = action.reply;
            const threadKey = `${reply.boardId}:${reply.threadNo}`;
            state.threadMap[threadKey].replies.push(replyKey(reply));
            state = updateReply(state, reply);
            return state;
        }

        case actions.REMOVE_REPLY_FROM_THREAD: {
            const reply = action.reply;
            const threadKey = `${reply.boardId}:${reply.threadNo}`;
            const replyKeyIndex = state.threadMap[threadKey].replies.indexOf(replyKey(reply));
            if (replyKeyIndex >= 0) {
                state.threadMap[threadKey].replies.splice(replyKeyIndex, 1);
            }
            delete state.replyMap[replyKey(reply)];
            return state;
        }

        // {validationCriteria: {}}
        case actions.UPDATE_VALIDATION_CRITERIA: {
            Object.assign(state.validationCriteria, action.validationCriteria);
            return state;
        }

        default: return state;
    }
};

const threadKey = (thread) => `${thread.boardId}:${thread.no}`;
const updateThread = (state, thread) => {
    // fill threadMap
    if (state.threadMap[threadKey(thread)]) {
        Object.assign(state.threadMap[threadKey(thread)], thread);
    } else {
        Object.assign(state.threadMap, {[threadKey(thread)]: thread})
    }
    return state;
};

const replyKey = (reply) => `${reply.boardId}:${reply.no}`;
const updateReply = (state, reply) => {
    if (state.replyMap[replyKey(reply)]) {
        Object.assign(state.replyMap[replyKey(reply)], reply);
    } else {
        Object.assign(state.replyMap, {[replyKey(reply)]: reply})
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