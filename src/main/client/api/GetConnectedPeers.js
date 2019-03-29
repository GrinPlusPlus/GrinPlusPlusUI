import { net } from 'electron';

exports.call = function(event, portNumber) {
  const req = net.request({
    method: 'GET',
    protocol: 'http:',
    hostname: '127.0.0.1',
    port: portNumber,
    path: '/v1/peers/connected'
  });

  /*
  	Json::Value capabilitiesNode;
  	capabilitiesNode["bits"] = connectedPeer.GetPeer().GetCapabilities().GetCapability();
  	peerNode["capabilities"] = capabilitiesNode;

  	const Peer& peer = connectedPeer.GetPeer();
  	peerNode["user_agent"] = peer.GetUserAgent();
  	peerNode["version"] = peer.GetVersion();
  	peerNode["addr"] = peer.GetIPAddress().Format() + ":" + std::to_string(peer.GetPortNumber());
  	peerNode["direction"] = connectedPeer.GetDirection() == EDirection::OUTBOUND ? "Outbound" : "Inbound";
  	peerNode["total_difficulty"] = connectedPeer.GetTotalDifficulty();
  	peerNode["height"] = connectedPeer.GetHeight();
  */

  req.on('response', (response) => {
    var body = "";
    response.on('data', (chunk) => {
      body += chunk;
    });

    response.on('end', () => {
      var result = new Object();
      result["status_code"] = response.statusCode;

      if (response.statusCode == 200) {
        result["peers"] = JSON.parse(body);
      }

      event.returnValue = result;
    });
  });
  req.end();
}
