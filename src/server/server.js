import pkg from '@deepgram/sdk';
import { WebSocketServer } from 'ws';


const { Deepgram } = pkg;

const deepgram = new Deepgram('0ed708e5be41717cb1ed90881560efd0231bbbb6')
const wss = new WebSocketServer({ port: 3002 })

// Open WebSocket connection and initiate live transcription
wss.on('connection', (ws) => {
	const deepgramLive = deepgram.transcription.live({
		interim_results: false,
		punctuate: true,
		endpointing: true,
		vad_turnoff: 500,
	})

	deepgramLive.addListener('open', () => console.log('dg onopen'))
	deepgramLive.addListener('error', (error) => console.log({ error }))

	
	ws.onmessage = (event) => deepgramLive.send(event.data)
	ws.onclose = () => deepgramLive.finish()

	deepgramLive.addListener('transcriptReceived', (data) => ws.send(data))
})