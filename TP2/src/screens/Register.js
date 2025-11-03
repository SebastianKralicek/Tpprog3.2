import { React, Component } from 'react';
import { View, Text, TextInput,  StyleSheet, Pressable } from "react-native";

export default class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
        email: '',
        usuario: '',
        contrasena: ''
    }
}


onSubmit() {
  this.props.navigation.navigate('HomeMenu');
}


render(){
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Registro</Text>
            <TextInput style={styles.field}
            keyboardType="email-address"
            placeholder="Ingrese su email"
            onChangeText={(text) => this.setState({email: text})}
            value={this.state.email}/>
            <TextInput style={styles.field}
            keyboardType="default"
            placeholder="Nombre de usuario"
            onChangeText={(text) => this.setState({usuario: text})}
            value={this.state.usuario}/>
            <TextInput style={styles.field}
            keyboardType="default"
            placeholder="Contraseña"
            onChangeText={(text) => this.setState({contrasena: text})}
            value={this.state.contrasena}/>
            <Pressable onPress={ () => this.onSubmit} style={styles.blueButton}>
                <Text style={styles.buttonText}>Registrarse</Text>
            </Pressable>
        <Pressable
         style={styles.button}
         onPress={() => this.props.navigation.navigate("Login")} >
            <Text>Ya tengo cuenta</Text>
         </Pressable>

        </View>
    );
}
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  field: {
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  blueButton: {
    backgroundColor: '#AEE2FF',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  button: {
    alignItems: 'center',
    marginTop: 5,
  }
});