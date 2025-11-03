"use client"

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Edit, Trash } from "lucide-react";
import SideNavbar from "@/components/restaurant/SideNavbar";
import FoodModal from "@/components/restaurant/addFoodModal";
import api from "@/services/api";
import toast from "react-hot-toast";
import { FoodData } from "@/components/restaurant/addFoodModal";

export default function FoodList() {
  const [foods, setFoods] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFood, setEditingFood] = useState<FoodData | null>(null)
  const [formData, setFormData] = useState({
    Restaurant: "",
    name: "",
    price: 0,
    availableQuantity: 0,
    category: "",
    description: "",
    images: [] as string[],
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "price" || name === "availableQuantity" ? Number(value) : value,
    }));
  }

  useEffect(() => {
    async function fetchData() {
      const { data } = await api.get('/restaurant/food/getFoods')
      if (data.success) {
        toast.success(data.message)
        console.log(data.data.image)
        setFoods(data.data)
      } else {
        toast.error(data.message)
      }
    }
    fetchData()
  }, [])

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (files) {
      const imageUrls = Array.from(files).map((file) =>
        URL.createObjectURL(file)
      );
      setFormData((prev) => ({ ...prev, Image: imageUrls }));
    }
  }

  function handleSave(savedFood:FoodData) {
    console.log('savedFood:',savedFood)
    if (editingFood) {
      setFoods((prev) =>
      prev.map((food) =>
        food.id === savedFood.id ? savedFood : food
      )
    );
    } else {
      setFoods((prev) => [...prev, savedFood]);
    }
    setIsModalOpen(false);
    setFormData({
      Restaurant: "",
      name: "",
      price: 0,
      availableQuantity: 0,
      category: "",
      description: "",
      images: [],
    });
  }

  function handleEdit(food: FoodData) {
    setEditingFood(food);
    setIsModalOpen(true);
  }


  function handleDelete(id: string) {
    setFoods((prev) => prev.filter((f) => f.id !== id));
  }

  console.log(foods)
  return (
    <div className="flex min-h-screen bg-gray-50">
      <SideNavbar />
      <div className="flex-1 p-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-semibold">🍴 Food Items</h1>
          <Button onClick={() => {
            setIsModalOpen(true);
            setEditingFood(null);
          }}>
            <Plus className="w-4 h-4 mr-2" /> Add Food
          </Button>
        </div>

        {foods?.length === 0 ? (
          <div className="text-gray-500 text-center mt-16">No food items found.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {foods.map((food) => (
              <Card key={food.id} className="shadow-md">
                <img
                  src={food.images[0]}
                  alt={food.name}
                  className="w-full h-40 object-cover rounded-t-lg"
                />
                <CardContent className="p-4">
                  <h2 className="font-semibold text-lg">{food.name}</h2>
                  <p className="text-gray-600 text-sm">{food.description}</p>
                  <p className="mt-1 font-medium">₹{food.price}</p>
                  <p className="text-xs text-gray-500">{food.category}</p>
                  <p className="text-xs text-gray-500">
                    Qty: {food.availableQuantity}
                  </p>
                  <div className="flex justify-between mt-3">
                    <Button variant="outline" onClick={() => handleEdit(food)}>
                      <Edit className="w-4 h-4 mr-1" /> Edit
                    </Button>
                    <Button variant={food.status ? "default" : "danger"}>
                      {food.status}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <FoodModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
          editingFood={editingFood} // ✅
        />
      </div>
    </div>
  );
}
