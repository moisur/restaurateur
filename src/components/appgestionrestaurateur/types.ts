// types.ts
export interface Ingredient {
    id: string;
    name: string;
    type: string;
    format: string;
    purchasePrice: number;
    sellingPrice: number;
    vat: number;
    multiplier: number;
  }
  
  export interface CocktailIngredient {
    ingredient: Ingredient;
    quantity: number;
  }
  
  export interface Cocktail {
    id: string;
    name: string;
    ingredients: CocktailIngredient[];
    costPrice: number;
    sellingPrice: number;
    vat: number;
  }