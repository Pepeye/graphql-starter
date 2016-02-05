import uuid from 'node-uuid'

let newUUID = uuid.v4()
export let UUID = newUUID

export let RandomBook = {
  uuid: uuid.v4(),
  title: 'JavaScript The Right Way',
  edition: 1,
  description: 'An easy-to-read, quick reference for JS best practices, accepted coding standards, and links around the Web.',
  website: 'http://jstherightway.org/'
}

export let MockBook = {
  uuid: UUID,
  title: 'Speaking JavaScript: An In-Depth Guide for Programmers',
  edition: 1,
  description: 'Like it or not, JavaScript is everywhere these days—from browser to server to mobile—and now you, too, need to learn the language or dive deeper than you have.',
  website: 'http://speakingjs.com/es5/'
}

export let Book1 = {
  title: 'Understanding ECMAScript 6',
  updated_at: 1452973720882,
  website: 'http://leanpub.com/understandinges6/read/',
  description: 'ECMAScript 6 is coming, are you ready? There\'s a lot of new concepts to learn and understand. Get a headstart with this book!',
  edition: 1,
  created_at: 1452973720882,
  uuid: '088d9b8b-42d9-4add-9971-33000302a78c'
}

export let Book2 = {
  title: 'Eloquent JavaScript',
  updated_at: 1452973720882,
  description: 'A book providing an introduction to the JavaScript language and programming in general.',
  edition: 2,
  website: 'http://eloquentjavascript.net',
  created_at: 1452973720882,
  uuid: '50413807-fd56-4b9a-97d2-b7da8d6da416'
}

export const genUUID = () => uuid.v4()
