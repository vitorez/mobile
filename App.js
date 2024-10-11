import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Button, Modal, TextInput, StyleSheet, Alert, Image } from 'react-native';

const API_URL = 'https://6624260004457d4aaf9bbb0c.mockapi.io/Users';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar os usuários.');
    }
  };

  const handleEdit = (user) => {
    setCurrentUser(user);
    setModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      fetchUsers(); // Atualiza a lista após a exclusão
      Alert.alert('Sucesso', 'Usuário excluído com sucesso!');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível excluir o usuário.');
    }
  };

  const saveChanges = async () => {
    try {
      const response = await fetch(`${API_URL}/${currentUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentUser),
      });
      if (response.ok) {
        setModalVisible(false);
        fetchUsers(); // Atualiza a lista após a edição
        Alert.alert('Sucesso', 'Usuário editado com sucesso!');
      } else {
        Alert.alert('Erro', 'Não foi possível salvar as alterações.');
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar as alterações.');
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.userItem}>
      <Image source={{ uri: item.avatar }} style={styles.avatar} />
      <Text style={styles.userName}>{item.name}</Text>
      <Text style={styles.userEmail}>{item.email}</Text>
      <View style={styles.buttonContainer}>
        <Button title="Editar" onPress={() => handleEdit(item)} />
        <Button title="Excluir" onPress={() => handleDelete(item.id)} />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={users}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
      />
      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="slide"
      >
        <View style={styles.modalContainer}>
          <TextInput
            placeholder="Nome"
            value={currentUser?.name}
            onChangeText={(text) => setCurrentUser({ ...currentUser, name: text })}
            style={styles.input}
          />
          <TextInput
            placeholder="Email"
            value={currentUser?.email}
            onChangeText={(text) => setCurrentUser({ ...currentUser, email: text })}
            style={styles.input}
          />
          <TextInput
            placeholder="Avatar URL"
            value={currentUser?.avatar}
            onChangeText={(text) => setCurrentUser({ ...currentUser, avatar: text })}
            style={styles.input}
          />
          <Button title="Salvar" onPress={saveChanges} />
          <Button title="Cancelar" onPress={() => setModalVisible(false)} />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  userItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  userName: {
    fontSize: 18,
    flex: 1,
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '40%',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: 'white',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
});

export default UserList;
