import { WebSocketShard } from 'discord.js';
import { ClientUserSettings } from '../structures/ClientUserSettings';

const handlers = require('discord.js/src/client/websocket/handlers/index');
const READY = require('discord.js/src/client/websocket/handlers/READY');

Object.assign(handlers, {
  READY: function ReadyHandler(client: any, packet: any, shard: WebSocketShard) {
    const { d } = packet;
    READY.apply(this, [client, packet, {checkReady: () => {}}]);
    client.user.settings = d.user_settings ? new ClientUserSettings(client.user, d.user_settings) : null;
    for (const privateDM of d.private_channels) {
      client.channels.add(privateDM);
    }
    // @ts-ignore
    shard.checkReady();
  },
  USER_SETTINGS_UPDATE: function UserSettingsUpdateHandler(client: any, packet: any) {
    client.user.settings._patch(packet.d);
    client.actions.UserSettingsUpdate.handle(packet.d);
  }
});