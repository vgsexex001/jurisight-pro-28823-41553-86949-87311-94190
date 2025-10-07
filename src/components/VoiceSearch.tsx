import { useState, useEffect } from 'react';
import { Mic, MicOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface VoiceSearchProps {
  onResult: (transcript: string) => void;
}

export default function VoiceSearch({ onResult }: VoiceSearchProps) {
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = 'pt-BR';

      recognitionInstance.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        onResult(transcript);
        setIsListening(false);
        toast({
          title: "Busca por voz concluída",
          description: `Reconhecido: "${transcript}"`,
        });
      };

      recognitionInstance.onerror = (event: any) => {
        setIsListening(false);
        toast({
          title: "Erro na busca por voz",
          description: "Não foi possível reconhecer a fala. Tente novamente.",
          variant: "destructive",
        });
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
      };

      setRecognition(recognitionInstance);
    }
  }, [onResult, toast]);

  const toggleListening = () => {
    if (!recognition) {
      toast({
        title: "Não suportado",
        description: "Busca por voz não suportada neste navegador",
        variant: "destructive",
      });
      return;
    }

    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      recognition.start();
      setIsListening(true);
      toast({
        title: "Ouvindo...",
        description: "Fale agora sua consulta jurídica",
      });
    }
  };

  return (
    <Button
      onClick={toggleListening}
      variant={isListening ? "destructive" : "outline"}
      className={isListening ? "animate-pulse" : ""}
    >
      {isListening ? (
        <>
          <MicOff className="w-4 h-4 mr-2" />
          Ouvindo...
        </>
      ) : (
        <>
          <Mic className="w-4 h-4 mr-2" />
          Busca por Voz
        </>
      )}
    </Button>
  );
}
