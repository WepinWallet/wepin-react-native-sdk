import React, { useState } from "react"
import { View, Text, TextInput, Button, StyleSheet } from 'react-native'
// import Modal from '@kalwani/react-native-modal'
import Modal from 'react-native-modal'
interface ModalProps {
    gas: { price: string, limit: string }
    address: string
    visible: boolean
    onClose: () => void
    onSave: (data: any) => void
}

const CustomModal: React.FC<ModalProps> = ({ visible, onClose, onSave, gas, address }) => {
    const [toAddress, setToAddress] = useState(address)
    const [gasPrice, setGasPrice] = useState(gas.price)
    const [gasLimit, setGasLimit] = useState(gas.limit)
    const [amount, setAmount] = useState('0x0')
    const [data, setData] = useState('0x095ea7b3000000000000000000000000000000000022d473030f116ddee9f6b43ac78ba300000000000000000000000000000000000000000000000000224e2bf56682c8')
    const [ok, setOk] = useState(false)

    const handleSave = () => {
        onSave({ toAddress, gasPrice, gasLimit, amount, data })
        setToAddress('')
        setGasPrice('')
        setGasLimit('')
        setAmount('')
        setData('')
    }

    return (
        <Modal
            animationIn={"slideInUp"}
            // animationType="slide" 
            //transparent={true} 
            isVisible={visible}
            onModalShow={() => {
                console.log('onModalShow:, ', ok)
                // if (ok) handleSave()
            }}
            onModalHide={() => {
                console.log('onModalHide:, ', ok)
                // if (ok) handleSave()
            }}
            onModalWillHide={() => {
                console.log('onModalWillHide:, ', ok)
                // if (ok) handleSave()
            }}

        // coverScreen={false}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Transaction Data</Text>
                    <View style={styles.inputContainter}>
                        <Text style={styles.label}>
                            toAddress:
                        </Text>
                        <TextInput
                            style={styles.modalInput}
                            // placeholder={address}
                            value={toAddress}
                            onChangeText={(val) => setToAddress(val)}
                        />
                    </View>
                    <View style={styles.inputContainter}>
                        <Text style={styles.label}>
                            amount:
                        </Text>
                        <TextInput
                            style={styles.modalInput}
                            // placeholder="0x0"
                            value={amount}
                            onChangeText={(val) => setAmount(val)}
                        />
                    </View>
                    <View style={styles.inputContainter}>
                        <Text style={styles.label}>
                            gasPrice:
                        </Text>
                        <TextInput
                            style={styles.modalInput}
                            // placeholder={gas.price}
                            value={gasPrice}
                            onChangeText={(val) => setGasPrice(val)}
                        />
                    </View>
                    <View style={styles.inputContainter}>
                        <Text style={styles.label}>
                            gasLimit:
                        </Text>
                        <TextInput
                            style={styles.modalInput}
                            // placeholder={gas.limit}
                            value={gasLimit}
                            onChangeText={(val) => setGasLimit(val)}
                        />
                    </View>
                    <View style={styles.inputContainter}>
                        <Text style={styles.label}>
                            data:
                        </Text>
                        <TextInput
                            style={styles.modalInput}
                            // placeholder="0x095ea7b3000000000000000000000000000000000022d473030f116ddee9f6b43ac78ba300000000000000000000000000000000000000000000000000224e2bf56682c8"
                            value={data}
                            onChangeText={(val) => setData(val)}
                        />
                    </View>
                    <View style={styles.modalButtonContainer}>
                        <Button title="Cancel" onPress={() => { setOk(false); onClose() }} />
                        <Button title="OK" onPress={() => { setOk(true); handleSave() }} />
                    </View>
                </View>
            </View>
        </Modal>
    );
};
const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '80%',
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    modalInput: {
        flex: 2,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        padding: 5,
        color: 'black'
    },
    modalButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginTop: 10,
    },
    inputContainter: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10
    },
    label: {
        flex: 1,
        marginRight: 5,
        textAlign: 'left',
        fontWeight: 'bold',
        color: 'black'
    }
})

export default CustomModal