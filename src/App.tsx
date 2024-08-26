import { useState } from 'react'
import AppGestionRestaurateur from "./components/appgestionrestaurateur/AppGestionRestaurateurs"
import Login from "@/components/component/Login"
import { Button } from './components/ui/button'
import "./App.css"
import "./index.css"

export default function Home() {
  const [user, setUser] = useState(null);

  const handleLogin = (username) => {
    setUser(username);
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <div>
      {user ? (
        <div>
          <div className="flex justify-between items-center p-4 bg-gray-100">
            <h1 className="text-2xl font-bold">Bienvenue, {user}!</h1>
            <Button onClick={handleLogout} variant="outline">Déconnexion</Button>
          </div>
          <AppGestionRestaurateur />
        </div>
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </div>
  )
}