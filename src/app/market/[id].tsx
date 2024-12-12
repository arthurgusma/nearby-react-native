import Loading from "@/components/loading";
import Cover from "@/components/market/cover";
import { api } from "@/services/api";
import { Redirect, router, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Alert, View, Modal, StatusBar, ScrollView } from "react-native";
import Details, { PropsDetails } from "@/components/market/details";
import { Coupon } from "@/components/market/coupon";
import { Button } from "@/components/button";
import { useCameraPermissions, CameraView } from "expo-camera";

type MarketProps = PropsDetails & {
    cover: string
}

export default function Market() {
    const params = useLocalSearchParams<{ id: string }>();
    const [market, setMarket] = useState<MarketProps>();
    const [isLoading, setIsLoading] = useState(true);
    const [coupon, setCoupon] = useState<string | null>(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [couponIsFetching, setCouponIsFetching] = useState(false);
    const [_, requestPermission] = useCameraPermissions();

    const qrLock = useRef(false);

    async function fetchMarket() {
        try {
            const { data } = await api.get("/markets/" + params.id);
            setMarket(data);
            setIsLoading(false);
        } catch (error) {
            console.log(error);
            Alert.alert("Erro ao buscar local", "Ocorreu um erro ao buscar o local.", [
                {
                    text: "OK",
                    onPress: () => router.back()
                }
            ]);
        }
    }

    async function handleOpenCamera() {
        try {
            const { granted } = await requestPermission();

            if (!granted) {
                Alert.alert("Câmera", "Permissão de câmera negada");
                return;
            }

            qrLock.current = false;
            setIsModalVisible(true);
        } catch (error) {
            console.log(error);
            Alert.alert("Câmera", "Não foi possível abrir a câmera");
        }
    }

    async function getCoupon(id: string) {
        try {
            setCouponIsFetching(true);
            const { data } = await api.post("/coupons/" + id);

            Alert.alert("Cupom", `Cupom gerado com sucesso: ${data.coupon}`);
            setCoupon(data.coupon);
        } catch (error) {
            console.log(error);
            Alert.alert("Erro", "Ocorreu um erro ao buscar o cupom");
        } finally {
            setCouponIsFetching(false);
        }
    }

    function handleUseCouppon(id: string) {
        setIsModalVisible(false);
        Alert.alert("Cupom", "Não é possível reutilizar um cupom resgatado. Deseja realmente resgatar o cupom?", [
            {
                text: "Cancelar",
                style: "cancel"
            },
            {
                text: "Resgatar",
                onPress: () => getCoupon(id)
            }
        ]);
    }


    useEffect(() => {
        fetchMarket();
    }, [params.id, coupon])

    if (isLoading) {
       return <Loading />
    }

    if (!market) {
        return <Redirect href="/home" />
    }

    return (
        <View style={{ flex: 1 }}>
            <StatusBar barStyle={"light-content"} hidden={isModalVisible} />

            <ScrollView showsVerticalScrollIndicator={false} >
                <Cover uri={market.cover} />
                <Details data={market} />
                {coupon && <Coupon code="FM345234" />}
            </ScrollView>

            <View style={{ padding: 32 }} >
                <Button onPress={handleOpenCamera}>
                    <Button.Title>Ler QR Code</Button.Title>
                </Button>
            </View>

            <Modal style={{ flex: 1}} visible={isModalVisible} animationType="slide" >
                <CameraView 
                    style={{ flex: 1 }} 
                    facing="back" 
                    onBarcodeScanned={({ data }) => {
                        if (data && !qrLock.current) {
                            qrLock.current = true;
                            handleUseCouppon(data);
                        }
                    }}
                />
                <View style={{ position: "absolute", bottom: 32, left: 32, right: 32 }} >
                    <Button onPress={() => setIsModalVisible(false)} isLoading={couponIsFetching}>
                        <Button.Title>Voltar</Button.Title>
                    </Button>
                </View>
            </Modal>
        </View>
    )
}