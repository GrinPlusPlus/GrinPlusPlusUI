import { net } from 'electron';

exports.call = function (portNumber, callback) {
    const req = net.request({
        method: 'GET',
        protocol: 'http:',
        hostname: '127.0.0.1',
        port: portNumber,
        path: '/v1/status'
    });

    /*
      Json::Value statusNode;
      statusNode["protocol_version"] = P2P::PROTOCOL_VERSION;
      statusNode["user_agent"] = P2P::USER_AGENT;
  
      const SyncStatus& syncStatus = pServer->m_pP2PServer->GetSyncStatus();
      statusNode["sync_status"] = GetStatusString(syncStatus);
  
      Json::Value networkNode;
      networkNode["height"] = syncStatus.GetNetworkHeight();
      networkNode["total_difficulty"] = syncStatus.GetNetworkDifficulty();
      networkNode["num_connections"] = pServer->m_pP2PServer->GetNumberOfConnectedPeers();
      statusNode["network"] = networkNode;
  
      Json::Value tipNode;
      tipNode["height"] = pTip->GetHeight();
      tipNode["hash"] = HexUtil::ConvertToHex(pTip->GetHash().GetData());
      tipNode["previous_hash"] = HexUtil::ConvertToHex(pTip->GetPreviousBlockHash().GetData());
      tipNode["total_difficulty"] = pTip->GetTotalDifficulty();
      statusNode["chain"] = tipNode;
    */

    req.on("error", (error) => {
        callback(null);
    });

    req.on('response', (response) => {
        var body = "";
        response.on('data', (chunk) => {
            body += chunk;
        });

        response.on('end', () => {
            if (response.statusCode == 200) {
                var status = JSON.parse(body);
                callback(status);
            }
        });
    });
    req.end();
}
