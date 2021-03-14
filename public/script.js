const socket=io('/')
const myVideo=document.createElement('video');
const videoGrid=document.getElementById('video-grid');
myVideo.muted=true;

var peer = new Peer(undefined,{
    path:'/peerjs',
    host:'/',
    port:'443',
}); 
peer.on('open',id=>{
    console.log(id);
    socket.emit('join-room',ROOM_ID,id);
})
var peers={}
let myVideoStream
var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
getUserMedia({
    video:true,
    audio:true
},(stream)=>{
    myVideoStream=stream;
    addVideoStream(myVideo,stream);

     

    peer.on('call',call=>{
        console.log("hereeeeeeee");
        call.answer(stream);
        const video=document.createElement('video');
        call.on('stream',userVideoStream=>{
            addVideoStream(video,userVideoStream);
        });
    });


    socket.on('user-connected',(userId)=>{
        connectToNewUser(userId,stream);
        console.log("hello");
           
    });

   
    
    
})

socket.on("user-disconnected",userId=>{
    if(peers[userId]) peers[userId].close()
})
const connectToNewUser=(userId,stream)=>{
    
    const call=peer.call(userId,stream);
    console.log(userId);
    
    const video=document.createElement('video');
    call.on('stream',userVideoStream=>{
        console.log("called");
        addVideoStream(video,userVideoStream);
    });
    call.on('close',()=>{
        video.remove()
    })
    peers[userId]=call;
}

const addVideoStream=(video,stream)=>{
    video.srcObject=stream;
    // console.log(stream);
    video.addEventListener('loadedmetadata',()=>{
        video.play();
    })
    videoGrid.append(video)
}

let text=$('input')

$('html').keydown((e)=>{
    if(e.which==13 && text.val().length!==0){
        // console.log(text.val());
        socket.emit('message',text.val());
        text.val('')
    }
})
document.getElementById("send").addEventListener("click",()=>{
    // console.log(text.val());
        socket.emit('message',text.val());
        text.val('')
})
socket.on("create_message",message=>{
    $('ul').append(`<li class="msg"><b>user</b><br/><p>${message}</p></li>`)
    scroll()
})
const scroll=()=>{
    var d=$(".chat_box")
    d.scrollTop(d.prop("scrollHieght"))
}

const muteUnmute=()=>{
    const enabled=myVideoStream.getAudioTracks()[0].enabled;
    if(enabled){
        myVideoStream.getAudioTracks()[0].enabled=false;
        setUnmuteButton();
    }
    else{
        setMuteButton();
        myVideoStream.getAudioTracks()[0].enabled=true;
    }
}
setMuteButton=()=>{
    const html=`<i class='fas fa-microphone' style='font-size:24px;color:white'></i>
    <span>Mute</span>`
    document.querySelector('.mike').innerHTML=html;
}
setUnmuteButton=()=>{
    const html=`<i class='fas fa-microphone-slash' style='font-size:24px;color:red'></i>
    <span>Unmute</span>`
    document.querySelector('.mike').innerHTML=html;
}

const play_stop=()=>{
    const enabled=myVideoStream.getVideoTracks()[0].enabled;
    if(enabled){
        myVideoStream.getVideoTracks()[0].enabled=false;
        setStopButton();
    }
    else{
        setPlayButton();
        myVideoStream.getVideoTracks()[0].enabled=true;
    }
}
setPlayButton=()=>{
    const html=`<i class='fas fa-video' style='font-size:24px;color:white'></i>
    <span>Stop Video</span>`
    document.querySelector('.vid').innerHTML=html;
}
setStopButton=()=>{
    const html=`<i class='fas fa-video-slash' style='font-size:24px;color:red'></i>
    <span>Start Video</span>`
    document.querySelector('.vid').innerHTML=html;
}
const leave=()=>{
    socket.disconnect();
    window.location.href = "https://www.google.com";
}