const { getRequestedMessages, getMessages, addMessages } = require('./messages');

messagesMock = [
    'test1',
    'test2',
    'test3',
    'test4',
    'test5',
    'test6',
    'test7',
    'test8',
    'test9',
    'test10',
    'test11',
    'test12',
    'test13',
    'test14',
    'test15',
]

mockSocket = {};
mockSocket.emit = jest.fn((message, data) => [message, data])

describe('getRequestedMessages()', () => {
    it('returns expected messages count', () => {
        expect(getRequestedMessages(messagesMock, 0).length).toBe(10);
        expect(getRequestedMessages(messagesMock, 10).length).toBe(5);
        expect(getRequestedMessages(messagesMock, 15).length).toBe(0);
    })
    
    it('gets NEW messages', () => {
        expect(getRequestedMessages(messagesMock, 14)).toEqual(['test1']);
        expect(getRequestedMessages(messagesMock, 12)).toEqual(['test1', 'test2', 'test3']);
    })

    it('handles invalid inputs', () => {
        expect(getRequestedMessages('hi', 5)).toEqual('error');
        expect(getRequestedMessages(messagesMock, 5.5)).toEqual('error');
        expect(getRequestedMessages(messagesMock, '5')).toEqual('error');
    })
})

describe('getMessages()', () => {
    it('handles dependencies error', () => {
        expect.assertions(1)
        return getMessages()
        .catch(err => {
            expect(err.message).toBe('Dependencies error')
        })
    })

    it('handles wrong request', () => {
        expect.assertions(1);
        return getMessages(5, undefined, mockSocket, {db:'db'})
        .then(response => {
            expect(response).toEqual(['load messages fail', 'Wrong request']);
        })
    })
})

const noChannelMessage = {
    body: {
        username: 'max',
        message: 'hi',
        img: 'some/image/url'
    }
}
const noBodyMessage = {
    channel: 'hi'
}
const noUsernameMessage = {
    channel: 'hi',
    body: {
        message: 'hi',
        img: 'some/image/url'
    }
}
const noMessageAndImgMessage = {
    channel: 'hi',
    body: {
        username: 'max'
    }
}

describe('addMessages()', () => {
    it('handles invalid message parameter', () => {
        return Promise.all([
            addMessages(noChannelMessage, mockSocket, {}, {}),
            addMessages(noMessageAndImgMessage, mockSocket, {}, {}),
            addMessages(noUsernameMessage, mockSocket, {}, {}),
            addMessages(noBodyMessage, mockSocket, {}, {}),
            addMessages({}, mockSocket, {}, {}),
            addMessages('hi', mockSocket, {}, {}),
            addMessages([], mockSocket, {}, {})
        ])
        .then(([noChannel, noMsgAndImg, noUsername, noBody, emptyObj, hiString, emptyArr]) => {
            expect(noChannel).toEqual(['message fail', 'Invalid message']);
            expect(noMsgAndImg).toEqual(['message fail', 'Invalid message']);
            expect(noUsername).toEqual(['message fail', 'Invalid message']);
            expect(noBody).toEqual(['message fail', 'Invalid message']);
            expect(emptyObj).toEqual(['message fail', 'Invalid message']);
            expect(hiString).toEqual(['message fail', 'Invalid message']);
            expect(emptyArr).toEqual(['message fail', 'Invalid message']);
        })
    })
})
