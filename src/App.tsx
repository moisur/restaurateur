import { useState } from 'react'
import AppGestionRestaurateur from "./components/appgestionrestaurateur/AppGestionRestaurateurs"
import Login from "@/components/component/Login"
import { Button } from './components/ui/button'
import { UserCircle, LogOut } from 'lucide-react'

type User = string | null;

export default function Home() {
  const [user, setUser] = useState<User>(null);

  const handleLogin = (username: string) => {
    setUser(username);
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <div className="min-h-screen bg-background">
      {user ? (
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-primary">Bienvenue, {user}!</h1>
            <Button onClick={handleLogout} variant="outline" className="flex items-center">
              <LogOut className="mr-2 h-4 w-4" />
              Déconnexion
            </Button>
          </div>
          <AppGestionRestaurateur />
        </div>
      ) : (
        <div className="flex items-center justify-center min-h-screen">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <UserCircle className="mx-auto h-12 w-12 text-primary" />
              <h2 className="mt-6 text-3xl font-extrabold text-primary">
                Connexion
              </h2>
            </div>
            <Login onLogin={handleLogin} />
          </div>
        </div>
      )}
    </div>
  )
}