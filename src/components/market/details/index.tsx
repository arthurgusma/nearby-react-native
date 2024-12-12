import { IconPhone, IconMapPin, IconTicket } from "@tabler/icons-react-native";
import { View, Text } from "react-native";
import { styles } from "./styles";
import { Info } from "../info";

export type PropsDetails = {
    name: string
    description: string
    address: string
    phone: string
    coupons: number
    rules: {
        id: string
        description: string
    }[]
}

type Props = {
    data: PropsDetails
}

export default function Details({ data }: Props) {
    return (
        <View style={styles.container}>
            <Text style={styles.name}>{data.name}</Text>
            <Text style={styles.description}>{data.description}</Text>
            <View style={styles.group}>
                <Text style={styles.title}>Informações</Text>

                <Info icon={IconTicket} description={`${data.coupons} cupons disponíveis`} />
                <Info icon={IconMapPin} description={data.address} />
                <Info icon={IconPhone} description={data.phone} />
            </View>

            <View style={styles.group}>
                <Text style={styles.title}>Regulamento</Text>
                {data.rules.map(rule => (
                    <Text key={rule.id} style={styles.rule}>
                        {`\u2022 ${rule.description}`}
                    </Text>
                ))}
            </View>
        </View>
    )
}