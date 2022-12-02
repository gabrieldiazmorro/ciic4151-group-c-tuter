import React, {useEffect, useState} from "react";
import {Alert, Button, ScrollView, Text, View} from "react-native";
import {StripeProvider, useStripe} from "@stripe/stripe-react-native";
import * as Animatable from "react-native-animatable-unmountable";
import axios from "axios";
import SessionBookingModalComponent from "../../components/SessionBookingModalComponent";

function WalletScreenComponent(){
    const { initPaymentSheet, presentPaymentSheet } = useStripe();
    const [loading, setLoading] = useState(false);
    const [isValid, setValid] = useState(false);
    const [total, setTotal] = useState(2199);
    const [customerID, setCustomerID] = useState("");
    const [transDetails, setTransDetails] = useState({});
    let formdata = new FormData();
    formdata.append('total', total);
    const [openModal, setOpenModal] = useState(false);

    const toggleModal = () => {setOpenModal(!openModal)};


    React.useEffect(() => {
        console.log("Tomate");
        console.log(transDetails.last_four);
    }, [transDetails]);

    const fetchPaymentSheetParams = async () => {
        const response = await fetch('http://192.168.1.6:8080/payment-sheet', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({total: total})
        });

        const { paymentIntent, ephemeralKey, customer } = await response.json();
        console.log(customer);
        setCustomerID(customer);
        return {
            paymentIntent,
            ephemeralKey,
            customer,
        };
    };

    const initializePaymentSheet = async () => {
        const {
            paymentIntent,
            ephemeralKey,
            customer,
            publishableKey,
        } = await fetchPaymentSheetParams();

        const { error } = await initPaymentSheet({
            customerId: customer,
            customerEphemeralKeySecret: ephemeralKey,
            paymentIntentClientSecret: paymentIntent,
            customFlow: false,
            merchantDisplayName: 'Stack Overflowers Inc.',
            // Set `allowsDelayedPaymentMethods` to true if your business can handle payment
            //methods that complete payment after a delay, like SEPA Debit and Sofort.
            allowsDelayedPaymentMethods: true,
        });
        if (!error) {
            setLoading(true);
        }
    };

    // const openPaymentSheet = async () => {
    //     // const response = await axios.post("http://192.168.1.8:8080/webhook", initializePaymentSheet(), {headers: {'Content-Type': 'application/json'}});
    //     //
    //     // // const { result } = await response.json();
    //     // console.log(response);
    //     const { error, paymentOption } = await presentPaymentSheet();
    //
    //     if (error) {
    //         Alert.alert(`Error code: ${error.code}`, error.message);
    //         console.log(error.code);
    //     } else {
    //         Alert.alert('Success', 'Your order is confirmed!');
    //         console.log(paymentOption);
    //         // console.log(initPaymentSheet);
    //         // console.log(paymentOption.valueOf());
    //         setValid(true); // The transaction was valid
    //         console.log('Transaction was successful');
    //     }
    // };
    const openPaymentSheet = async () => {
        const { error } = await presentPaymentSheet();

        if (error) {
            Alert.alert(`Error code: ${error.code}`, error.message);
        } else {
            Alert.alert('Success', 'Your order is confirmed!');
            console.log('Transaction was successful');
        }
    };

    const getTransactionDetails = () => {
        const errorAlert = (reason) => {
            console.error(reason)
            Alert.alert("Invalid customer_id",
                "Incorrect customer_id not in table",
                [{text: "Okay"}]
            );
        }
        axios.post("http://192.168.1.6:8080/tuter/transaction-details/customer", {customer_id: customerID}, {headers: {'Content-Type': 'application/json'}}).then(
            (response) => {
                setTransDetails(response.data[0]);
            }, (reason) => {errorAlert(reason)}
        );
    };

    useEffect(() => {
        initializePaymentSheet().then(r => {});
    }, []);

    return (
        <StripeProvider
            publishableKey= "pk_test_51M2zHJDhRypYPdkQRZ4Cd7KIu3idER1Fz9Je6KWv7xKDdG2OENqBADizHpdPUtGX1jrEtdKvTuYJSUIeNkoKIoeM00UiSHJiq2"

            urlScheme="your-url-scheme" // required for 3D Secure and bank redirects
            merchantIdentifier="merchant.com.{{YOUR_APP_NAME}}" // required for Apple Pay
        >
            <ScrollView contentContainerStyle={{ flexGrow: 1, alignItems:"center", justifyContent: "center"}}>
                <SessionBookingModalComponent
                    visible={openModal}
                    closeModal={toggleModal}
                />
                <Animatable.View animation={'fadeInUpBig'} >

                    <Text style={{alignItems: "center", justifyContent:"center"}}>Wallet Screen</Text>
                    <Button
                        variant="primary"
                        disabled={!loading}
                        title="Checkout"
                        onPress={openPaymentSheet}
                    />
                    <Button
                        variant="primary"
                        title="GetTransactionDetails"
                        onPress={getTransactionDetails}
                    />
                    <Button
                        variant="primary"
                        title="testeomodalico"
                        onPress={toggleModal}
                    />
                </Animatable.View>
            </ScrollView>
        </StripeProvider>
    );
}

export default WalletScreenComponent;