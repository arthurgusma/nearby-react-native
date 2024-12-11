import { Categories, CategoriesProps } from "@/components/categories";
import { PlaceProps } from "@/components/place";
import Places from "@/components/places";
import { api } from "@/services/api";
import { useEffect, useState } from "react";
import { View, Alert } from "react-native";

type MarketProps = PlaceProps & {

}

export default function Home() {
    const [categories, setCategories] = useState<CategoriesProps[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>("");
    const [markets, setMarkets] = useState<MarketProps[]>([]);

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

    async function fetchMarkets() {
        try {
            if (!selectedCategory) {
                return;
            }
            const { data } = await api.get("/markets/category/" + selectedCategory)  
            setMarkets(data);
        } catch (error) {
            console.log(error);
            Alert.alert("Erro ao buscar locais");
        }
    }

    useEffect(() => {
        fetchCategories();
    }, [])

    useEffect(() => {
        fetchMarkets()
    }, [selectedCategory])

    return (
        <View style={{flex: 1, backgroundColor: "#CECECE"}}>
           <Categories 
                data={categories} 
                onSelect={setSelectedCategory} 
                selected={selectedCategory}
            />
           <Places data={markets}/>
        </View>
    )
}