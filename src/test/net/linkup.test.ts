import { LinkupManager, LinkupAddress } from 'net/linkup';

describe('Single-host LinkupManager', () => {
    test('Call starting', (done) => {
        let linkupManager1 = new LinkupManager();
        let linkupManager2 = new LinkupManager();

        let address1 = new LinkupAddress(/*'wss://mypeer.net:443'*/'wss://mypeer.net:443', 'addressOne_A');
        let address2 = new LinkupAddress(/*'wss://mypeer.net:443'*/'wss://mypeer.net:443', 'addressTwo_A');

        let callId = 'DUMMY_CALL_ID_TEST_A';
        let message = 'MESSAGE';

        // one is going to listen for a message in a new call
        // two is going to send a message in a new call DUMMY_CALL_ID_TEST_A

        linkupManager1.listenForMessagesNewCall(address1, (sender: LinkupAddress, recipient: LinkupAddress, rcvdCallId: string, rcvdMessage: any) => {
            
            expect(sender.linkupId).toEqual(address2.linkupId);
            expect(sender.serverURL).toEqual(address2.serverURL);
            expect(recipient.linkupId).toEqual(address1.linkupId);
            expect(recipient.serverURL).toEqual(address1.serverURL);
            expect(rcvdCallId).toEqual(callId);
            expect(rcvdMessage).toEqual(message);
            done();
        });
        
        window.setTimeout(() => {
            linkupManager2.sendMessageOnCall(address2, address1, callId, message);
        }, 100);

        

    }, 10000);

    test('Call answering', (done) => {
        let linkupManager1 = new LinkupManager();
        let linkupManager2 = new LinkupManager();

        let address1 = new LinkupAddress(/*'wss://mypeer.net:443'*/'wss://mypeer.net:443', 'addressOne_B');
        let address2 = new LinkupAddress(/*'wss://mypeer.net:443'*/'wss://mypeer.net:443', 'addressTwo_B');

        let callId =  'DUMMY_CALL_ID_TEST_B';
        let message = 'MESSAGE';
        let reply   = 'REPLY';

        // one is going to listen for a message in a new call
        // two is going to send a message in a new call DUMMY_CALL_ID_TEST_B
        // one is going to send a message back on call DUMMT_CALL_ID_TEST_B

        linkupManager1.listenForMessagesNewCall(address1, (sender: LinkupAddress, recipient: LinkupAddress, rcvdCallId: string, rcvdMessage: any) => {
            expect(sender.linkupId).toEqual(address2.linkupId);
            expect(sender.serverURL).toEqual(address2.serverURL);
            expect(recipient.linkupId).toEqual(address1.linkupId);
            expect(recipient.serverURL).toEqual(address1.serverURL);
            expect(rcvdCallId).toEqual(callId);
            expect(rcvdMessage).toEqual(message);
            linkupManager1.sendMessageOnCall(address1, address2, callId, reply);
            
        });

        linkupManager2.listenForMessagesOnCall(address2, callId, (message: string) => {
            expect(message).toEqual(reply);
            done();
        });
        
        window.setTimeout(() => {
            linkupManager2.sendMessageOnCall(address2, address1, callId, message);
        }, 100);

        

    }, 10000);
});