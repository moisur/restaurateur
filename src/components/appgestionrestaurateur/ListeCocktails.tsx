import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Cocktail } from './types';

interface ListeCocktailsProps {
  cocktails: Cocktail[];
}

export default function ListeCocktails({ cocktails }: ListeCocktailsProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Liste des cocktails</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nom</TableHead>
            <TableHead>Ingrédients</TableHead>
            <TableHead>Coût matière</TableHead>
            <TableHead>Prix de vente TTC</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {cocktails.map(cocktail => (
            <TableRow key={cocktail.id}>
              <TableCell>{cocktail.name}</TableCell>
              <TableCell>
                {cocktail.ingredients.map(({ ingredient, quantity }, index) => (
                  <span key={ingredient.id}>
                    {ingredient.name} ({quantity}cl)
                    {index < cocktail.ingredients.length - 1 ? ', ' : ''}
                  </span>
                ))}
              </TableCell>
              <TableCell>{cocktail.costPrice.toFixed(2)}€</TableCell>
              <TableCell>{cocktail.sellingPrice.toFixed(2)}€</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}