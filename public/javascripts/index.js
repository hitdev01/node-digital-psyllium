var PSYAPP = (function () {
  var socket = io.connect('http://localhost:8888');
  var uuid = uuid();
  var beacon = 'aaa';

  $(function(){
    socket.on('connect', function(){
      socket.emit('set uuid', uuid);
    });

    socket.on('ready', function(msg){
      console.log('ready ' + msg);
    });

    socket.on('set color', function(color){
      $('#color').text(color);
      $(document.body).css('background', color);
    });

    setInterval(function(){
      socket.emit('set beacon', {uuid: uuid, beacon: beacon});
    },5000);

  });

  function uuid() {
    var uuid = "", i, random;
    for (i = 0; i < 32; i++) {
      random = Math.random() * 16 | 0;

      if (i == 8 || i == 12 || i == 16 || i == 20) {
        uuid += "-"
      }
      uuid += (i == 12 ? 4 : (i == 16 ? (random & 3 | 8) : random)).toString(16);
    }
    return uuid;
  }

  function sendbeacon() {
    console.log('sendbeacon');
  }

  function getmessage() {
    console.log('getmessage');
  }

  return {
    sendbeacon: sendbeacon,
    getmessage: getmessage
  }

})();
