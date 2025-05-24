import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Modal, TouchableWithoutFeedback } from "react-native";
import { UserConfigurationModel } from "../../../commons/models/configurations/userconfiguration";

type UserConfigProps = {
  config: { uid: string; username: string; roleId: string, email: string };
  onEdit: (uid: string) => void;
  onDelete: (uid: string) => void;
};

const UserConfigCard = ({ config, onEdit, onDelete }: UserConfigProps) => {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <>
      <TouchableOpacity style={styles.card} onPress={() => setModalVisible(true)}>
        <Text style={styles.name}>{config.username}</Text>
        <Text style={styles.role}>{config.roleId}</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalContainer}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>User Details</Text>
                <Text style={styles.modalText}>Username: {config.username}</Text>
                <Text style={styles.modalText}>Role ID: {config.roleId}</Text>
                <Text style={styles.modalText}>UID: {config.uid}</Text>
                <Text style={styles.modalText}>email: {config.email}</Text>

                <View style={styles.buttonContainer}>
                  <TouchableOpacity style={styles.editButton} onPress={() => { setModalVisible(false); onEdit(config.uid); }}>
                    <Text style={styles.buttonText}>Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.deleteButton} onPress={() => { setModalVisible(false); onDelete(config.uid); }}>
                    <Text style={styles.buttonText}>Delete</Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <Text style={styles.closeText}>Close</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#f8f9fa",
    padding: 16,
    marginVertical: 8,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
  },
  role: {
    fontSize: 14,
    color: "#6c757d",
    marginBottom: 8,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 5,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginTop: 15,
  },
  editButton: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
    width: "40%",
    alignItems: "center",
  },
  deleteButton: {
    backgroundColor: "#dc3545",
    padding: 10,
    borderRadius: 5,
    width: "40%",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  closeText: {
    marginTop: 10,
    fontSize: 16,
    color: "#007bff",
  },
});

export default UserConfigCard;
