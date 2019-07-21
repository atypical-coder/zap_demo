import { AppLoading } from "expo";
import React from "react";
import { Platform, StatusBar, View } from "react-native";

import AppNavigation from "./navigation/AppNavigation";

export default class App extends React.PureComponent {
    
    constructor(props) {
        super(props);
        this.state = {
            bootReady: false
        };
    }

    async _loadResources() {
        // If I need to preload assets
        // return Promise.all([]);
        return true;
    }

    _handleError(error) {
        console.info(error);
    }

    render() {
        if(this.state.bootReady) {
            return (
                <View style={{flex: 1}}>
                    {Platform.OS === "ios" && <StatusBar barStyle="default" />}
                    <AppNavigation />
                </View>
            );
        } else {
            return (
               <AppLoading
                    startAsync={this._loadResources}
                    onError={this._handleError}
                    onFinish={() => this.setState({ bootReady: true })}
                />
            );
        }
    }

}