import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Loader2 } from 'lucide-react';

interface VoiceInputProps {
  onTranscript: (text: string) => void;
  placeholder?: string;
  className?: string;
}

export const VoiceInput: React.FC<VoiceInputProps> = ({ onTranscript, placeholder = 'Voice input' }) => {
  const [isListening, setIsListening] = useState(false);
  const [supported, setSupported] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      setSupported(true);
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-KE'; // Kenyan English

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          onTranscript(transcript);
        }
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, [onTranscript]);

  const toggleListening = () => {
    if (!supported) {
      // Fallback: prompt for text simulation
      const text = window.prompt('Voice Recognition not supported in this browser. Enter voice transcript:');
      if (text) onTranscript(text);
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current?.start();
      } catch {
        setIsListening(false);
      }
    }
  };

  return (
    <button
      type="button"
      onClick={toggleListening}
      title={isListening ? 'Listening... click to stop' : 'Click to dictate (Voice-to-Text)'}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '32px',
        height: '32px',
        borderRadius: '8px',
        background: isListening ? '#dc2626' : '#1e293b',
        border: `1px solid ${isListening ? '#ef4444' : '#334155'}`,
        color: isListening ? '#ffffff' : '#94a3b8',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
      }}
    >
      {isListening ? (
        <MicOff size={15} color="#ffffff" />
      ) : (
        <Mic size={15} color="#94a3b8" />
      )}
    </button>
  );
};
