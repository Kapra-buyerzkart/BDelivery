import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const TaskCompletedModal = ({ visible, onClose, task, taskNo, totalKm }) => {
    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.modalContent}>
                    <Text style={styles.successText}>{task} Completed Successfully!</Text>

                    <Text style={styles.label}>Task No:</Text>
                    <Text style={styles.value}>{taskNo}</Text>

                    {task === "Delivery" && (
                        <>
                            <Text style={styles.label}>Total KM Covered:</Text>
                            <Text style={styles.value}>{totalKm.toFixed(2)} km</Text>
                        </>
                    )}

                    <TouchableOpacity style={styles.button} onPress={onClose}>
                        <Text style={styles.buttonText}>Close</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

export default TaskCompletedModal;

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '85%',
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 24,
        alignItems: 'center',
        elevation: 5,
    },
    successText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'green',
        marginBottom: 16,
        textAlign: 'center',
    },
    label: {
        fontSize: 16,
        color: '#333',
        marginTop: 8,
    },
    value: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 4,
    },
    button: {
        marginTop: 20,
        backgroundColor: '#007BFF',
        paddingVertical: 10,
        paddingHorizontal: 24,
        borderRadius: 8,
    },
    buttonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 16,
    },
});
