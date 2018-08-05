/* @flow */

export type Event_t = {
  timestamp: Date,
  event: String
}

export type Wiki_t = {
  events: Array<Event_t>
}

export default {
  events: [
    {
      timestamp: Date.now(),
      event: 'Server Created'
    }
  ]
}
