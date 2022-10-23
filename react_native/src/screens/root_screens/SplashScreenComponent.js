import React, {useEffect, useState} from "react";
import {Image, Platform, SafeAreaView, StyleSheet, Text, View} from "react-native";
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import * as Animatable from 'react-native-animatable-unmountable'
import ActionButtonComponent from "../../components/ActionButtonComponent";
import appleLogo from "../../../assets/images/apple.png"
import googleLogo from "../../../assets/images/google.png"
import paw from "../../../assets/images/paw.png"
import {responsiveFontSize} from "react-native-responsive-dimensions";
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {AuthContext} from "../../components/Context";

WebBrowser.maybeCompleteAuthSession();   //This will close your web browser after login

function SplashScreenComponent({navigation}){
    const [gUser, setGUser] = useState('');
    const [reqError, setReqError] = useState('');
    const [isLoading,setIsLoading]=useState(false);

    const [request, response, promptAsync] = Google.useAuthRequest({
        expoClientId: '290934894571-ogv6ua4sds4ekmiq0ev66c4s13gksm7q.apps.googleusercontent.com',
        iosClientId: '290934894571-9vtdhbqd3ntmo2da5m45fm60nd89o1jg.apps.googleusercontent.com',
        androidClientId: '290934894571-73tlpem3nre7smeagosh8h1f0rn123ee.apps.googleusercontent.com',
        webClientId: '290934894571-a5b41c9mbsehirl1npruf9ed04uggnu8.apps.googleusercontent.com',
        scopes: ['profile', 'email'],
    });

    useEffect(() => {
        if (response?.type === 'success') {
            const { authentication } = response;
            signInGoogleUser(authentication.accessToken);
        }
    }, [response]);

    //Request user information to Google API
    const signInGoogleUser = async (accessToken) => {
        try{
            axios.get('https://www.googleapis.com/oauth2/v2/userinfo',
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                }
            ).then((response) => {
                setGUser(response.data);

                const userInfo = {
                    email: String(response.data.email),
                    name: String(response.data.name),
                    password: "",
                    username: String(response.data.email),
                    user_role: "Student",
                };

                axios.post('http://192.168.0.19:8080/tuter/users',
                    userInfo,
                    {headers: {'Content-Type': 'application/json'}}
                ).then(
                    (responseEndpoint)=>{
                        signIn({...responseEndpoint.data, picture: ""});
                    }, () => {
                        const userInfo = {
                            email: String(response.data.email),
                            name: String(response.data.name),
                            password: "",
                            username: String(response.data.email),
                            user_role: "Student",
                            picture: String(response.data.picture)
                        };
                        signIn(userInfo)
                    }
                );
            }, (reason) => {console.log(reason)})
        }
        catch(error){
            console.log('GoogleUserReq error: ', error.response.data);
            setReqError(error.response.data);
        }

    }


    const { signIn } = React.useContext(AuthContext);

    return(
        <Animatable.View style={styles.container} animation={"fadeInUp"}>
            <SafeAreaView style={styles.title}>
                <View style={{flexDirection: "row"}}>
                    <Text style={{
                        color: "white",
                        fontSize: responsiveFontSize(7.3),
                        textShadowColor: 'rgba(0, 0, 0, 0.75)',
                        textShadowOffset: { width: 0, height: 3 },
                        textShadowRadius: 10,
                        position: "absolute"
                    }}> Tüter </Text>

                    <Image
                        source={paw}
                        style={{
                            marginTop: "23%",
                            marginLeft: "61%",
                            height: 24,
                            width: 24,
                        }}
                        resizeMode={"contain"}
                    />
                </View>
                <View style={styles.registration}>
                    <ActionButtonComponent
                        label={"Log In"}
                        labelColor={"#ffffff"}
                        buttonColor={"#069044"}
                        width={122}
                        height={48}
                        bold={false}
                        onPress={() => navigation.navigate("SignIn")}
                    />
                    <View style={{padding: 8}}/>
                    <ActionButtonComponent
                        label={"Sign Up"}
                        labelColor={"#ffffff"}
                        buttonColor={"#069044"}
                        width={122}
                        height={48}
                        bold={false}
                        onPress={() => navigation.navigate("SignUp")}
                    />
                </View>

                <View style={styles.registrationOA2}>
                    <ActionButtonComponent
                        logo={googleLogo}
                        logoSize={{width: 24, height: 24}}
                        label={"Continue with Google"}
                        labelColor={"rgba(0,0,0,0.55)"}
                        buttonColor={"#ffffff"}
                        width={261}
                        height={54}
                        bold={true}
                        onPress={() => {promptAsync()}}
                    />
                    <View style={{padding: Platform.OS === "ios" ? 8 : 0}}/>
                    {Platform.OS === "ios" ? <ActionButtonComponent
                        logo={appleLogo}
                        logoSize={{width: 24, height: 24}}
                        label={"Continue with Apple"}
                        labelColor={"#ffffff"}
                        buttonColor={"#000000"}
                        width={261}
                        height={54}
                        bold={true}
                        onPress={() => {}}
                    /> : null}
                </View>
            </SafeAreaView>
        </Animatable.View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingTop: "71%",
        justifyContent: "center",
    },
    title: {
        position: 'relative',
        top: '36%',
        left: '30%',
        right: '50%',
        width: 234,
        height: 74
    },
    registration: {
        flex: 1,
        flexDirection: "row",
        paddingTop: "50%",
        paddingRight: "8%",
        alignItems: "flex-end",
        justifyContent: "flex-end"
    },
    registrationOA2: {
        flex: 1,
        flexDirection: "column",
        paddingTop: Platform.OS === 'ios' ? "60%" : "30%",
        paddingRight: "8%",
        alignItems: "flex-end",
        justifyContent: "flex-end"
    }
})

export default SplashScreenComponent;