import { Categories, CategoriesProps } from "@/components/categories";
import { PlaceProps } from "@/components/place";
import Places from "@/components/places";
import { api } from "@/services/api";
import { useEffect, useState } from "react";
import { View, Alert, Text } from "react-native";
import MapView, { Callout, Marker } from "react-native-maps";
import { fontFamily, colors } from "@/styles/theme";

import * as Location from 'expo-location';
import { router } from "expo-router";

type MarketProps = PlaceProps & {
    latitude: number;
    longitude: number;
}

const currentLocation = {
   latitude: -23.55995798645581,
   longitude:  -46.65695564300041
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

    async function getCurrentLocation() {
        try {
            const { granted } = await Location.requestForegroundPermissionsAsync();
            if (!granted) {
                Alert.alert("Permissão de localização negada");
                return;
            }
            const location = await Location.getCurrentPositionAsync({});
        } catch (error) {
            console.log(error);
            Alert.alert("Erro ao buscar localização");
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
            <MapView 
                style={{flex: 1}} 
                initialRegion={{ 
                    latitude: currentLocation.latitude, 
                    longitude: currentLocation.longitude,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                }}
            >
                <Marker 
                    identifier="current"
                    coordinate={{
                        latitude: currentLocation.latitude,
                        longitude: currentLocation.longitude,
                    }}   
                    image={require("@/assets/location.png")} 
                />
                {markets.map((market) => (
                    <Marker 
                        key={market.id}
                        coordinate={{
                            latitude: market.latitude,
                            longitude: market.longitude,
                        }}
                        image={require("@/assets/pin.png")}
                    >
                        <Callout
                            onPress={() => router.navigate(`/market/${market.id}`)}
                        >
                            <View>
                                <Text style={{ 
                                    fontSize: 14, 
                                    color: colors.gray[600], 
                                    fontFamily: fontFamily.medium 
                                }}>
                                    {market.name}
                                </Text>
                                <Text style={{ 
                                    fontSize: 12, 
                                    color: colors.gray[600], 
                                    fontFamily: fontFamily.regular 
                                }}>
                                    {market.address}
                                </Text>
                            </View>
                        </Callout>
                    </Marker>
                ))}
            </MapView>
           <Places data={markets}/>
        </View>
    )
}