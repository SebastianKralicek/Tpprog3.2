import React, { Component } from "react";
import { View, Text, TextInput, Pressable, StyleSheet } from "react-native";
import { auth, db } from "../firebase/config";

export default class DynamicForm extends Component {
    constructor(props){
        super(props);
        this.state = {
            comentario: '',
            email: '',
            contrasena: '',
            usuario: '',
            registered: false,
            error: ''
        }
    }

onSubmit = () => {
    this.register(this.state.email, this.state.contrasena, this.state.usuario);
};

render(){
    return (
        <View style={styles.container}>
            <Text style={styles.label}>Correo electronico:</Text>
            <TextInput
                style={styles.input}
                placeholder="Email"
                onChangeText={(text) => this.setState({ email: text })}
                value={this.state.email}
                />

            <Text style={styles.label}>Nombre de usuario:</Text>
            <TextInput
                style={styles.input}
                placeholder="Nombre de usuario"
                onChangeText={(text) => this.setState({ usuario: text })}
                value={this.state.usuario}
            />

            <Text style={styles.label}>Contraseña:</Text>
            <TextInput
                style={styles.input}
                placeholder="Contraseña"
                secureTextEntry
                onChangeText={(text) => this.setState({ contrasena: text })}
                value={this.state.contrasena}
            />

             <Text style={styles.label}>Escribi tu comentario:</Text>
            <TextInput
                style={styles.input}
                placeholder="Comentario"
                multiline
                onChangeText={(text) => this.setState({ comentario: text })}
                value={this.state.comentario}
            />

            <Pressable style={styles.button} onPress={this.onSubmit}>
          <Text style={styles.buttonText}>Enviar</Text>
            </Pressable>
             {this.state.registered && (
          <Text style={{ color: "green", marginTop: 10 }}>
            ¡Registro exitoso!
          </Text>
        )}
        {this.state.error !== "" && (
          <Text style={{ color: "red", marginTop: 10 }}>{this.state.error}</Text>
        )}

        <View style={styles.preview}>
          <Text style={styles.previewLabel}>Vista previa:</Text>
          <Text style={styles.previewText}>{this.state.comentario}</Text>
        </View>
      </View>
    )
}


}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    justifyContent: 'flex-start',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
    marginTop: 15,
    color: '#000',
  },
  input: {
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#AEE2FF',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  preview: {
    marginTop: 30,
    padding: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: '#F9F9F9',
  },
  previewLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  previewText: {
    fontSize: 15,
    color: '#555',
  }
});