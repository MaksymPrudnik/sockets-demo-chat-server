const { addChannel } = require('./channels')

socketMock = {};
socketMock.emit = jest.fn((message, data) => [message, data])

describe('addChannel()', () => {
    it('handles invalid channel parameter', () => {
        expect.assertions(1);
        return addChannel(null, socketMock, {}, {})
        .then(result => {
            expect(result).toEqual(['error chanel', 'Invalid request'])
        })
    })

    it('handles dependencies error', () => {
        expect.assertions(1);
        addChannel('null', null, {}, {})
        .catch(err => {
            expect(err.message).toEqual('Dependencies error')
        })
    })
})