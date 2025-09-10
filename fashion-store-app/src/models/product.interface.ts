/**
 * Represents a product in the fashion store
 */
export interface Product {
  /** Unique identifier for the product */
  id: number;

  /** Name of the product */
  name: string;

  /** Detailed description of the product */
  description: string | null;

  /** Price of the product */
  price: number;

  /** Current stock quantity */
  stock_quantity: number;

  /** ID of the category this product belongs to */
  category_id: number | null;

  /** URL to the product's main image */
  image_url: string | null;

  /** ID of the user who created this product */
  created_by: number | null;

  /** Timestamp when the product was created */
  created_at: string | null;

  /** ID of the user who last updated this product */
  updated_by: number | null;

  /** Timestamp when the product was last updated */
  updated_at: string | null;
}

/**
 * Interface for creating a new product (omits auto-generated fields)
 */
export interface CreateProductDto
  extends Omit<Product, "id" | "created_at" | "updated_at"> {}

/**
 * Interface for updating an existing product
 */
export interface UpdateProductDto extends Partial<CreateProductDto> {}

/**
 * Interface for product list response with pagination
 */
export interface ProductListResponse {
  /** Array of products */
  data: Product[];

  /** Total number of products matching the query */
  total: number;

  /** Current page number */
  page: number;

  /** Number of items per page */
  limit: number;

  /** Total number of pages */
  totalPages: number;
}

/**
 * Interface for product query parameters
 */
export interface ProductQueryParams {
  /** Page number (1-based) */
  page?: number;

  /** Number of items per page */
  limit?: number;

  /** Search term for product name or description */
  search?: string;

  /** Filter by category ID */
  category_id?: number;

  /** Field to sort by */
  sort_by?: string;

  /** Sort order (asc or desc) */
  order?: "asc" | "desc";
}
