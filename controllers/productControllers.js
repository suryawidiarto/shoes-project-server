const {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} = require("@aws-sdk/client-s3");
const fs = require("fs");
const { promisify } = require("util");
const ProductModel = require("../models/productModel");
const { GenerateIdentifier } = require("../security/identifier");

const unlinkAsync = promisify(fs.unlink);

const bucket = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_BUCKET_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

const client = new S3Client({
  region: region,
  credentials: {
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey,
  },
});

//POST PRODUCT TO AWS AND MONGODB
exports.productPostData = async (req, res, next) => {
  try {
    const image = req.files["image"][0];
    const getImage = fs.createReadStream(image.path);
    const identifier = GenerateIdentifier(12);
    const key = `${identifier}/${image.filename}`;

    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: getImage,
    });

    const responseAWS = await client
      .send(command)
      .then(async (res) => {
        await unlinkAsync(image.path);
        return res["$metadata"].httpStatusCode;
      })
      .catch((err) => console.log(err));

    const Product = new ProductModel({
      name: req.body.name,
      identifier: identifier,
      description: req.body.description,
      price: req.body.price,
      stock: [
        {
          size: 35,
          inStock: req.body.size35,
        },
        {
          size: 36,
          inStock: req.body.size36,
        },
        {
          size: 37,
          inStock: req.body.size37,
        },
        {
          size: 38,
          inStock: req.body.size38,
        },
        {
          size: 39,
          inStock: req.body.size39,
        },
        {
          size: 40,
          inStock: req.body.size40,
        },
        {
          size: 41,
          inStock: req.body.size41,
        },
        {
          size: 42,
          inStock: req.body.size42,
        },
        {
          size: 43,
          inStock: req.body.size43,
        },
      ],
      image: key,
    });

    const responseMONGODB = await Product.save();
    res.status(201).json({ responseAWS: responseAWS, responseMONGODB: responseMONGODB });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error" });
  }
};

//EDIT PRODUCT TO AWS AND MONGODB
exports.productEditData = async (req, res, next) => {
  try {
    let responseAWS = {};

    if (req.files["image"]) {
      const image = req.files["image"][0];
      const getImage = fs.createReadStream(image.path);
      const identifier = GenerateIdentifier(12);
      const key = `${identifier}/${image.filename}`;

      const command = new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: getImage,
      });

      responseAWS = await client
        .send(command)
        .then(async (res) => {
          await unlinkAsync(image.path);
          return {
            statusCode: res["$metadata"].httpStatusCode,
            imageKey: key,
            identifier: identifier,
          };
        })
        .catch((err) => console.log(err));
    }

    const Product = await ProductModel.findById(req.params.productId);

    Product.name = req.body.name || Product.name;
    Product.identifier = responseAWS.identifier || Product.identifier;
    Product.price = req.body.price || Product.price;
    Product.description = req.body.description || Product.description;
    Product.stock[0].inStock = req.body.size35 || Product.stock[0].inStock;
    Product.stock[1].inStock = req.body.size36 || Product.stock[1].inStock;
    Product.stock[2].inStock = req.body.size37 || Product.stock[2].inStock;
    Product.stock[3].inStock = req.body.size38 || Product.stock[3].inStock;
    Product.stock[4].inStock = req.body.size39 || Product.stock[4].inStock;
    Product.stock[5].inStock = req.body.size40 || Product.stock[5].inStock;
    Product.stock[6].inStock = req.body.size41 || Product.stock[6].inStock;
    Product.stock[7].inStock = req.body.size42 || Product.stock[7].inStock;
    Product.stock[8].inStock = req.body.size43 || Product.stock[8].inStock;
    Product.image = responseAWS.imageKey || Product.image[0];

    const responseMONGODB = await Product.save();
    res.status(201).json({ responseAWS: responseAWS, responseMONGODB: responseMONGODB });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error" });
  }
};

//PRODUCT GET ALL DATA MONGODB
exports.productGetAllData = async (req, res, next) => {
  try {
    const product = await ProductModel.find();
    res.status(201).send(product);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error" });
  }
};

exports.productUserGetAllData = async (req, res, next) => {
  try {
    const currentPage = parseInt(req.query.page) || 1;
    const itemPerPage = 8;
    const totalItems = await ProductModel.find().countDocuments();
    const skipData = (currentPage - 1) * itemPerPage;

    const getData = await ProductModel.find().skip(skipData).limit(itemPerPage);

    res.status(201).json({
      items: getData,
      totalItems: totalItems,
      currentPage: currentPage,
      itemPerPage: itemPerPage,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error" });
  }
};

//PRODUCT GET BY ID DATA MONGODB
exports.productGetDataById = async (req, res, next) => {
  try {
    const product = await ProductModel.findById(req.params.productId);
    res.status(201).send(product);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error" });
  }
};

//DELETE PRODUCT BY ID PRODUCT
exports.productDeleteData = async (req, res, next) => {
  try {
    const product = await ProductModel.findById(req.params.productId);

    const command = new DeleteObjectCommand({
      Bucket: bucket,
      Key: product.image[0],
    });

    const responseAWS = await client
      .send(command)
      .then((res) => res["$metadata"].httpStatusCode)
      .catch((err) => console.log(err));

    const responseMONGODB = await ProductModel.deleteOne({ _id: req.params.productId })
      .then((res) => res)
      .catch((err) => console.log(err));

    res.status(201).json({ responseAWS: responseAWS, responseMONGODB: responseMONGODB });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error" });
  }
};

//GET PRODUCT IMAGE
exports.productGetImage = async (req, res, next) => {
  try {
    const identifierKey = req.params.identifierKey;
    const imageKey = req.params.imageKey;

    const command = new GetObjectCommand({
      Bucket: bucket,
      Key: `${identifierKey}/${imageKey}`,
    });

    const image = await client.send(command);
    image.Body.pipe(res);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error" });
  }
};
