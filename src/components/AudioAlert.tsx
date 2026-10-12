import { AlertTriangle, Volume2, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AudioAlertProps {
  show: boolean;
  level: number;
  onDismiss: () => void;
}

const AudioAlert = ({ show, level, onDismiss }: AudioAlertProps) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-6 max-w-sm w-full mx-4 border-2 border-red-500 animate-in zoom-in-95">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-red-100 dark:bg-red-900/30">
              <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-red-700 dark:text-red-300">
                Alerte Niveau d'eau
              </h3>
              <p className="text-sm text-red-600 dark:text-red-400">
                Niveau critique: {level}%
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onDismiss}
            className="h-8 w-8 text-gray-500 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex items-center gap-3 mb-4 text-red-700 dark:text-red-300">
          <Volume2 className="h-5 w-5 animate-pulse" />
          <span className="text-sm">Alarme audio déclenchée</span>
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Le niveau d'eau dépasse le seuil de 85%. Vérifiez la bonbonne.
        </p>

        <div className="flex gap-2">
          <Button
            variant="outline"
            className="flex-1"
            onClick={onDismiss}
          >
            Fermer
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AudioAlert;