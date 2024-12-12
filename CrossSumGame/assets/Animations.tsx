import {Animated} from "react-native";

export const WinAnimation=(value:Animated.Value,toStartValue:number,toEndValue:number)=>{
    return Animated.sequence([
        Animated.timing(value,{
            toValue: toEndValue,
            useNativeDriver: false
        }),
        Animated.timing(value,{
            toValue:toStartValue,
            useNativeDriver:false
        })
    ]);
}