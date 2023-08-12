import React from 'react';
import logo from './logo.svg';
import './App.css';
import personalLanguage from './api/personallanguage'
import { getPatients } from './database/patients';
import { useState, useRef, useEffect } from 'react'
import { SynthesizeSpeech, StopSpeech } from './api/speechsynthesis'
//, SpeechPause }


function App() {

  	const [inquiry, setInquiry] = useState('')
	const [answer, setAnswer] = useState('')
	const socketRef = useRef(null)


	// const handleChange = (e) => {
	// 	setInquiry(e.target.value)
	// }
    const handleSubmit = (e) => {
		e.preventDefault()
		if (socketRef.current !== null) {
			socketRef.current.close()
		}
	}

	const playVoice = async (answerPassed) => {
		if(answerPassed.length !== 0){
		StopSpeech();
		await SynthesizeSpeech(answerPassed);
		}
	}

	const stopVoice = async () => {
		StopSpeech();
	}


	const bothFunctions = () => {
		console.log('Both Functions');
		playVoice("Start");
		activateMicrophone();
	}

	const promptGo = () => {
		console.log('Prompt Works');
		const transcript = "How can I fix my bedtime routine?";
		setInquiry(transcript);
		personalLanguage(transcript)
		.then(response => {
			console.log(response);
			setAnswer(response);
			console.log('Within Deepgram:',answer);
		})
		.catch(error => {
			console.error(error);
		});
	
	}

	const promptGoSecond = () => {
		console.log('Prompt Works');
		const transcript = "What should I eat to help with my sleep?";
		setInquiry(transcript);
		personalLanguage(transcript)
		.then(response => {
			console.log(response);
			setAnswer(response);
			console.log('Within Deepgram:',answer);
		})
		.catch(error => {
			console.error(error);
		});
	
	}
	


	useEffect(() => {
		console.log('This is the answer within UseEffect:',answer);
		if (answer !== ''){
			playVoice(answer);
		}
	  }, [answer]);
	
	const activateMicrophone =  ( )  => {
		console.log('Submit')

		navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
			const mediaRecorder = new MediaRecorder(stream)
				

		const socket = new WebSocket('ws://localhost:3002')

		socket.onopen = () => {
			console.log("Event Opener",{ event: 'onopen' })
			mediaRecorder.addEventListener('dataavailable', async (event) => {
				if (event.data.size > 0 && socket.readyState === 1) {
					socket.send(event.data)
				}
			})
			mediaRecorder.start(1000)
		}

		socket.onmessage = (message) => {
			const received = JSON.parse(message.data)
			const transcript = received.channel.alternatives[0].transcript
			if (transcript) {
				console.log(transcript)
				setInquiry(transcript)
          personalLanguage(transcript)
          .then(response => {
            	console.log(response);
            	setAnswer(response);
            	console.log('Within Deepgram:',answer);
            })
            .catch(error => {
            	console.error(error);
            });
			}
	
		}

		socket.onclose = () => {
			console.log({ event: 'onclose' })
		}

		socket.onerror = (error) => {
			console.log({ event: 'onerror', error })
		}

		socketRef.current = socket

	})
  
	}	



  return (
    <div className='App'>
    <div>
    <header className="header text">Transcription</header>
    </div>
    <div className="card ">
         <div className='container'>
      
      
    <div className='journal-body'>
    
            <>
              <div className='description'>
                The transcription from Deepgram API
              </div>
              <form onSubmit={handleSubmit}>
                <textarea
                  className='journal-input'
                  value={inquiry}
                  // onChange={handleChange}
                  readOnly
                />
                <p>Answer is here:</p>
                <textarea
                  className='journal-input'
                  value={answer}
                  readOnly
                />
                <br />
                <button
                  type='submit'
                  className='submit-button'
                  disabled={inquiry.length === 0}>
                  End the Recording
                </button>
    
            <button
              onClick={bothFunctions}
              type='button'
              className='submit-button'>
              Start the recording
            </button>
    
			<button
              onClick={stopVoice}
              type='button'
              className='submit-button'>
              Stop the recording
            </button>
			<button
              onClick={promptGo}
              type='button'
              className='submit-button'>
              Set the prompt
            </button>
			<button
              onClick={promptGoSecond}
              type='button'
              className='submit-button'>
              Second prompt
            </button>
              </form>
            </>
             </div> 
             </div>
             </div>
             </div>
  );
}

export default App;
