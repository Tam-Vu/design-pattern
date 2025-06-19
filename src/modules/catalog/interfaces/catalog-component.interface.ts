/**
 * CatalogComponent interface - Component interface in the Composite pattern
 * Defines common operations for both leaf and composite objects
 */
export interface CatalogComponent {

  getPrice(): number;

  display(): string;
  getId(): string;

  getName(): string;
}
