import {createStore, combineReducers} from 'redux';

export const ONLINE = `ONLINE`;
export const AWAY = `AWAY`;
export const BUSY = `BUSY`;
export const OFFLINE = `OFFLINE`;

export const UPDATE_STATUS = `UPDATE_STATUS`;
export const CREATE_NEW_MESSAGE = `CREATE_NEW_MESSAGE`;

const defaultState = {
    messages: localStorage[`messages`] ? JSON.parse(localStorage[`messages`]) : [
        {
            date: new Date('2016-10-10 10:11:55'),
            postedBy: `Stan`,
            content: `I LOVE YOU`
        },
        {
            date: new Date('2016-10-10 10:11:57'),
            postedBy: `BOB`,
            content: `I LOVE YOU TOO MAN`
        }
    ],
    userStatus: ONLINE
}

const userStatusReducer =(state=defaultState.userStatus, {type,value})=>{
    switch(type) {
        case UPDATE_STATUS:
            return value;
            break;
    }
    return state;
}

const messagesReducer=(state=defaultState.messages, {type,value,postedBy,date})=>{
    switch(type) {
        case CREATE_NEW_MESSAGE:
            const newState = [{date, postedBy, content:value}, ...state];            
            return newState;
    }
    return state;
}

const combinedReducer = combineReducers({
    userStatus: userStatusReducer,
    messages: messagesReducer
})

const store = createStore(combinedReducer);

const render = () => {
    const {messages, userStatus} = store.getState();
    document.getElementById("messages").innerHTML = messages
        .sort((a,b) => b.date - a.date)
        .map(message=>(`
            <div>
                ${message.postedBy} : ${message.content}
            </div>
        `))
        .join("");
    
    localStorage[`messages`] = JSON.stringify(messages);

    document.forms.newMessage.fields.disabled = (userStatus === OFFLINE);
    document.forms.newMessage.newMessage.value = "";
}

const statusUpdateAction = (value)=> {
    return {
        type: UPDATE_STATUS,
        value
    }
}

const newMessageAction = (content,postedBy)=>{
    const date = new Date();
    return {
        type: CREATE_NEW_MESSAGE,
        value: content,
        postedBy,
        date
    }
}

document.forms.selectStatus.status.addEventListener("change", (e)=>{
    store.dispatch(statusUpdateAction(e.target.value));
});

document.forms.newMessage.addEventListener("submit", (e)=>{
    e.preventDefault();
    const value = e.target.newMessage.value;
    const username = localStorage[`preferences`] ? JSON.parse(localStorage[`preferences`]).userName : "Jason";
    store.dispatch(newMessageAction(value,username));
})

render();

store.subscribe(render);
