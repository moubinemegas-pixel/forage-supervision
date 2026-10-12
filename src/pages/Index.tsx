import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Wifi, WifiOff, AlertTriangle } from "lucide-react";
import CircularProgress from "@/components/CircularProgress";
import AudioAlert from "@/components/AudioAlert";
import useWaterLevel from "@/hooks/useWaterLevel";

const Index = () => {
  const [inputUrl, setInputUrl] = useState<string>("");
  const [showAlert, setShowAlert] = useState<boolean>(false);

  const { level, status, error, url, setUrl, connect, disconnect, alertTriggered } =
    useWaterLevel();

  const handleConnect = () => {
    setUrl(inputUrl);
    connect();
  };

  const handleDisconnect = () => {
    disconnect();
    setInputUrl("");
  };

  const handleDismissAlert = () => {
    setShowAlert(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-800 dark:text-blue-300 mb-2">
            Contrôle du Niveau d'Eau
          </h1>
          <p className="text-blue-600 dark:text-blue-400">
            Bonbonne - ESP32 + HSR04
          </p>
        </header>

        <div className="max-w-2xl mx-auto space-y-6">
          {/* Carte de connexion */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wifi className="h-5 w-5" />
                Connexion à l'ESP32
              </CardTitle>
              <CardDescription>
                Connectez-vous au WiFi de l'ESP32, puis entrez son adresse
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="http://192.168.4.1/niv"
                  value={inputUrl}
                  onChange={(e) => setInputUrl(e.target.value)}
                  disabled={status === "connecting" || status === "connected"}
                  className="flex-1"
                />
                {status !== "connected" ? (
                  <Button
                    onClick={handleConnect}
                    disabled={status === "connecting" || !inputUrl}
                  >
                    {status === "connecting" ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Connexion...
                      </>
                    ) : (
                      "Connecter"
                    )}
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    onClick={handleDisconnect}
                  >
                    <WifiOff className="mr-2 h-4 w-4" />
                    Déconnecter
                  </Button>
                )}
              </div>

              {error && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 text-sm">
                  <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Statut:
                </span>
                <Badge
                  variant={
                    status === "connected"
                      ? "default"
                      : status === "connecting"
                      ? "secondary"
                      : status === "error"
                      ? "destructive"
                      : "outline"
                  }
                >
                  {status === "connected" && "Connecté"}
                  {status === "connecting" && "Connexion en cours..."}
                  {status === "error" && "Erreur"}
                  {status === "disconnected" && "Déconnecté"}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Affichage du niveau */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center">
                <CircularProgress percentage={level} size={280} />

                {alertTriggered && (
                  <div className="mt-4 flex items-center gap-2 text-red-600 dark:text-red-400">
                    <AlertTriangle className="h-5 w-5 animate-pulse" />
                    <span className="text-sm font-medium">
                      Alerte : niveau supérieur à 85%
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Informations supplémentaires */}
          <Card>
            <CardHeader>
              <CardTitle>Informations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500 dark:text-gray-400">
                    Adresse :
                  </span>
                  <p className="font-mono text-blue-700 dark:text-blue-300 break-all">
                    {url || "—"}
                  </p>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400">
                    Intervalle de polling :
                  </span>
                  <p className="font-medium text-blue-700 dark:text-blue-300">
                    1 seconde
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <p className="text-center text-xs text-gray-500 dark:text-gray-400">
            Placez le fichier <code className="text-blue-600">alarme_pleine.mp3</code> dans le
            dossier <code className="text-blue-600">public/</code> pour l'alarme audio.
          </p>
        </div>
      </div>

      <AudioAlert
        show={showAlert}
        level={level}
        onDismiss={handleDismissAlert}
      />
    </div>
  );
};

export default Index;