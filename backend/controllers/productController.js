import asyncHandler from "../middleware/asyncHandler.js";
import Product from "../models/productModel.js";

const getProducts = asyncHandler(async function (req, res) {
  const pageSize = process.env.PAGE_SIZE;
  const page = Number(req.query.pageNumber) || 1;

  let filter = {};

  if (req.query.keyword) {
    filter = {
      name: { $regex: req.query.keyword, $options: "i" },
    };
  } else if (req.query.category) {
    filter = {
      category: req.query.category,
    };
  }

  //Get the total number of products
  const count = await Product.countDocuments(filter);

  const products = await Product.find(filter)
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.json({ products, pages: Math.ceil(count / pageSize) });
});

const getProductById = asyncHandler(async function (req, res) {
  const product = await Product.findById(req.params.id);
  if (product) {
    return res.json(product);
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

const createProduct = asyncHandler(async function (req, res) {
  const product = await Product.create({
    user: req.user._id,
    name: "Sample name",
    brand: "Sample brand",
    category: "Sample category",
    description: "Sample description",
    price: 0,
    image: "/images/sample.jpg",
    countInStock: 0,
    numReviews: 0,
  });

  res.status(201).json(product);
});

//@desc Update a product
//@route PUT /api/products/:id
//@access PRivate/Admin
const editProduct = asyncHandler(async function (req, res) {
  const { name, price, description, image, brand, category, countInStock } =
    req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    product.name = name;
    product.brand = brand;
    product.category = category;
    product.description = description;
    product.price = price;
    product.countInStock = countInStock;
    product.image = image;

    const updatedProduct = await product.save();
    res.status(200).json(updatedProduct);
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

//@desc Update a product
//@route DELETE /api/products/:id
//@access PRivate/Admin
const deleteProduct = asyncHandler(async function (req, res) {
  const product = await Product.findById(req.params.id);

  if (product) {
    await Product.deleteOne({ _id: product._id });
    res.status(200).json({ message: "Product deleted" });
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

//@desc Create a new review
//@route POST /api/products/:id/reviews
//@access Private
const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const product = await Product.findById(req.params.id);

  if (product) {
    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      res.status(400);
      throw new Error("Product already reviewed");
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };

    product.reviews.push(review);
    product.numReviews = product.reviews.length;
    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;

    await product.save();
    res.status(201).json({ message: "Review added" });
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

//@desc Get top rated products
//@route GET /api/products/top
//@access public
const getTopProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({}).sort({ rating: -1 }).limit(3);
  res.status(200).json(products);
});

//@desc Add to favourites
//POST /api/products/:id/favourite
//@access private
const addProductToFavourites = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    const alreadyFavourited = product.favouritedBy.some(
      (fav) => fav.user.toString() === req.user._id.toString()
    );
    if (alreadyFavourited) {
      res.status(400);
      throw new Error("Product already in favourites");
    }

    product.favouritedBy.push({
      user: req.user._id,
      name: req.user.name,
    });
    await product.save();
    res.status(201).json({ message: "Added to favourites" });
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

//@desc Remove from favourites
//DELETE /api/products/:id/favourite
//@access private
const removeProductFromFavourites = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    product.favouritedBy = product.favouritedBy.filter(
      (fav) => fav.user.toString() !== req.user._id.toString()
    );
    await product.save();
    res.status(200).json({ message: "Product deleted from favourites" });
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

//@desc Get favourite products
//GET /api/products/favourite
//@access private
const getFavourites = asyncHandler(async (req, res) => {
  const favouriteProducts = await Product.find({
    "favouritedBy.user": req.user._id,
  });
  res.json(favouriteProducts);
});

const getCategories = asyncHandler(async (req, res) => {
  const categories = await Product.distinct("category");
  res.json(categories);
});

const getRelatedProducts = asyncHandler(async (req, res) => {
  const currentProduct = await Product.findById(req.params.id);

  if (currentProduct) {
    const relatedProducts = await Product.find({
      category: currentProduct.category,
      _id: { $ne: req.params.id }, // Exclude current product
    }).limit(3);

    res.json(relatedProducts);
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

export {
  getProducts,
  getProductById,
  createProduct,
  editProduct,
  deleteProduct,
  createProductReview,
  getTopProducts,
  addProductToFavourites,
  removeProductFromFavourites,
  getFavourites,
  getCategories,
  getRelatedProducts,
};
