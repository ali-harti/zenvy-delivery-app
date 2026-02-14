import React, { useState, useEffect } from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors } from '../../theme/colors';

interface Props {
    visible: boolean;
    onClose: () => void;
    initialName: string;
    initialVehicle: string;
    onSave: (name: string, vehicle: string) => void;
}

const EditProfileModal: React.FC<Props> = ({ visible, onClose, initialName, initialVehicle, onSave }) => {
    const [name, setName] = useState(initialName);
    const [vehicle, setVehicle] = useState(initialVehicle);

    useEffect(() => {
        setName(initialName);
        setVehicle(initialVehicle);
    }, [initialName, initialVehicle, visible]);

    const handleSave = () => {
        onSave(name, vehicle);
        onClose();
    };

    return (
        <Modal visible={visible} transparent animationType="slide">
            <View style={styles.overlay}>
                <View style={styles.container}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Edit Profile</Text>
                        <TouchableOpacity onPress={onClose}>
                            <Feather name="x" size={24} color={colors.textPrimary} />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.form}>
                        <Text style={styles.label}>Full Name</Text>
                        <TextInput
                            style={styles.input}
                            value={name}
                            onChangeText={setName}
                            placeholder="Karim Benali"
                        />

                        <Text style={styles.label}>Vehicle Type</Text>
                        <View style={styles.vehicleOptions}>
                            {['Motorbike', 'Car', 'Bicycle'].map((v) => (
                                <TouchableOpacity
                                    key={v}
                                    style={[styles.vehicleOption, vehicle === v && styles.vehicleOptionActive]}
                                    onPress={() => setVehicle(v)}
                                >
                                    <Text style={[styles.vehicleText, vehicle === v && styles.vehicleTextActive]}>{v}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                        <Text style={styles.saveButtonText}>Save Changes</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
    container: { backgroundColor: colors.background, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, paddingBottom: 40 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    title: { fontSize: 20, fontWeight: '700', color: colors.textPrimary },
    form: { marginBottom: 20 },
    label: { fontSize: 14, color: colors.textSecondary, marginBottom: 8, marginTop: 12 },
    input: { backgroundColor: colors.cardBackground, borderRadius: 12, padding: 16, fontSize: 16, color: colors.textPrimary, borderWidth: 1, borderColor: colors.border },
    vehicleOptions: { flexDirection: 'row', gap: 10, marginTop: 8 },
    vehicleOption: { paddingVertical: 10, paddingHorizontal: 16, borderRadius: 20, borderWidth: 1, borderColor: colors.border },
    vehicleOptionActive: { backgroundColor: colors.primary, borderColor: colors.primary },
    vehicleText: { fontSize: 14, color: colors.textSecondary },
    vehicleTextActive: { color: 'white', fontWeight: '600' },
    saveButton: { backgroundColor: colors.primary, paddingVertical: 16, borderRadius: 16, alignItems: 'center' },
    saveButtonText: { fontSize: 16, fontWeight: '700', color: 'white' },
});

export default EditProfileModal;
