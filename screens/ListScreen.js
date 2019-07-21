import React from "react";
import { StyleSheet, ActivityIndicator, View, FlatList, TouchableOpacity, Text } from "react-native";
import { Card, Button, Icon, SearchBar, ListItem, Header } from 'react-native-elements'

import CountryService from "../services/CountryService";

export default class ListScreen extends React.PureComponent {

    static navigationOptions = {
        header: (
            <Header
                placement="left"
                centerComponent={{ text: 'Countries', style: { color: '#fff' } }}
            />
        )
    };

    constructor(props) {
        super(props);
        this.state = {
            searchText: "",
            ready: false,
            error: false,
            countries: false,
            filteredCountries: []
        };
    }

    componentDidMount() {
        this._sync();
    }

    _sync() {
        this.setState({
            error: false
        });
        CountryService.checkDbData()
            .then(length => {
                if (length === 0) {
                    CountryService.downloadCountries()
                        .then(result => {
                            CountryService.getCountries()
                                .then(countries => {
                                    this.setState({
                                        ready: true,
                                        countries: countries
                                    });
                                })
                                .catch(e => {
                                    console.log(e);
                                    this.setState({
                                        error: true
                                    });
                                });
                        })
                        .catch(e => {
                            console.log(e);
                            this.setState({
                                error: true
                            });
                        });
                } else {
                    CountryService.getCountries()
                        .then(countries => {
                            this.setState({
                                ready: true,
                                countries: countries
                            });
                        })
                        .catch(e => {
                            console.log(e);
                            this.setState({
                                error: true
                            });
                        });
                }
            })
            .catch(e => {
                console.log(e);
                this.setState({
                    error: true
                });
            });
    }

    _search(searchText) {
        this.setState({ searchText: searchText });
        let filteredCountries = this.state.countries.filter(function (item) {
            return item.name.toUpperCase().includes(searchText.toUpperCase());
        });
        this.setState({ filteredCountries: filteredCountries });
    }

    _openDetail(item) {
        this.props.navigation.navigate('Detail', {
            country: item,
        });
    }

    render() {
        if (this.state.error) {
            return (
                <View style={styles.container}>
                    <Card title='Error'>
                        <Text style={{ marginBottom: 10 }}>
                            An error has occurred while updating the software.
                        </Text>
                        <Button
                            icon={<Icon name='refresh' color='#ffffff' />}
                            buttonStyle={{ borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 0 }}
                            title='Try Again'
                            accessibilityLabel="Click to try sync again"
                            onPress={this._sync}
                        />
                    </Card>
                </View>
            );
        }
        if (this.state.ready) {
            return (
                <View style={{ flex: 1 }}>
                    <SearchBar
                        round={true}
                        lightTheme={true}
                        placeholder="Search..."
                        autoCapitalize='none'
                        autoCorrect={false}
                        onChangeText={this._search.bind(this)}
                        value={this.state.searchText}
                    />
                    <FlatList
                        data={this.state.filteredCountries && this.state.filteredCountries.length > 0 ? this.state.filteredCountries : this.state.countries}
                        keyExtractor={(item) => `item-${item.id}`}
                        renderItem={({ item }) =>
                            <TouchableOpacity onPress={this._openDetail.bind(this, item)}>
                                <ListItem
                                    key={item.id}
                                    title={item.name}
                                    subtitle={item.region}
                                />
                            </TouchableOpacity>
                        }
                    />
                </View>
            );
        } else {
            return (
                <View style={styles.container}>
                    <ActivityIndicator size="large" />
                </View>
            );
        }
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
    }
});