/* 	Smith Jones Cribbage
*	By: Keegan Jones
*	This file contains the main functions necessary for the peer-to-peer communication
*	most of this code was taken from scaledrone.com as this was the best way i found to
*	do peer-to-peer communication without the use of a server
*/

let members = [];
	
const sDrone = new ScaleDrone('nXwFgyL5FGMsgVgz');	

sDrone.on('open', error=>{
	if(error){
		return console.error(error);
	}
	console.log("Successfully Connected to ScaleDrone");
	
	const room = sDrone.subscribe('observable-smithjonescribbage');
	
	room.on('open', error => {
		if(error) {
			return console.error(error);
		}
		console.log('Successfully Joined Room');
	});
	
	room.on('members', m => {
		members = m;
	});

	room.on('member_join', member => {
		members.push(member);
	});

	room.on('member_leave', ({id}) => {
		const index = members.findIndex(member => member.id === id);
		members.splice(index, 1);
	});
		
	room.on('data', (msg, member) => {
		console.log("msg rec from " + msg.sentFrom.name);
		recMsg(msg);
	});
	
});

function sendMessage(msg) {
	if (msg === '') {
		return;
	}
	
	sDrone.publish({
		room: 'observable-smithjonescribbage',
		message: msg,
	});
}
