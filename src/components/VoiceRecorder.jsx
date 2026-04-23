import React, { useState, useRef } from 'react';
import { Mic, Square, Send } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';

const VoiceRecorder = ({ onSend }) => {
  const [recording, setRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
        setAudioUrl(URL.createObjectURL(blob));
        chunksRef.current = [];
      };
      mediaRecorderRef.current.start();
      setRecording(true);
    } catch (err) {
      toast.error('Microphone access denied');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && recording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setRecording(false);
    }
  };

  const sendVoice = async () => {
    if (!audioBlob) return;
    const formData = new FormData();
    formData.append('file', audioBlob, 'voice.webm');
    try {
      const res = await api.post('/chats/upload', formData);
      onSend(res.data.fileUrl, 'voice');
      setAudioBlob(null);
      setAudioUrl(null);
    } catch (err) {
      toast.error('Failed to upload voice');
    }
  };

  return (
    <div className="flex items-center gap-2">
      {!audioBlob && (
        <button onClick={recording ? stopRecording : startRecording} className={`p-2 rounded-full ${recording ? 'bg-red-500 animate-pulse' : 'bg-green-500/20'}`}>
          <Mic className="w-5 h-5 text-green-500" />
        </button>
      )}
      {audioBlob && (
        <>
          <audio src={audioUrl} controls className="h-8 w-32" />
          <button onClick={sendVoice} className="bg-green-600 p-1 rounded"><Send className="w-4 h-4" /></button>
          <button onClick={() => { setAudioBlob(null); setAudioUrl(null); }} className="bg-red-600 p-1 rounded"><Square className="w-4 h-4" /></button>
        </>
      )}
    </div>
  );
};
export default VoiceRecorder;