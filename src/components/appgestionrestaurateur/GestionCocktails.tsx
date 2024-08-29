import { useState, useCallback } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Trash2 } from 'lucide-react'
import { useToast } from "@/components/ui/use-toast"
import { Ingredient, Cocktail } from './types';


const DEFAULT_MULTIPLIER = 3.5
const TVAOptions = ['5.5', '10', '20']

interface GestionCocktailsProps {
  ingredients: Ingredient[];
  onSaveCocktail: (cocktail: Cocktail) => void;
}

export default function GestionCocktails({ ingredients, onSaveCocktail }: GestionCocktailsProps) {
  const [currentCocktail, setCurrentCocktail] = useState<Cocktail>({
    id: '',
    name: '',
    ingredients: [],
    costPrice: 0,
    sellingPrice: 0,
    vat: 20
  })
  const { toast } = useToast()

  const calculateCocktailPrices = useCallback((cocktail: Cocktail) => {
    const costPrice = cocktail.ingredients.reduce((total, { ingredient, quantity }) => {
      return total + (ingredient.purchasePrice * quantity / 100)
    }, 0)
    const sellingPriceHT = costPrice * DEFAULT_MULTIPLIER
    const sellingPriceTTC = sellingPriceHT * (1 + cocktail.vat / 100)
    return { costPrice, sellingPriceTTC }
  }, [])

  const handleAddIngredient = (ingredient: Ingredient, quantity: number) => {
    setCurrentCocktail(prev => {
      const updatedIngredients = [...prev.ingredients, { ingredient, quantity }]
      const updatedCocktail = { ...prev, ingredients: updatedIngredients }
      const { costPrice, sellingPriceTTC } = calculateCocktailPrices(updatedCocktail)
      return { ...updatedCocktail, costPrice, sellingPrice: sellingPriceTTC }
    })
  }

  const handleRemoveIngredient = (ingredientId: string) => {
    setCurrentCocktail(prev => {
      const updatedIngredients = prev.ingredients.filter(i => i.ingredient.id !== ingredientId)
      const updatedCocktail = { ...prev, ingredients: updatedIngredients }
      const { costPrice, sellingPriceTTC } = calculateCocktailPrices(updatedCocktail)
      return { ...updatedCocktail, costPrice, sellingPrice: sellingPriceTTC }
    })
  }

  const handleSaveCocktail = () => {
    if (currentCocktail.name && currentCocktail.ingredients.length > 0) {
      const newCocktail = { ...currentCocktail, id: Date.now().toString() }
      onSaveCocktail(newCocktail)
      setCurrentCocktail({
        id: '',
        name: '',
        ingredients: [],
        costPrice: 0,
        sellingPrice: 0,
        vat: 20
      })
      toast({
        title: "Cocktail créé",
        description: `Le cocktail ${newCocktail.name} a été créé avec succès.`,
      })
    }
  }

  const IngredientSelector = ({ ingredient }: { ingredient: Ingredient }) => {
    const [quantity, setQuantity] = useState('0')

    const handleAdd = () => {
      const quantityNum = parseFloat(quantity)
      if (quantityNum > 0) {
        handleAddIngredient(ingredient, quantityNum)
      }
    }

    const handleAddDose = () => {
      const currentQuantity = parseFloat(quantity) || 0
      setQuantity((currentQuantity + 4).toString())
    }

    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">{ingredient.name}</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Ajouter {ingredient.name}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="quantity" className="text-right">
                Quantité (cl)
              </Label>
              <Input
                id="quantity"
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="col-span-3"
              />
            </div>
            {ingredient.type === 'Alcool fort' && (
              <Button onClick={handleAddDose} variant="outline">
                Ajouter une dose (4cl)
              </Button>
            )}
          </div>
          <Button onClick={handleAdd}>Ajouter à la recette</Button>
        </DialogContent>
      </Dialog>
    )
  }

  const groupedIngredients = ingredients.reduce((acc, ingredient) => {
    if (!acc[ingredient.type]) {
      acc[ingredient.type] = []
    }
    acc[ingredient.type].push(ingredient)
    return acc
  }, {} as Record<string, Ingredient[]>)

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="cocktailName">Nom du cocktail</Label>
        <Input
          id="cocktailName"
          value={currentCocktail.name}
          onChange={(e) => setCurrentCocktail(prev => ({ ...prev, name: e.target.value }))}
        />
      </div>

      <div className="space-y-2">
        <Label>Ingrédients disponibles</Label>
        {Object.entries(groupedIngredients).map(([type, typeIngredients]) => (
          <div key={type} className="space-y-2">
            <h3 className="font-semibold">{type}</h3>
            <div className="flex flex-wrap gap-2">
              {typeIngredients.map(ingredient => (
                <IngredientSelector key={ingredient.id} ingredient={ingredient} />
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-2">
        <Label>Ingrédients sélectionnés</Label>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Quantité (cl)</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentCocktail.ingredients.map(({ ingredient, quantity }) => (
              <TableRow key={ingredient.id}>
                <TableCell>{ingredient.name}</TableCell>
                <TableCell>{quantity} cl</TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveIngredient(ingredient.id)}
                    aria-label="Supprimer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="space-y-2">
        <Label htmlFor="vat">TVA</Label>
        <Select
          value={currentCocktail.vat.toString()}
          onValueChange={(value) => setCurrentCocktail(prev => {
            const updatedCocktail = { ...prev, vat: parseFloat(value) }
            const { costPrice, sellingPriceTTC } = calculateCocktailPrices(updatedCocktail)
            return { ...updatedCocktail, costPrice, sellingPrice: sellingPriceTTC }
          })}
        >
          <SelectTrigger id="vat">
            <SelectValue placeholder="Sélectionnez la TVA" />
          </SelectTrigger>
          <SelectContent>
            {TVAOptions.map((option) => (
              <SelectItem key={option} value={option}>{option}%</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Calculs</Label>
        <div>
          <p>Coût matière: {currentCocktail.costPrice.toFixed(2)}€</p>
          <p>Prix de vente TTC: {currentCocktail.sellingPrice.toFixed(2)}€</p>
        </div>
      </div>

      <Button onClick={handleSaveCocktail}>Enregistrer le cocktail</Button>
    </div>
  )
}