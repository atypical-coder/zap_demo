import { createStackNavigator, createAppContainer } from "react-navigation";

import ListScreen from "../screens/ListScreen";
import DetailScreen from "../screens/DetailScreen";

const AppNavigator = createStackNavigator({
    Home: {
        screen: ListScreen
    },
    Detail: {
        screen: DetailScreen
    }
});

export default createAppContainer(AppNavigator);