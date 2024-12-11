import { FlatList, View } from "react-native";
import Category from "../category";
import { styles } from "./styles";

export type CategoriesProps = {
    id: string;
    name: string;
};

type Props = {
    data: CategoriesProps[];
    selected: string
    onSelect: (id: string) => void
};

export function Categories({ data, selected, onSelect }: Props) {
    return (
        <FlatList 
            data={data}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => 
                <Category 
                    isSelected={selected === item.id}
                    name={item.name} 
                    iconId={item.id} 
                    onPress={() => onSelect(item.id)}
                />
            }
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.content}
            style={styles.container}
        />
    )
}