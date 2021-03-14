const {ExpressPeerServer}=require('peer');
const peerServer=ExpressPeerServer({ port: 9000, path: '/' });
peerServer.listen(9000);