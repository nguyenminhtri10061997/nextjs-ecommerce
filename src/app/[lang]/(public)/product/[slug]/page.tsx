import AppBreadcrumbs from "@/components/customComponents/AppBreadcrumbs"
import {
  Add,
  FavoriteBorder,
  Remove,
  Share,
  ShoppingCart,
  Star,
  StarBorder,
  StarHalf,
} from "@mui/icons-material"
import Image from "next/image"

// Mock Data
const PRODUCT = {
  name: "Premium Minimalist Tee",
  price: 120,
  originalPrice: 160,
  rating: 4.5,
  reviews: 128,
  description:
    "Elevate your everyday style with our Premium Minimalist Tee. Crafted from 100% organic cotton, this t-shirt offers breathable comfort and a tailored fit that looks great on everyone. Perfect for layering or wearing on its own.",
  colors: [
    { name: "Black", value: "#000000" },
    { name: "Olive", value: "#556B2F" },
    { name: "Navy", value: "#000080" },
  ],
  sizes: ["XS", "S", "M", "L", "XL"],
  mainImage: "/",
  images: ["/", "/", "/"],
  slug: "test",
}

export default function ProductPage(
  props: PageProps<"/[lang]/product/[slug]">
) {
  console.log(props)
  const [selectedImage, setSelectedImage] = [1, () => {}]
  const [selectedColor, setSelectedColor] = [PRODUCT.colors[0], () => {}]
  const [selectedSize, setSelectedSize] = ["M", () => {}]
  const [quantity, setQuantity] = [1, () => {}]
  const [activeTab, setActiveTab] = ["details", () => {}]

  const handleQuantityChange = () => {
    console.log(setQuantity)
  }

  // Helper for star rating
  const renderStars = (rating: number) => {
    return (
      <div className="flex text-yellow-400">
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star}>
            {rating >= star ? (
              <Star fontSize="small" />
            ) : rating >= star - 0.5 ? (
              <StarHalf fontSize="small" />
            ) : (
              <StarBorder fontSize="small" />
            )}
          </span>
        ))}
      </div>
    )
  }

  return (
    <div className="app-container py-12 font-sans text-gray-900">
      <AppBreadcrumbs
        segments={[
          { href: "product", title: "Product" },
          { href: PRODUCT.slug, title: PRODUCT.name },
        ]}
      />

      {/* Main Content Grid */}
      <div className="col-start-2 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
        {/* Left Column: Image Gallery */}
        <div className="lg:col-span-7 flex flex-col-reverse lg:flex-row gap-6">
          {/* Thumbnails (Vertical on Desktop, Horizontal on Mobile) */}
          <div className="flex lg:flex-col gap-4 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 scrollbar-hide">
            {PRODUCT.images.map((img, index) => (
              <button
                key={index}
                className={`relative flex-shrink-0 w-20 h-24 lg:w-24 lg:h-32 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                  selectedImage === index
                    ? "border-black ring-1 ring-black/10"
                    : "border-transparent hover:border-gray-200"
                }`}
              >
                <Image
                  src={img}
                  alt={`main Image`}
                  className="w-full h-full object-cover"
                  fill
                />
              </button>
            ))}
          </div>

          {/* Main Image */}
          <div className="flex-1 aspect-[4/5] bg-gray-50 rounded-2xl overflow-hidden relative group">
            <Image
              src={PRODUCT.images[selectedImage]}
              alt={`main Image`}
              className="w-full h-full object-cover"
              fill
            />
            <div className="absolute top-6 right-6 flex flex-col gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <button className="p-3 bg-white/90 hover:bg-white rounded-full shadow-sm backdrop-blur-sm transition-transform hover:scale-110 text-gray-700 hover:text-red-500">
                <FavoriteBorder />
              </button>
              <button className="p-3 bg-white/90 hover:bg-white rounded-full shadow-sm backdrop-blur-sm transition-transform hover:scale-110 text-gray-700 hover:text-blue-500">
                <Share />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Product Details */}
        <div className="lg:col-span-5 flex flex-col">
          <div className="mb-8 border-b border-gray-100 pb-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 bg-black text-white text-xs font-bold uppercase tracking-wider rounded-full">
                Best Seller
              </span>
              <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-bold uppercase tracking-wider rounded-full">
                New
              </span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold tracking-tight mb-4 text-gray-900">
              {PRODUCT.name}
            </h1>

            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-2">
                {renderStars(PRODUCT.rating)}
                <span className="text-sm font-medium text-gray-900">
                  {PRODUCT.rating}
                </span>
              </div>
              <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
              <span className="text-sm text-gray-500 underline decoration-gray-300 underline-offset-4 cursor-pointer hover:text-black hover:decoration-black transition-all">
                {PRODUCT.reviews} Reviews
              </span>
            </div>

            <div className="flex items-baseline gap-4">
              <span className="text-4xl font-bold text-gray-900">
                ${PRODUCT.price}
              </span>
              <span className="text-xl text-gray-400 line-through">
                ${PRODUCT.originalPrice}
              </span>
              <span className="text-sm font-bold text-red-600 bg-red-50 px-2 py-1 rounded">
                Save ${PRODUCT.originalPrice - PRODUCT.price}
              </span>
            </div>
          </div>

          <div className="space-y-8">
            <p className="text-gray-600 leading-relaxed text-lg">
              {PRODUCT.description}
            </p>

            {/* Color Selection */}
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 mb-4">
                Color:{" "}
                <span className="font-normal text-gray-600 ml-1">
                  {selectedColor.name}
                </span>
              </h3>
              <div className="flex gap-4">
                {PRODUCT.colors.map((color) => (
                  <button
                    key={color.name}
                    className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-200 ${
                      selectedColor.name === color.name
                        ? "border-black ring-2 ring-offset-2 ring-black/10"
                        : "border-transparent hover:border-gray-200"
                    }`}
                  >
                    <span
                      className="w-full h-full rounded-full border border-black/5"
                      style={{ backgroundColor: color.value }}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Size Selection */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900">
                  Size
                </h3>
                <button className="text-sm text-gray-500 underline hover:text-black transition-colors">
                  Size Guide
                </button>
              </div>
              <div className="grid grid-cols-5 gap-3">
                {PRODUCT.sizes.map((size) => (
                  <button
                    key={size}
                    className={`h-12 rounded-lg font-medium transition-all duration-200 ${
                      selectedSize === size
                        ? "bg-black text-white shadow-lg scale-105"
                        : "bg-white border border-gray-200 text-gray-900 hover:border-black"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity and Add to Cart */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <div className="flex items-center border border-gray-200 rounded-xl h-14 w-full sm:w-40 bg-gray-50">
                <button
                  disabled={quantity <= 1}
                  className="w-12 h-full flex items-center justify-center text-gray-500 hover:text-black disabled:opacity-30 transition-colors"
                >
                  <Remove fontSize="small" />
                </button>
                <input
                  type="text"
                  value={quantity}
                  readOnly
                  className="w-full text-center font-bold text-lg bg-transparent border-none focus:ring-0 p-0 text-gray-900"
                />
                <button className="w-12 h-full flex items-center justify-center text-gray-500 hover:text-black transition-colors">
                  <Add fontSize="small" />
                </button>
              </div>
              <button className="flex-1 h-14 bg-black hover:bg-gray-900 text-white rounded-xl text-lg font-bold shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-3">
                <ShoppingCart className="w-5 h-5" />
                Add to Cart
              </button>
            </div>

            <div className="flex flex-col gap-3 text-sm text-gray-500 bg-gray-50 p-4 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="font-medium text-gray-900">In Stock</span>
                <span>-</span>
                <span>Ready to ship within 24 hours</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full" />
                <span className="font-medium text-gray-900">Free Shipping</span>
                <span>-</span>
                <span>On all orders over $100</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="col-start-2 mt-24 pt-16">
        <div className="flex gap-8 border-b border-gray-200 mb-8 overflow-x-auto">
          {["details", "reviews", "faqs"].map((tab) => (
            <button
              key={tab}
              className={`pb-4 text-lg font-bold capitalize transition-all duration-200 relative ${
                activeTab === tab
                  ? "text-black"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              {tab === "faqs" ? "FAQs" : tab}
              {activeTab === tab && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-black" />
              )}
            </button>
          ))}
        </div>

        <div className="min-h-[300px]">
          {activeTab === "details" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="col-span-2 space-y-6 text-gray-600 leading-relaxed text-lg">
                <h3 className="text-2xl font-bold text-gray-900">
                  Description
                </h3>
                <p>
                  Experience the perfect blend of style and comfort with our
                  Premium Minimalist Tee. Designed for the modern individual,
                  this piece features a relaxed fit that drapes effortlessly.
                  The fabric is treated with a special enzyme wash for extreme
                  softness and minimal shrinkage.
                </p>
                <p>
                  Made from high-quality, sustainable materials, it stands the
                  test of time both in durability and style. Whether you're
                  heading to a casual meeting or a weekend outing, this tee is
                  your go-to choice.
                </p>
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-black rounded-full" />
                    100% Organic Cotton
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-black rounded-full" />
                    Pre-shrunk fabric
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-black rounded-full" />
                    Reinforced stitching
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-black rounded-full" />
                    Eco-friendly dyes
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 p-8 rounded-2xl h-fit">
                <h3 className="text-xl font-bold mb-6 text-gray-900">
                  Product Specs
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between border-b border-gray-200 pb-3">
                    <span className="text-gray-500">Material</span>
                    <span className="font-medium text-gray-900">
                      Organic Cotton
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-gray-200 pb-3">
                    <span className="text-gray-500">Weight</span>
                    <span className="font-medium text-gray-900">180 GSM</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-200 pb-3">
                    <span className="text-gray-500">Fit</span>
                    <span className="font-medium text-gray-900">
                      Regular Fit
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-gray-200 pb-3">
                    <span className="text-gray-500">Care</span>
                    <span className="font-medium text-gray-900">
                      Machine Wash Cold
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-gray-200 pb-3">
                    <span className="text-gray-500">Origin</span>
                    <span className="font-medium text-gray-900">
                      Made in Portugal
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
          {activeTab === "reviews" && (
            <div className="flex flex-col items-center justify-center py-12 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-400">
                <StarBorder fontSize="large" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                No Reviews Yet
              </h3>
              <p className="text-gray-500 max-w-md mx-auto mb-6">
                Be the first to review this product and let others know what you
                think.
              </p>
              <button className="px-6 py-3 bg-black text-white rounded-lg font-bold hover:bg-gray-800 transition-colors">
                Write a Review
              </button>
            </div>
          )}
          {activeTab === "faqs" && (
            <div className="max-w-3xl mx-auto space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="border border-gray-200 rounded-xl p-6 hover:border-black transition-colors cursor-pointer group"
                >
                  <h4 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    How do I wash this item?
                  </h4>
                  <p className="text-gray-600">
                    We recommend machine washing cold with like colors and
                    tumble drying on low heat. Do not bleach.
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
