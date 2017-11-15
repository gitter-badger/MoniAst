import { BRIDGE_START, BRIDGE_STOP, LOAD_ALL_CHANNELS, START, SUCCESS, FAIL, NEW_CHANNEL, REMOVE_CHANNEL } from '../constants';

const API_URL = 'http://93.89.215.83:3001/api';

export function loadChannels() {
  return {
    type: LOAD_ALL_CHANNELS,
    callAPI: `${API_URL}/channels`,
    needAuth: true
  }
}

export function newChannel(channel) {
  // console.log('--- ACTION new CHANNEL', channel);
  return {
    type: NEW_CHANNEL,
    payload: {channel},
    needAuth: true
  }
}

export function removeChannel(id) {
  // console.log('---removeChannel', id);
  return {
    type: REMOVE_CHANNEL,
    payload: { id },
    needAuth: true
  }
}