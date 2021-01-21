function getIpArray(callback){
    let finalArray = []

    var RTCPeerConnection = getPeerConn()
    var useWebKit = !!window.webkitRTCPeerConnection;

    if(!RTCPeerConnection){
        var win = iframe.contentWindow;
        RTCPeerConnection = win.RTCPeerConnection
            || win.mozRTCPeerConnection
            || win.webkitRTCPeerConnection;
        useWebKit = !!win.webkitRTCPeerConnection;
    }

    var mediaConstraints = getConstraints()

    var servers = getServers()

    var pc = new RTCPeerConnection(servers, mediaConstraints);

    function handleCandidate(candidate){
        var regex = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/
        if(regex.exec(candidate) !== null){
        	var ip_addr = regex.exec(candidate)[0];
          if(validateIp(ip_addr)) finalArray.push(ip_addr)
        }  
    }

    pc.onicecandidate = function(ice){
        if(ice.candidate) handleCandidate(ice.candidate.candidate);
    };

    pc.createDataChannel("ip");

    pc.createOffer(function(result){
        pc.setLocalDescription(result, function(){}, function(){});
    }, function(){});

    setTimeout(function(){
        var lines = pc.localDescription.sdp.split('\n');

        lines.forEach(function(line){
            if(line.indexOf('a=candidate:') === 0)
                handleCandidate(line);
        });
        let truncatedArray = removeDuplicates(finalArray)
        callback(truncatedArray)
    }, 100);
}

function getFirstIp(callback){
    let ips = []
    var RTCPeerConnection = getPeerConn()
    var useWebKit = !!window.webkitRTCPeerConnection;

    if(!RTCPeerConnection){
        var win = iframe.contentWindow;
        RTCPeerConnection = win.RTCPeerConnection
            || win.mozRTCPeerConnection
            || win.webkitRTCPeerConnection;
        useWebKit = !!win.webkitRTCPeerConnection;
    }

    var mediaConstraints = getConstraints()

    var servers = getServers()

    var pc = new RTCPeerConnection(servers, mediaConstraints);

    function handleCandidate(candidate){
        var regex = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/
        if(regex.exec(candidate) !== null){
        	var ip_addr = regex.exec(candidate)[0];
          if(validateIp(ip_addr)) ips.push(ip_addr);
        }
    }

    pc.onicecandidate = function(ice){
        if(ice.candidate) handleCandidate(ice.candidate.candidate);
    };

    pc.createDataChannel("ip");

    pc.createOffer(function(result){
        pc.setLocalDescription(result, function(){}, function(){});
    }, function(){});

    setTimeout(function(){
        var lines = pc.localDescription.sdp.split('\n');

        lines.forEach(function(line){
            if(line.indexOf('a=candidate:') === 0)
                handleCandidate(line);
        });
        callback(ips[0])
    }, 100);
}

function getServers(){
	return { iceServers: [{ urls: ["stun:stun.l.google.com:19302?transport=udp"] }] };
}

function getConstraints(){
	return {
  	optional: [{RtpDataChannels: true}]
	};
}

function getPeerConn(){
    return window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
}

function validateIp(ipaddress) {  
  if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ipaddress)) {  
    return (true)  
  }  
  return (false)  
}

function removeDuplicates(array){
  return [...new Set(array)];
}