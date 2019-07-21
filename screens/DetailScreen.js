import React from "react";
import { StyleSheet, ScrollView, View, Text, TouchableOpacity } from "react-native";
import MapView, { Marker } from 'react-native-maps';
import { Icon, Header } from 'react-native-elements'

export default class DetailScreen extends React.PureComponent {

    static navigationOptions = ({ navigation }) => ({
        header: (
            <Header
                placement="left"
                leftComponent={<TouchableOpacity onPress={() => navigation.goBack()}><Icon name='arrow-back' color='#fff' /></TouchableOpacity>}
                centerComponent={{ text: navigation.state.params.country.name, style: { color: '#fff' } }}
            />
        )
    });

    render() {
        let item = this.props.navigation.state.params.country;
        return (
            <ScrollView style={{ flex: 1 }}>
                <View style={styles.hlayout}>
                    <Text>Name:</Text>
                    <Text>{item.name}</Text>
                </View>
                {item.capital ?
                    <View style={styles.hlayout}>
                        <Text>Capital:</Text>
                        <Text>{item.capital}</Text>
                    </View> : null}
                {item.region ?
                    <View style={styles.hlayout}>
                        <Text>Region:</Text>
                        <Text>{item.region}</Text>
                    </View> : null}
                {item.subregion ?
                    <View style={styles.hlayout}>
                        <Text>Subregion:</Text>
                        <Text>{item.subregion}</Text>
                    </View> : null}
                {item.population ?
                    <View style={styles.hlayout}>
                        <Text>Population:</Text>
                        <Text>{item.population}</Text>
                    </View> : null}
                {item.area ?
                    <View style={styles.hlayout}>
                        <Text>Area:</Text>
                        <Text>{item.area}</Text>
                    </View> : null}
                {item.currencies ?
                    <View style={styles.hlayout}>
                        <Text>Currencies:</Text>
                        <Text>{JSON.parse(item.currencies).join(", ")}</Text>
                    </View> : null}
                {item.lat && item.lng ?
                    <View style={{ width: '100%', height: 300 }}>
                        <MapView
                            style={{ flex: 1 }}
                            region={{
                                latitude: item.lat,
                                longitude: item.lng,
                                latitudeDelta: 20.0000,
                                longitudeDelta: 20.0000,
                            }}
                        >
                            <Marker
                                coordinate={{
                                    latitude: item.lat,
                                    longitude: item.lng
                                }}
                            />
                        </MapView>
                    </View> : null}
            </ScrollView>
        );
    }

}

const styles = StyleSheet.create({
    hlayout: {
        padding: 25,
        flexDirection: "row",
        justifyContent: "space-between",
        borderBottomColor: "#000",
        borderBottomWidth: 1
    }
});