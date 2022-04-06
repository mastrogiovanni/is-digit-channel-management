import { readFileSync, writeFileSync } from 'fs';
import { AccessRights, IdentityClient, ChannelClient } from '@iota/is-client';

import { defaultConfig } from './configuration';

// In this example we will use two instances of the ChannelClient() both will authenticate a different user.
const ownerClient = new ChannelClient(defaultConfig);

(async () => {

    // const channelOwner = JSON.parse(readFileSync("ownerIdentity.json").toString())
    const channelOwner = JSON.parse(readFileSync("ownerIdentity.json").toString())

    // We will use two instances of the channel api client. One is getting authorized by the owner and the other one by the user.
    await ownerClient.authenticate(channelOwner.doc.id, channelOwner.key.secret);
    console.log("Authenticated as owner")

    const { channelAddress } = JSON.parse(readFileSync("channel.json").toString())

    // Reading the channel as the user
    const channelData = await ownerClient.read(channelAddress);
    console.log('First channel data log: ', channelData[0].log.payload);

})().catch(console.log)

