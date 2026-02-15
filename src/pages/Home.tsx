import { useState } from "react";
import CardProduct from "../components/CardProduct/CardProduct";
import { useProduct } from "../context/useProduct";
import { FiSearch, FiFilter } from "react-icons/fi";
import { useTranslation } from "../hook/useTranslation";

const Home = () => {
  const { products, productsLoading, error } = useProduct();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("default");
  const { t } = useTranslation();

  // Filter and sort products based on search
  let filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  // Sort products
  if (sortBy === "price-low") {
    filteredProducts = [...filteredProducts].sort(
      (a, b) => (a.discountedPrice || a.price) - (b.discountedPrice || b.price),
    );
  } else if (sortBy === "price-high") {
    filteredProducts = [...filteredProducts].sort(
      (a, b) => (b.discountedPrice || b.price) - (a.discountedPrice || a.price),
    );
  } else if (sortBy === "discount") {
    filteredProducts = [...filteredProducts].sort(
      (a, b) => (b.discountPercentage || 0) - (a.discountPercentage || 0),
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-800 to-indigo-800 text-white rounded-2xl overflow-hidden mb-8 mt-6">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative px-6 py-16 md:py-24 lg:py-10">
          <div className="max-w-5xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 leading-tight">
              {t.hero.title}
            </h1>
            <p className="text-lg md:text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              {t.hero.subtitle}
            </p>

            {/* Search Bar in Hero */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
                <input
                  type="text"
                  placeholder={t.searchPlaceholder}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-blue-300 shadow-lg text-base md:text-lg"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full translate-y-48 -translate-x-48"></div>
      </section>

      {/* Filters Section */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-2">
            <FiFilter className="text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-700">
              {filteredProducts.length}{" "}
              {filteredProducts.length === 1 ? t.product : t.products}
            </h2>
          </div>

          {/* Sort Options */}
          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-gray-600">
              {t.sortBy}
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option value="default">{t.sortDefault}</option>
              <option value="price-low">{t.sortPriceLow}</option>
              <option value="price-high">{t.sortPriceHigh}</option>
              <option value="discount">{t.sortDiscount}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="pb-8">
        {productsLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <span className="loading loading-spinner loading-lg text-blue-600"></span>
            <p className="mt-4 text-gray-600 font-medium">
              {t.loadingProducts}
            </p>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
              <span className="text-3xl">⚠️</span>
            </div>
            <p className="text-xl font-semibold text-gray-800 mb-2">
              {t.errorLoading}
            </p>
            <p className="text-gray-600">{t.tryAgain}</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <span className="text-3xl">🔍</span>
            </div>
            <p className="text-xl font-semibold text-gray-800 mb-2">
              {t.noProductsFound}
            </p>
            <p className="text-gray-600">{t.adjustFilters}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center">
            {filteredProducts.map((product) => (
              <CardProduct product={product} key={product._id} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
