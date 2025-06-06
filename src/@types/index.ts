export interface Product {
  id: number;
  name: string;
  slug: string;
  permalink: string;
  date_created: Date;
  date_created_gmt: Date;
  date_modified: Date;
  date_modified_gmt: Date;
  type: "simple" | "variable" | "grouped" | "external";
  status: "any" | "draft" | "pending" | "private" | "publish";
  featured: boolean;
  catalog_visibility: "visible" | "catalog" | "search" | "hidden";
  description: string;
  short_description: string;
  sku: string;
  price: string;
  regular_price: string;
  sale_price: string;
  date_on_sale_from: Date | null;
  date_on_sale_from_gmt: Date | null;
  date_on_sale_to: Date | null;
  date_on_sale_to_gmt: Date | null;
  price_html: string;
  on_sale: boolean;
  purchasable: boolean;
  total_sales: number;
  virtual: boolean;
  downloadable: boolean;
  downloads: Download[];
  download_limit: number;
  download_expiry: number;
  external_url: string;
  button_text: string;
  tax_status: "taxable" | "shipping" | "none";
  tax_class: "standard" | "reduced-rate" | "zero-rate";
  manage_stock: boolean;
  stock_quantity: number | null;
  stock_status: "instock" | "outofstock" | "onbackorder";
  backorders: "no" | "notify" | "yes";
  backorders_allowed: boolean;
  backordered: boolean;
  sold_individually: boolean;
  weight: string;
  dimensions: Dimensions;
  shipping_required: boolean;
  shipping_taxable: boolean;
  shipping_class: string;
  shipping_class_id: number;
  reviews_allowed: boolean;
  average_rating: string;
  rating_count: number;
  related_ids: number[];
  upsell_ids: number[];
  cross_sell_ids: number[];
  parent_id: number;
  purchase_note: string;
  categories: Category[];
  tags: Tag[];
  images: Image[];
  attributes: Attribute[];
  default_attributes: Attribute[];
  variations: number[];
  grouped_products: number[];
  menu_order: number;
  meta_data: MetaData[];
  _links: Links;
  brand?: Brand;
}

export interface Brand {
  id: number;
  name: string;
  slug: string;
  description?: string;
  image?: Image;
  menu_order?: number;
  count?: number;
  _links?: Links;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  parent: number;
  description: string;
  display: string;
  image: Image;
  menu_order: number;
  count: number;
  _links: Links;
}

export interface Tag {
  id: number;
  name: string;
  slug: string;
  description: string;
}

export interface Dimensions {
  length: string;
  width: string;
  height: string;
}

export interface Download {
  id: string;
  name: string;
  file: string;
}

export interface MetaData {
  id: number;
  key: string;
  value: string;
}

export interface Image {
  id: number;
  date_created: Date;
  date_created_gmt: Date;
  date_modified: Date;
  date_modified_gmt: Date;
  src: string;
  name: string;
  alt: string;
  position: number;
}

export interface Attribute {
  id: number;
  name: string;
  option: string;
}

export interface Links {
  self: Link[];
  collection: Link[];
  up?: Link[];
}

export interface Link {
  href: string;
}

export interface Cart {
  payment_method: string;
  payment_method_title: string;
  billing: Billing;
  shipping: Shipping;
  line_items: LineItem[];
  shipping_lines: ShippingLine[];
  customer_id: number;
  meta_data: MetaDataLineItem[];
  set_paid: boolean;
}

export interface LineItem {
  id: number;
  name: string;
  product_id: number;
  variation_id: number;
  quantity: number;
  tax_class: string;
  subtotal: string;
  subtotal_tax: string;
  total: string;
  total_tax: string;
  taxes: Tax[];
  meta_data: MetaData[];
  sku: string;
  price: number;
}

export interface ShippingLine {
  id: number;
  method_title: string;
  method_id: string;
  instance_id: string;
  total: string;
  total_tax: string;
  taxes: Tax[];
  meta_data: MetaData[];
}

export interface Tax {
  id: number;
  total: string;
  subtotal: string;
}

export interface MetaDataLineItem {
  key: string;
  value: string | number | boolean | object;
}

