  import React, { useState, useCallback } from 'react'
  import { Button } from "@/components/ui/button"
  import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
  import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
  import { Input } from "@/components/ui/input"
  import { Label } from "@/components/ui/label"
  import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
  import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
  import { ScrollArea } from "@/components/ui/scroll-area"
  import { PlusCircle } from 'lucide-react'

  type BoissonsType = 'Bière' | 'Vin' | 'Soft' | 'Alcool fort' | 'Fruits'

  const TVAOptions = ['5.5%', '10%', '20%']

  interface PrixVente {
    ht: number;
    ttc: number;
  }

  interface Boisson {
    id: string;
    type: BoissonsType;
    nom: string;
    prixAchat: number;
    prixRevientOptions: { [key: string]: number };
    prixVenteOptions: { [key: string]: PrixVente };
    multiplicateur: number;
    tva: string;
    format?: string;
    happyHourPrices: { [key: string]: number };
  }

  type Cocktail = {
    id: string;
    nom: string;
    ingredients: { boisson: Boisson; quantite: number }[];
    prixRevient: number;
    prixVente: { ht: number; ttc: number };
    marge: number;
    tva: string;
  }

  const BoissonForm = ({ type, onSave }: { type: BoissonsType; onSave: (boisson: Boisson) => void }) => {
    const [nom, setNom] = useState('')
    const [format, setFormat] = useState<'fût' | 'bouteille'>('fût')
    const [prixAchat, setPrixAchat] = useState('')
    const [prixRevientOptions, setPrixRevientOptions] = useState<{ [key: string]: number }>({})
    const [prixVenteOptions, setPrixVenteOptions] = useState<{ [key: string]: PrixVente }>({})
    const [multiplicateur, setMultiplicateur] = useState('3.5')
    const [tva, setTva] = useState(TVAOptions[0])
    const [happyHourPrices, setHappyHourPrices] = useState<{ [key: string]: number }>({})

    const calculatePrixRevient = useCallback((prixAchatNum: number) => {
      let options: { [key: string]: number } = {};
      if (type === 'Bière') {
        options = {
          'Demi (25cl)': prixAchatNum * 0.25,
          'Pinte (50cl)': prixAchatNum * 0.5
        };
      } else if (type === 'Vin') {
        options = {
          'Verre (12.5cl)': prixAchatNum * 0.125,
          'Bouteille (75cl)': prixAchatNum * 0.75
        };
      } else if (type === 'Soft') {
        options = {
          'Verre (25cl)': prixAchatNum * 0.25,
          'Bouteille (33cl)': prixAchatNum * 0.33
        };
      } else {
        options = { 'Unité': prixAchatNum };
      }
      return options;
    }, [type]);

    const calculatePrixVente = useCallback((prixRevientOptions: { [key: string]: number }, multiplicateurNum: number, tvaNum: number) => {
      return Object.entries(prixRevientOptions).reduce((acc, [key, prixRevient]) => {
        const prixVenteHT = prixRevient * multiplicateurNum;
        const prixVenteTTC = prixVenteHT * (1 + tvaNum / 100);
        acc[key] = { ht: prixVenteHT, ttc: prixVenteTTC };
        return acc;
      }, {} as { [key: string]: PrixVente });
    }, []);

    const handlePrixAchatChange = useCallback((value: string) => {
      setPrixAchat(value);
      const prixAchatNum = parseFloat(value);
      if (!isNaN(prixAchatNum) && prixAchatNum > 0) {
        const newPrixRevientOptions = calculatePrixRevient(prixAchatNum);
        setPrixRevientOptions(newPrixRevientOptions);
        const tvaNum = parseFloat(tva);
        const multiplicateurNum = parseFloat(multiplicateur);
        const newPrixVenteOptions = calculatePrixVente(newPrixRevientOptions, multiplicateurNum, tvaNum);
        setPrixVenteOptions(newPrixVenteOptions);
      }
    }, [calculatePrixRevient, calculatePrixVente, multiplicateur, tva]);

    const handleMultiplicateurChange = useCallback((value: string) => {
      setMultiplicateur(value);
      const multiplicateurNum = parseFloat(value);
      const tvaNum = parseFloat(tva);
      if (!isNaN(multiplicateurNum) && multiplicateurNum > 0) {
        const newPrixVenteOptions = calculatePrixVente(prixRevientOptions, multiplicateurNum, tvaNum);
        setPrixVenteOptions(newPrixVenteOptions);
      }
    }, [calculatePrixVente, prixRevientOptions, tva]);

    const handleTVAChange = useCallback((value: string) => {
      setTva(value);
      const tvaNum = parseFloat(value);
      const multiplicateurNum = parseFloat(multiplicateur);
      if (!isNaN(tvaNum)) {
        const newPrixVenteOptions = calculatePrixVente(prixRevientOptions, multiplicateurNum, tvaNum);
        setPrixVenteOptions(newPrixVenteOptions);
      }
    }, [calculatePrixVente, prixRevientOptions, multiplicateur]);

    const handlePrixVenteTTCChange = useCallback((key: string, value: string) => {
      const prixVenteTTC = parseFloat(value);
      if (!isNaN(prixVenteTTC) && prixVenteTTC > 0) {
        const tvaNum = parseFloat(tva);
        const prixVenteHT = prixVenteTTC / (1 + tvaNum / 100);
        const prixRevient = prixRevientOptions[key];
        const newMultiplicateur = prixVenteHT / prixRevient;

        setMultiplicateur(newMultiplicateur.toFixed(2));
        setPrixVenteOptions(prev => ({
          ...prev,
          [key]: { ht: prixVenteHT, ttc: prixVenteTTC }
        }));

        const newPrixVenteOptions = calculatePrixVente(prixRevientOptions, newMultiplicateur, tvaNum);
        setPrixVenteOptions(newPrixVenteOptions);
      }
    }, [tva, prixRevientOptions, calculatePrixVente]);

    const handleHappyHourPriceChange = useCallback((key: string, value: string) => {
      const happyHourPrice = parseFloat(value);
      if (!isNaN(happyHourPrice) && happyHourPrice > 0) {
        setHappyHourPrices(prev => ({
          ...prev,
          [key]: happyHourPrice
        }));
      }
    }, []);

    const handleSave = () => {
      const newBoisson: Boisson = {
        id: Date.now().toString(),
        type,
        nom,
        prixAchat: parseFloat(prixAchat),
        prixRevientOptions,
        prixVenteOptions,
        multiplicateur: parseFloat(multiplicateur),
        tva,
        format: type === 'Bière' ? format : undefined,
        happyHourPrices
      };
      onSave(newBoisson);
    };

    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="nom">Nom de la boisson</Label>
          <Input id="nom" value={nom} onChange={(e) => setNom(e.target.value)} />
        </div>

        {type === 'Bière' && (
          <RadioGroup value={format} onValueChange={(value) => setFormat(value as 'fût' | 'bouteille')}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="fût" id="fut" />
              <Label htmlFor="fut">Au fût</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="bouteille" id="bouteille" />
              <Label htmlFor="bouteille">À la bouteille</Label>
            </div>
          </RadioGroup>
        )}
        
        <div className="space-y-2">
          <Label htmlFor="prixAchat">Prix d'achat {type === 'Bière' && format === 'fût' ? 'au litre' : ''}</Label>
          <Input id="prixAchat" value={prixAchat} onChange={(e) => handlePrixAchatChange(e.target.value)} type="number" step="0.01" />
        </div>
        
        <div className="space-y-2">
          <Label>Prix de revient calculé :</Label>
          {Object.entries(prixRevientOptions).map(([key, value]) => (
            <p key={key}>{key} : {value.toFixed(2)}€</p>
          ))}
        </div>
        
        <div className="space-y-2">
          <Label>Prix de vente calculé :</Label>
          {Object.entries(prixVenteOptions).map(([key, value]) => (
            <div key={key} className="flex items-center space-x-2">
              <span>{key} :</span>
              <Input
                value={value.ttc.toFixed(2)}
                onChange={(e) => handlePrixVenteTTCChange(key, e.target.value)}
                type="number"
                step="0.01"
                className="w-24"
              />
              <span>€ TTC / {value.ht.toFixed(2)}€ HT</span>
            </div>
          ))}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="multiplicateur">Multiplicateur</Label>
          <Input id="multiplicateur" value={multiplicateur} onChange={(e) => handleMultiplicateurChange(e.target.value)} type="number" step="0.1" />
        </div>
        
        <div className="space-y-2">
          <Label>Prix Happy Hour :</Label>
          {Object.keys(prixVenteOptions).map((key) => (
            <div key={key} className="flex items-center space-x-2">
              <span>{key} :</span>
              <Input
                value={happyHourPrices[key] || ''}
                onChange={(e) => handleHappyHourPriceChange(key, e.target.value)}
                type="number"
                step="0.01"
                className="w-24"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleHappyHourPriceChange(key, prixVenteOptions[key].ttc.toFixed(2))}
              >
                <PlusCircle className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
        
        <Select value={tva} onValueChange={handleTVAChange}>
          <SelectTrigger>
            <SelectValue placeholder="Sélectionnez la TVA" />
          </SelectTrigger>
          <SelectContent>
            {TVAOptions.map((option) => (
              <SelectItem key={option} value={option}>{option}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button onClick={handleSave}>Enregistrer</Button>
      </div>
    )
  }


  const CocktailCreator = ({ boissons, tva }: { boissons: Boisson[]; tva: string }) => {
    const [cocktailNom, setCocktailNom] = useState('')
    const [selectedIngredients, setSelectedIngredients] = useState<{ boisson: Boisson; quantite: number }[]>([])
    const [cocktails, setCocktails] = useState<Cocktail[]>([])
    const [prixVenteTTC, setPrixVenteTTC] = useState<number | null>(null)

    const handleAddIngredient = (boisson: Boisson) => {
      setSelectedIngredients(prev => [...prev, { boisson, quantite: 0 }])
    }

    const handleQuantityChange = (index: number, quantite: number) => {
      setSelectedIngredients(prev => 
        prev.map((item, i) => i === index ? { ...item, quantite } : item)
      )
    }

    const calculateCocktail = useCallback(() => {
      const prixRevient = selectedIngredients.reduce((total, { boisson, quantite }) => {
        const prixRevientLitre = boisson.prixAchat / (boisson.type === 'Bière' ? 1 : 0.75) // Conversion en prix par litre
        return total + (prixRevientLitre * quantite / 100) // Conversion de cL en L
      }, 0)

      const tvaNum = parseFloat(tva)
      let prixVenteHT = prixVenteTTC ? prixVenteTTC / (1 + tvaNum / 100) : prixRevient * 3.5
      let prixVenteTTCCalculated = prixVenteTTC || prixVenteHT * (1 + tvaNum / 100)

      const marge = ((prixVenteHT - prixRevient) / prixVenteHT) * 100

      return {
        prixRevient,
        prixVente: { ht: prixVenteHT, ttc: prixVenteTTCCalculated },
        marge
      }
    }, [selectedIngredients, tva, prixVenteTTC])

    const handleSaveCocktail = () => {
      const { prixRevient, prixVente, marge } = calculateCocktail()
      const newCocktail: Cocktail = {
        id: Date.now().toString(),
        nom: cocktailNom,
        ingredients: selectedIngredients,
        prixRevient,
        prixVente,
        marge,
        tva
      }
      setCocktails(prev => [...prev, newCocktail])
      // Réinitialiser le formulaire
      setCocktailNom('')
      setSelectedIngredients([])
      setPrixVenteTTC(null)
    }

    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="cocktailNom">Nom du cocktail</Label>
          <Input id="cocktailNom" value={cocktailNom} onChange={(e) => setCocktailNom(e.target.value)} />
        </div>

        <div className="space-y-2">
          <Label>Ingrédients</Label>
          <div className="flex flex-wrap gap-2">
            {boissons.map(boisson => (
              <Button key={boisson.id} onClick={() => handleAddIngredient(boisson)} variant="outline">
                {boisson.nom}
              </Button>
            ))}
          </div>
        </div>

        {selectedIngredients.length > 0 && (
          <div className="space-y-2">
            <Label>Quantités (en cL)</Label>
            {selectedIngredients.map((item, index) => (
              <div key={index} className="flex items-center space-x-2">
                <span>{item.boisson.nom}:</span>
                <Input
                  type="number"
                  value={item.quantite}
                  onChange={(e) => handleQuantityChange(index, Number(e.target.value))}
                  className="w-20"
                />
                <span>cL</span>
              </div>
            ))}
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="prixVenteTTC">Prix de vente TTC</Label>
          <Input
            id="prixVenteTTC"
            type="number"
            value={prixVenteTTC || ''}
            onChange={(e) => setPrixVenteTTC(Number(e.target.value))}
            step="0.01"
            className="w-32"
          />
        </div>

        <Button onClick={handleSaveCocktail}>Ajouter le cocktail</Button>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Cocktails créés</h3>
          <ScrollArea className="h-[300px] rounded-md border p-4">
            {cocktails.map(cocktail => (
              <Card key={cocktail.id} className="mb-4">
                <CardContent className="pt-6">
                  <h4 className="font-bold text-lg">{cocktail.nom}</h4>
                  <div className="mt-2">
                    <strong>Ingrédients:</strong>
                    <ul className="list-disc list-inside">
                      {cocktail.ingredients.map((i, index) => (
                        <li key={index}>{i.boisson.nom} ({i.quantite}cL)</li>
                      ))}
                    </ul>
                  </div>
                  <p><strong>Prix de revient:</strong> {cocktail.prixRevient.toFixed(2)}€</p>
                  <p><strong>Prix de vente HT:</strong> {cocktail.prixVente.ht.toFixed(2)}€</p>
                  <p><strong>Prix de vente TTC:</strong> {cocktail.prixVente.ttc.toFixed(2)}€</p>
                  <p><strong>Marge:</strong> {cocktail.marge.toFixed(2)}%</p>
                  <p><strong>TVA:</strong> {cocktail.tva}</p>
                </CardContent>
              </Card>
            ))}
          </ScrollArea>
        </div>
      </div>
    )
  }

  export default function AppGestionRestaurateur() {
    const [selectedType, setSelectedType] = useState<BoissonsType | null>(null)
    const [boissons, setBoissons] = useState<Boisson[]>([])

    const handleSaveBoisson = (newBoisson: Boisson) => {
      setBoissons(prevBoissons => [...prevBoissons, newBoisson])
      setSelectedType(null)
    }

    const renderBoissonsList = (type: BoissonsType) => {
      const filteredBoissons = boissons.filter(boisson => boisson.type === type)
      return (
        <div className="space-y-4">
          {filteredBoissons.map(boisson => (
            <Card key={boisson.id}>
              <CardContent className="pt-6">
                <h3 className="font-bold">{boisson.nom}</h3>
                <p>Prix d'achat: {boisson.prixAchat.toFixed(2)}€</p>
                {Object.entries(boisson.prixRevientOptions).map(([key, value]) => (
                  <p key={key}>Prix de revient {key}: {value.toFixed(2)}€</p>
                ))}
                {Object.entries(boisson.prixVenteOptions).map(([key, value]) => (
                  <p key={key}>Prix de vente {key}: {value.ht.toFixed(2)}€ HT / {value.ttc.toFixed(2)}€ TTC</p>
                ))}
                <p>Multiplicateur: {boisson.multiplicateur.toFixed(2)}</p>
                {Object.entries(boisson.happyHourPrices).map(([key, value]) => (
                  <p key={key}>Prix Happy Hour {key}: {value.toFixed(2)}€</p>
                ))}
                <p>TVA: {boisson.tva}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )
    }

    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Gestion des boissons et cocktails</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="ajouter">
            <TabsList>
              <TabsTrigger value="ajouter">Ajouter une boisson</TabsTrigger>
              <TabsTrigger value="menu">Menu des boissons</TabsTrigger>
              <TabsTrigger value="cocktails">Créer des cocktails</TabsTrigger>
            </TabsList>
            <TabsContent value="ajouter">
              <div className="space-y-6">
                <div>
                  <Button onClick={() => setSelectedType(null)}>Ajouter une boisson</Button>
                </div>
                
                {!selectedType ? (
                  <Select onValueChange={(value) => setSelectedType(value as BoissonsType)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choisissez le type de boisson" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Bière">Bière</SelectItem>
                      <SelectItem value="Vin">Vin</SelectItem>
                      <SelectItem value="Soft">Soft</SelectItem>
                      <SelectItem value="Alcool fort">Alcool fort</SelectItem>
                      <SelectItem value="Fruits">Fruits</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">{selectedType}</h3>
                    <BoissonForm type={selectedType} onSave={handleSaveBoisson} />
                    <Button onClick={() => setSelectedType(null)}>Retour</Button>
                  </div>
                )}
              </div>
            </TabsContent>
            <TabsContent value="menu">
              <Tabs defaultValue="Bière">
                <TabsList>
                  <TabsTrigger value="Bière">Bières</TabsTrigger>
                  <TabsTrigger value="Vin">Vins</TabsTrigger>
                  <TabsTrigger value="Soft">Softs</TabsTrigger>
                  <TabsTrigger value="Alcool fort">Alcools forts</TabsTrigger>
                  <TabsTrigger value="Fruits">Fruits</TabsTrigger>
                </TabsList>
                <TabsContent value="Bière">{renderBoissonsList('Bière')}</TabsContent>
                <TabsContent value="Vin">{renderBoissonsList('Vin')}</TabsContent>
                <TabsContent value="Soft">{renderBoissonsList('Soft')}</TabsContent>
                <TabsContent value="Alcool fort">{renderBoissonsList('Alcool fort')}</TabsContent>
                <TabsContent value="Fruits">{renderBoissonsList('Fruits')}</TabsContent>
              </Tabs>
            </TabsContent>
            <TabsContent value="cocktails">
              <CocktailCreator boissons={boissons} tva={TVAOptions[0]} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    )
  }