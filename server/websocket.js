const handleWSConnection = function(request){
    // TODO: can rewrite this to accept only the requests from allowed origin
    const wsConn = request.accept(null, request.origin);

    wsConn.on('message', function (data) {
        console.log("Message:",data);
        var msg = JSON.parse(data['utf8Data']);
        wsConn.send(data['utf8Data']);
    });
}

module.exports = handleWSConnection;

