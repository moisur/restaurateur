'use client'

import { useState, useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Trash2, Edit, Check } from 'lucide-react'
import { Ingredient, Cocktail } from './types';
import GestionCocktails from './GestionCocktails'
import ListeCocktails from './ListeCocktails'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"



const DEFAULT_MULTIPLIER = 3.5

const FORMATS = {
  beer: { fût: 'Fût', bouteille: 'Bouteille' },
  wine: { verre: 'Verre', bouteille: 'Bouteille' },
  soft: { canette: 'Canette' },
  spirit: { bouteille: 'Bouteille' },
  fruit: { kilo: 'Kilo' },
  juice: { litre: 'Litre' }
}

export default function Component() {
  const [drinkType, setDrinkType] = useState('')
  const [format, setFormat] = useState('')
  const [name, setName] = useState('')
  const [purchasePrice, setPurchasePrice] = useState('')
  const [sellingPriceHalf, setSellingPriceHalf] = useState('')
  const [sellingPricePint, setSellingPricePint] = useState('')
  const [sellingPriceGlass, setSellingPriceGlass] = useState('')
  const [sellingPriceBottle, setSellingPriceBottle] = useState('')
  const [sellingPrice, setSellingPrice] = useState('')
  const [vat, setVat] = useState('20')
  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { id: '1', name: 'Blonde [demi]', type: 'beer', format: 'fût', purchasePrice: 2, sellingPrice: 4, vat: 20, multiplier: 2 },
    { id: '2', name: 'Blonde [pinte]', type: 'beer', format: 'fût', purchasePrice: 4, sellingPrice: 8, vat: 20, multiplier: 2 },
    { id: '3', name: 'Vin rouge [verre]', type: 'wine', format: 'verre', purchasePrice: 1.5, sellingPrice: 5, vat: 20, multiplier: 3.33 },
    { id: '4', name: 'Vin rouge [bouteille]', type: 'wine', format: 'bouteille', purchasePrice: 10, sellingPrice: 30, vat: 20, multiplier: 3 }
  ])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [cocktails, setCocktails] = useState<Cocktail[]>([])

  useEffect(() => {
    if (purchasePrice !== '') {
      if (drinkType === 'beer' && format === 'fût') {
        calculateBeerPrices()
      } else if (drinkType === 'wine') {
        calculateWinePrices()
      } else if (drinkType === 'soft') {
        calculateSoftPrice()
      } else if (drinkType === 'spirit') {
        calculateSpiritPrice()
      } else if (drinkType === 'fruit') {
        calculateFruitPrice()
      } else {
        calculateSellingPrice()
      }
    }
  }, [purchasePrice, vat, drinkType, format])

  const calculateBeerPrices = () => {
    const price = parseFloat(purchasePrice)
    if (!isNaN(price)) {
      const newSellingPriceHalf = price * DEFAULT_MULTIPLIER * 0.25 * (1 + parseFloat(vat) / 100)
      const newSellingPricePint = price * DEFAULT_MULTIPLIER * 0.5 * (1 + parseFloat(vat) / 100)
      setSellingPriceHalf(newSellingPriceHalf.toFixed(2))
      setSellingPricePint(newSellingPricePint.toFixed(2))
    }
  }

  const calculateWinePrices = () => {
    const price = parseFloat(purchasePrice)
    if (!isNaN(price)) {
      const newSellingPriceGlass = price * DEFAULT_MULTIPLIER * 0.125 * (1 + parseFloat(vat) / 100)
      const newSellingPriceBottle = price * DEFAULT_MULTIPLIER * (1 + parseFloat(vat) / 100)
      setSellingPriceGlass(newSellingPriceGlass.toFixed(2))
      setSellingPriceBottle(newSellingPriceBottle.toFixed(2))
    }
  }

  const calculateSoftPrice = () => {
    const price = parseFloat(purchasePrice)
    if (!isNaN(price)) {
      const newSellingPrice = price * DEFAULT_MULTIPLIER * (1 + parseFloat(vat) / 100)
      setSellingPrice(newSellingPrice.toFixed(2))
    }
  }

  const calculateSpiritPrice = () => {
    const price = parseFloat(purchasePrice)
    if (!isNaN(price)) {
      const newSellingPrice = price * DEFAULT_MULTIPLIER * 0.04 * (1 + parseFloat(vat) / 100)
      setSellingPrice(newSellingPrice.toFixed(2))
    }
  }

  const calculateFruitPrice = () => {
    const price = parseFloat(purchasePrice)
    if (!isNaN(price)) {
      const newSellingPrice = price * DEFAULT_MULTIPLIER * 0.1 * (1 + parseFloat(vat) / 100)
      setSellingPrice(newSellingPrice.toFixed(2))
    }
  }

  const calculateSellingPrice = () => {
    const price = parseFloat(purchasePrice)
    if (!isNaN(price)) {
      const newSellingPrice = price * DEFAULT_MULTIPLIER * 0.2 * (1 + parseFloat(vat) / 100)
      setSellingPrice(newSellingPrice.toFixed(2))
    }
  }

  const handleSellingPriceChange = (newPrice: string, type: 'half' | 'pint' | 'glass' | 'bottle' | 'other') => {
    switch (type) {
      case 'half':
        setSellingPriceHalf(newPrice)
        break
      case 'pint':
        setSellingPricePint(newPrice)
        break
      case 'glass':
        setSellingPriceGlass(newPrice)
        break
      case 'bottle':
        setSellingPriceBottle(newPrice)
        break
      default:
        setSellingPrice(newPrice)
    }
  }

  const validateForm = () => {
    if (!name || !purchasePrice || !vat) {
      alert('Veuillez remplir tous les champs requis.')
      return false
    }
    return true
  }

  const handleAddIngredient = () => {
    if (!validateForm()) return

    if (drinkType === 'beer' && format === 'fût') {
      const newIngredientHalf: Ingredient = {
        id: Date.now().toString() + '-half',
        name: `${name} [demi]`,
        type: drinkType,
        format: format,
        purchasePrice: parseFloat(purchasePrice) * 0.25,
        sellingPrice: parseFloat(sellingPriceHalf),
        vat: parseFloat(vat),
        multiplier: DEFAULT_MULTIPLIER
      }
      const newIngredientPint: Ingredient = {
        id: Date.now().toString() + '-pint',
        name: `${name} [pinte]`,
        type: drinkType,
        format: format,
        purchasePrice: parseFloat(purchasePrice) * 0.5,
        sellingPrice: parseFloat(sellingPricePint),
        vat: parseFloat(vat),
        multiplier: DEFAULT_MULTIPLIER
      }
      setIngredients([...ingredients, newIngredientHalf, newIngredientPint])
    } else if (drinkType === 'wine') {
      const newIngredientGlass: Ingredient = {
        id: Date.now().toString() + '-glass',
        name: `${name} [verre]`,
        type: drinkType,
        format: 'verre',
        purchasePrice: parseFloat(purchasePrice) * 0.125,
        sellingPrice: parseFloat(sellingPriceGlass),
        vat: parseFloat(vat),
        multiplier: DEFAULT_MULTIPLIER
      }
      const newIngredientBottle: Ingredient = {
        id: Date.now().toString() + '-bottle',
        name: `${name} [bouteille]`,
        type: drinkType,
        format: 'bouteille',
        purchasePrice: parseFloat(purchasePrice),
        sellingPrice: parseFloat(sellingPriceBottle),
        vat: parseFloat(vat),
        multiplier: DEFAULT_MULTIPLIER
      }
      setIngredients([...ingredients, newIngredientGlass, newIngredientBottle])
    } else {
      const newIngredient: Ingredient = {
        id: Date.now().toString(),
        name,
        type: drinkType,
        format,
        purchasePrice: parseFloat(purchasePrice),
        sellingPrice: parseFloat(sellingPrice),
        vat: parseFloat(vat),
        multiplier: DEFAULT_MULTIPLIER
      }
      setIngredients([...ingredients, newIngredient])
    }
    resetForm()
  }

  const handleEditIngredient = (id: string) => {
    setEditingId(editingId === id ? null : id)
  }

  const handleUpdateIngredient = (id: string, field: string, value: string) => {
    setIngredients(ingredients.map(i => {
      if (i.id === id) {
        return { ...i, [field]: field === 'purchasePrice' || field === 'sellingPrice' || field === 'vat' ? parseFloat(value) : value }
      }
      return i
    }))
  }

  const handleDeleteIngredient = (id: string) => {
    setIngredients(ingredients.filter(i => i.id !== id))
  }

  const resetForm = () => {
    setName('')
    setDrinkType('')
    setFormat('')
    setPurchasePrice('')
    setSellingPrice('')
    setSellingPriceHalf('')
    setSellingPricePint('')
    setSellingPriceGlass('')
    setSellingPriceBottle('')
    setVat('20')
    setEditingId(null)
  }

  const renderDrinkTypeButtons = () => (
    <div className="flex flex-wrap gap-2">
      {[
        { value: 'beer', label: 'Bière' },
        { value: 'wine', label: 'Vin' },
        { value: 'soft', label: 'Soft' },
        { value: 'spirit', label: 'Alcool fort' },
        { value: 'fruit', label: 'Fruit' },
        { value: 'juice', label: 'Jus de fruits' }
      ].map(({ value, label }) => (
        <Button
          key={value}
          variant={drinkType === value ? "default" : "outline"}
          onClick={() => {
            setDrinkType(value)
            setFormat(value === 'wine' || value === 'soft' ? Object.keys(FORMATS[value])[0] : '')
          }}
        >
          {label}
        </Button>
      ))}
    </div>
  )

  const renderFormatButtons = () => (
    <div className="flex space-x-2">
      {Object.entries(FORMATS[drinkType as keyof typeof FORMATS]).map(([key, value]) => (
        <Button
          key={key}
          variant={format === key ? "default" : "outline"}
          onClick={() => setFormat(key)}
        >
          {value}
        </Button>
      ))}
    </div>
  )

  const renderPriceInputs = () => {
    switch (drinkType) {
      case 'beer':
        if (format === 'fût') {
          return (
            <>
              <div>
                <Label htmlFor="half-pint-price">Prix de vente (Demi 25cL)</Label>
                <Input
                  id="half-pint-price"
                  type="number"
                  value={sellingPriceHalf}
                  onChange={(e) => handleSellingPriceChange(e.target.value, 'half')}
                  aria-label="Prix de vente pour un demi de bière"
                />
              </div>
              <div>
                <Label htmlFor="pint-price">Prix de vente (Pinte 50cL)</Label>
                <Input
                  id="pint-price"
                  type="number"
                  value={sellingPricePint}
                  onChange={(e) => handleSellingPriceChange(e.target.value, 'pint')}
                  aria-label="Prix de vente pour une pinte de bière"
                />
              </div>
            </>
          )
        } else if (format === 'bouteille') {
          return (
            <div>
              <Label htmlFor="bottle-price">Prix de vente (Bouteille)</Label>
              <Input
                id="bottle-price"
                type="number"
                value={sellingPrice}
                onChange={(e) => handleSellingPriceChange(e.target.value, 'other')}
                aria-label="Prix de vente pour une bouteille de bière"
              />
            </div>
          )
        }
        return null
      case 'wine':
        return (
          <>
            <div>
              <Label htmlFor="glass-price">Prix de vente (Verre)</Label>
              <Input
                id="glass-price"
                type="number"
                value={sellingPriceGlass}
                onChange={(e) => handleSellingPriceChange(e.target.value, 'glass')}
                aria-label="Prix de vente pour un verre de vin"
              />
            </div>
            <div>
              <Label htmlFor="bottle-price">Prix de vente (Bouteille)</Label>
              <Input
                id="bottle-price"
                type="number"
                value={sellingPriceBottle}
                onChange={(e) => handleSellingPriceChange(e.target.value, 'bottle')}
                aria-label="Prix de vente pour une bouteille de vin"
              />
            </div>
          </>
        )
      case 'soft':
        return (
          <div>
            <Label htmlFor="can-price">Prix de vente (Canette)</Label>
            <Input
              id="can-price"
              type="number"
              value={sellingPrice}
              onChange={(e) => handleSellingPriceChange(e.target.value, 'other')}
              aria-label="Prix de vente pour une canette de soft"
            />
          </div>
        )
      case 'spirit':
        return (
          <div>
            <Label htmlFor="dose-price">Prix de vente (Dose 4cl)</Label>
            <Input
              id="dose-price"
              type="number"
              value={sellingPrice}
              onChange={(e) => handleSellingPriceChange(e.target.value, 'other')}
              aria-label="Prix de vente pour une dose d'alcool fort"
            />
          </div>
        )
      case 'fruit':
        return (
          <div>
            <Label htmlFor="hundred-grams-price">Prix de vente (100g)</Label>
            <Input
              id="hundred-grams-price"
              type="number"
              value={sellingPrice}
              onChange={(e) => handleSellingPriceChange(e.target.value, 'other')}
              aria-label="Prix de vente pour 100g de fruit"
            />
          </div>
        )
      case 'juice':
        return (
          <div>
            <Label htmlFor="glass-price">Prix de vente (Verre 20cl)</Label>
            <Input
              id="glass-price"
              type="number"
              value={sellingPrice}
              onChange={(e) => handleSellingPriceChange(e.target.value, 'other')}
              aria-label="Prix de vente pour un verre de jus de fruits"
            />
          </div>
        )
      default:
        return null
    }
  }

  const getIngredientLabel = () => {
    switch (drinkType) {
      case 'beer': return 'Nom de la bière'
      case 'wine': return 'Nom du vin'
      case 'soft': return 'Nom du soft'
      case 'spirit': return 'Nom de l\'alcool fort'
      case 'fruit': return 'Nom du fruit'
      case 'juice': return 'Nom du jus de fruits'
      default: return 'Nom de l\'ingrédient'
    }
  }

  const renderIngredientsList = () => {
    const groupedIngredients = ingredients.reduce((acc, ingredient) => {
      if (!acc[ingredient.type]) {
        acc[ingredient.type] = []
      }
      acc[ingredient.type].push(ingredient)
      return acc
    }, {} as Record<string, Ingredient[]>)

    return Object.entries(groupedIngredients).map(([type, items]) => (
      <div key={type}>
        <h3 className="text-lg font-semibold mt-4 mb-2">{type.charAt(0).toUpperCase() + type.slice(1)}</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Format</TableHead>
              <TableHead>Prix d'achat</TableHead>
              <TableHead>Prix de vente</TableHead>
              <TableHead>TVA</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((ingredient) => (
              <TableRow key={ingredient.id}>
                <TableCell>
                  {editingId === ingredient.id ? (
                    <Input
                      value={ingredient.name}
                      onChange={(e) => handleUpdateIngredient(ingredient.id, 'name', e.target.value)}
                    />
                  ) : (
                    ingredient.name
                  )}
                </TableCell>
                <TableCell>{FORMATS[ingredient.type as keyof typeof FORMATS][ingredient.format as keyof (typeof FORMATS)[keyof typeof FORMATS]]}</TableCell>
                <TableCell>
                  {editingId === ingredient.id ? (
                    <Input
                      type="number"
                      step="0.01"
                      value={ingredient.purchasePrice}
                      onChange={(e) => handleUpdateIngredient(ingredient.id, 'purchasePrice', e.target.value)}
                    />
                  ) : (
                    `${ingredient.purchasePrice.toFixed(2)} €`
                  )}
                </TableCell>
                <TableCell>
                  {editingId === ingredient.id ? (
                    <Input
                      type="number"
                      step="0.01"
                      value={ingredient.sellingPrice}
                      onChange={(e) => handleUpdateIngredient(ingredient.id, 'sellingPrice', e.target.value)}
                    />
                  ) : (
                    `${ingredient.sellingPrice.toFixed(2)} €`
                  )}
                </TableCell>
                <TableCell>
                  {editingId === ingredient.id ? (
                    <Select
                      value={ingredient.vat.toString()}
                      onValueChange={(value) => handleUpdateIngredient(ingredient.id, 'vat', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5.5">5,5%</SelectItem>
                        <SelectItem value="10">10%</SelectItem>
                        <SelectItem value="20">20%</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    `${ingredient.vat}%`
                  )}
                </TableCell>
                <TableCell>
                  <Button
                    variant={editingId === ingredient.id ? "default" : "ghost"}
                    size="icon"
                    onClick={() => handleEditIngredient(ingredient.id)}
                    aria-label={editingId === ingredient.id ? "Valider les modifications" : "Modifier"}
                  >
                    {editingId === ingredient.id ? <Check className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDeleteIngredient(ingredient.id)} aria-label="Supprimer">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    ))
  }

  return (
    <Tabs defaultValue="add-ingredient" className="w-full max-w-4xl mx-auto" onValueChange={(value) => {
      if (value === 'add-ingredient') resetForm()
    }}>
      <TabsList className="hidden md:grid md:w-full md:grid-cols-4">
          <TabsTrigger value="add-ingredient">Ajout de matière première</TabsTrigger>
          <TabsTrigger value="ingredients-list">Matières premières ajoutées</TabsTrigger>
          <TabsTrigger value="cocktails">Création de cocktails</TabsTrigger>
          <TabsTrigger value="cocktails-list">Liste des cocktails</TabsTrigger>
        </TabsList>
      <TabsContent value="add-ingredient">
        <Card>
          <CardHeader>
            <CardTitle>Ajout de matière première</CardTitle>
            <CardDescription>Ajoutez et gérez vos ingrédients ici.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {renderDrinkTypeButtons()}
            {drinkType && drinkType !== 'wine' && drinkType !== 'soft' && (
              <div>
                <Label>Sélectionnez un format</Label>
                {renderFormatButtons()}
              </div>
            )}
            {(format || drinkType === 'wine' || drinkType === 'soft') && (
              <>
                <div>
                  <Label htmlFor="name">{getIngredientLabel()}</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={`Entrez le nom de ${drinkType === 'beer' ? 'la bière' : 'l\'ingrédient'}`}
                    aria-label={getIngredientLabel()}
                  />
                </div>
                <div className="flex space-x-4">
                  <div className="flex-1">
                    <Label htmlFor="purchase-price">
                      Prix d'achat {drinkType === 'beer' && format === 'fût' ? 'au litre' : 
                                    drinkType === 'spirit' ? 'au litre' :
                                    drinkType === 'fruit' ? 'au kilo' : 'à l\'unité'}
                    </Label>
                    <Input
                      id="purchase-price"
                      type="number"
                      step="0.01"
                      value={purchasePrice}
                      onChange={(e) => setPurchasePrice(e.target.value)}
                      placeholder="Entrez le prix d'achat"
                      aria-label="Prix d'achat"
                    />
                  </div>
                  <div className="w-1/3">
                    <Label htmlFor="vat">TVA</Label>
                    <Select value={vat} onValueChange={setVat}>
                      <SelectTrigger id="vat">
                        <SelectValue placeholder="TVA" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5.5">5,5%</SelectItem>
                        <SelectItem value="10">10%</SelectItem>
                        <SelectItem value="20">20%</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                {renderPriceInputs()}
                <Button onClick={handleAddIngredient}>
                  Ajouter l'ingrédient
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="ingredients-list">
        <Card>
          <CardHeader>
            <CardTitle>Matières premières ajoutées</CardTitle>
            <CardDescription>Liste de tous les ingrédients ajoutés</CardDescription>
          </CardHeader>
          <CardContent>
            {renderIngredientsList()}
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="cocktails">
        <Card>
          <CardHeader>
            <CardTitle>Création de cocktails</CardTitle>
            <CardDescription>Créez vos cocktails ici</CardDescription>
          </CardHeader>
          <CardContent>
            <GestionCocktails 
              ingredients={ingredients} 
              onSaveCocktail={(newCocktail) => setCocktails(prev => [...prev, newCocktail])} 
            />
          </CardContent>
        </Card>
      </TabsContent>      
      <TabsContent value="cocktails-list">
        <Card>
          <CardHeader>
            <CardTitle>Liste des cocktails</CardTitle>
            <CardDescription>Consultez tous les cocktails créés</CardDescription>
          </CardHeader>
          <CardContent>
            <ListeCocktails cocktails={cocktails} />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}