export interface Order {
  id: number;
  order_number: number;
  updated_at: string;
  created_at: string;
  completed_at: string;
  status: string;
  currency: string;
  total: string;
  subtotal: string;
  total_line_items_quantity: number;
  total_tax: string;
  total_shipping: string;
  cart_tax: string;
  shipping_tax: string;
  total_discount: string;
  shipping_methods: string;
  payment_details: PaymentDetail[];
  billing_address: Billing[];
  shipping_address: Shipping[];
  note: string;
  customer_ip: string;
  customer_user_agent: string;
  customer_id: number;
  view_order_url: string;
  line_items: LineItem[];
  shipping_lines: ShippingLine[];
  tax_lines: Tax[];
  fee_lines: FeeLine[];
  coupon_lines: Coupon[];
  customer: Customer[];
}

export interface Billing {
  first_name: string;
  last_name: string;
  company: string;
  address_1: string;
  address_2: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
  email: string;
  phone: string;
}

export interface Shipping {
  first_name: string;
  last_name: string;
  company: string;
  address_1: string;
  address_2: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
  email: string;
}

export interface Variation {
  id: number;
  date_created: Date;
  date_created_gmt: Date;
  date_modified: Date;
  date_modified_gmt: Date;
  description: string;
  permalink: string;
  sku: string;
  price: string;
  regular_price: string;
  sale_price: string;
  date_on_sale_from?: Date | null;
  date_on_sale_from_gmt?: Date | null;
  date_on_sale_to?: Date | null;
  date_on_sale_to_gmt?: Date | null;
  on_sale: boolean;
  visible: boolean;
  purchasable: boolean;
  virtual: boolean;
  downloadable: boolean;
  downloads: Download[];
  download_limit: number;
  download_expiry: number;
  tax_status: string;
  tax_class: string;
  manage_stock: boolean;
  stock_quantity?: number | null;
  in_stock: boolean;
  backorders: string;
  backorders_allowed: boolean;
  backordered: boolean;
  weight: string;
  dimensions: Dimensions;
  shipping_class: string;
  shipping_class_id: number;
  image: Image;
  attributes: Attribute[];
  menu_order: number;
  meta_data: MetaData[];
  _links: Links;
}

export interface Customer {
  id: number;
  username: string;
  password: string;
  date_created: Date;
  date_created_gmt: Date;
  date_modified: Date;
  date_modified_gmt: Date;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  billing: Billing;
  shipping: Shipping;
  is_paying_customer: boolean;
  avatar_url: string;
  meta_data: MetaData[];
  _links: Links;
}

export interface FeeLine {
  id: number;
  name: string;
  tax_class: string;
  tax_status: string;
  total: string;
  total_tax: string;
  taxes: Tax[];
  meta_data: MetaData[];
}

export interface Coupon {
  id: number;
  code: string;
  discount: string;
  discount_tax: string;
  meta_data: MetaData[];
}

export interface PaymentDetail {
  method_id: string;
  method_title: string;
  paid: boolean;
  transaction_id?: string;
  [key: string]: string | number | boolean | undefined;
}

export interface Refund {
  id: number;
  reason: string;
  total: string;
}

export interface CheckoutCart {
  payment_method: string;
  payment_method_title: string;
  billing: Billing;
  shipping: Shipping;
  line_items: CheckoutLineItem[];
  shipping_lines?: ShippingLineInput[];
  customer_id?: number;
  meta_data?: MetaDataLineItem[];
  set_paid: boolean;
}

export interface CheckoutLineItem {
  product_id: number;
  variation_id?: number;
  quantity: number;
}

export interface ShippingLineInput {
  method_id: string;
  method_title: string;
  total: string;
  total_tax?: string;
  taxes?: Tax[];
  meta_data?: MetaData[];
}

// OAuth Parameters Interface
export interface OAuthParams {
  oauth_consumer_key: string;
  oauth_nonce: string;
  oauth_signature_method: string;
  oauth_timestamp: number;
  oauth_version: string;
  oauth_signature: string;
}

// User Registration Interface
export interface UserRegistrationData {
  username: string;
  email: string;
  password: string;
  first_name?: string;
  last_name?: string;
  role?: string;
}

// User Login Interface
export interface UserLoginData {
  username: string;
  password: string;
}

// JWT Token Response Interface
export interface JWTTokenResponse {
  token: string;
  user_email: string;
  user_nicename: string;
  user_display_name: string;
}

// Cart Item Interface (for localStorage)
export interface CartItem {
  id: number;
  quantity: number;
  name?: string;
  price?: string;
  image?: string;
}
