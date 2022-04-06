import { readFileSync, writeFileSync } from 'fs';
import { AccessRights, IdentityClient, ChannelClient } from '@iota/is-client';

import { defaultConfig } from './configuration';

// In this example we will use two instances of the ChannelClient() both will authenticate a different user.
const ownerClient = new ChannelClient(defaultConfig);
const userClient = new ChannelClient(defaultConfig);
const identity = new IdentityClient(defaultConfig);

(async () => {

    // Creating a channel owner who creates the channel and a channel user who will be authorized to read the channel
    console.log('Creating user...');

    // const channelOwner = JSON.parse(readFileSync("ownerIdentity.json").toString())
    const channelOwner = await identity.create('DIG-IT-Owner-' + Math.random());
    writeFileSync("ownerIdentity.json", JSON.stringify(channelOwner, null, 2));

    // const channelUser = JSON.parse(readFileSync("userIdentity.json").toString())
    const channelUser = await identity.create('DIG-IT-User-' + Math.random());
    writeFileSync("userIdentity.json", JSON.stringify(channelUser, null, 2));

    // We will use two instances of the channel api client. One is getting authorized by the owner and the other one by the user.
    await ownerClient.authenticate(channelOwner.doc.id, channelOwner.key.secret);
    console.log("Authenticated as owner")

    await userClient.authenticate(channelUser.doc.id, channelUser.key.secret);
    console.log("Authenticated as user")

    // The owner creates a channel where he/she want to publish data of type 'example-data'.
    // const channelAddress = "bcfe0b493b4ae8ad50a390148970ba93182312cd895b1055358602cc0ddcd3c50000000000000000:d0a405466adc427bd19faa2d"
    const { channelAddress } = await ownerClient.create({
        topics: [{ type: 'example-data', source: 'example-creator' }]
    });
    console.log("Channel address:", channelAddress);

    // Request subscription to the channel as the user. The returned subscriptionLink can be used to authorize the user to the channel.
    const { subscriptionLink } = await userClient.requestSubscription(channelAddress, {
        accessRights: AccessRights.ReadAndWrite
    });

    console.log("Subscription Link:", subscriptionLink)

    // Find subscriptions to the channel that are not already authorized.
    const subscriptions = await ownerClient.findAllSubscriptions(channelAddress, false);

    console.log("Subscriptions Found:", subscriptions);

    const unauthorizedSubscriptions = subscriptions.filter(subscription => !subscription.isAuthorized)

    // console.log('Unauthorized subscriptions:', unauthorizedSubscriptions);

    for (const subscription of unauthorizedSubscriptions) {
        console.log(`Authorizing subscription: ${subscription.id}...`);
        // Authorize the user to the channel. Authorization can happen via the id of the user or the generated subscription link.
        const keyloadLink = await ownerClient.authorizeSubscription(channelAddress, {
            id: channelUser.doc.id
        });
        console.log("Subscription Keyload Link:", keyloadLink)
    }

    writeFileSync("channel.json", JSON.stringify({
        channelAddress
    }, null, 2));

    /*
    // Writing data to channel as the channel owner. Make sure to authorize potential channel readers beforehand.
    console.log('Writing to channel...');
    await ownerClient.write(channelAddress, {
        payload: { log: `This is log file 2` }
    });

    // Reading the channel as the user
    const channelData = await userClient.read(channelAddress);
    console.log('First channel data log: ', channelData[0].log.payload);
    */

})().catch(console.log)

