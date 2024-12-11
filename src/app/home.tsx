import { Categories, CategoriesProps } from "@/components/categories";
import { api } from "@/services/api";
import { useEffect, useState } from "react";
import { View, Alert } from "react-native";

export default function Home() {
    const [categories, setCategories] = useState<CategoriesProps[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>("");

    async function fetchCategories() {
        try {
           const { data } = await api.get("/categories");
           setCategories(data)
           setSelectedCategory(data[0].id)
        } catch (error) {
            console.log(error);
            Alert.alert("Erro ao buscar categorias");
        }
    }

    useEffect(() => {
        fetchCategories();
    }, [])

    return (
        <View style={{flex: 1}}>
           <Categories data={categories} onSelect={setSelectedCategory} selected={selectedCategory}/>
        </View>
    )
}