const {
    getProductsByCategoryService,
    getTopBestSellersService,
    getTopMostViewedService,
    incrementViewService,
} = require('../services/productService');

const getProductsByCategory = async (req, res) => {
    const { category = 'all', page = 1, limit = 8 } = req.query;
    const data = await getProductsByCategoryService(category, Number(page), Number(limit));
    return res.status(200).json(data);
};

const getTopBestSellers = async (req, res) => {
    const { limit = 10 } = req.query;
    const data = await getTopBestSellersService(Number(limit));
    return res.status(200).json(data);
};

const getTopMostViewed = async (req, res) => {
    const { limit = 10 } = req.query;
    const data = await getTopMostViewedService(Number(limit));
    return res.status(200).json(data);
};

const incrementView = async (req, res) => {
    const { id } = req.params;
    const data = await incrementViewService(id);
    return res.status(200).json(data);
};

module.exports = {
    getProductsByCategory,
    getTopBestSellers,
    getTopMostViewed,
    incrementView,
};
