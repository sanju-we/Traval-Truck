export const toFoodDTO = (food) => ({
    id: food._id.toString(),
    name: food.Name,
    description: food.Description,
    price: food.Price,
    availableQuantity: food.AvailableQuantity,
    category: food.Category,
    images: food.Image,
    status: food.Status
});
