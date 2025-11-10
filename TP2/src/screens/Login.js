import React, { Component } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { auth } from '../firebase/config';

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      pass: '',
      error: '',
      loggedIn: false,
    };
  }

  componentDidMount() {
    auth.onAuthStateChanged(user => {
      if (user) {
        this.props.navigation.replace("HomeMenu");
      }
    });
  }

  
  login(){
    auth.signInWithEmailAndPassword(this.state.email, this.state.pass)
      .then((response) => {
        this.setState({ loggedIn: true });
        this.props.navigation.push("HomeMenu")
      })
      .catch((error) => {
        this.setState({ error: 'Credenciales inválidas.' });
      });
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Login</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          keyboardType="email-address"
          value={this.state.email}
          onChangeText={(text) => this.setState({ email: text })}
        />

        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          secureTextEntry
          value={this.state.pass}
          onChangeText={(text) => this.setState({ pass: text })}
        />

        <Pressable
          style={styles.btn}
          onPress={() => this.login()}
        >
          <Text style={styles.btnText}>Ingresar</Text>
        </Pressable>

        <Pressable
          style={styles.registerBtn}
          onPress={() => this.props.navigation.navigate('Register')}
        >
          <Text style={styles.registerText}>¿No tenés cuenta? Registrate</Text>
        </Pressable>

        {this.state.error ? (
          <Text style={styles.error}>{this.state.error}</Text>
        ) : null}

        {this.state.loggedIn ? (
          <Text style={styles.success}>¡Sesión iniciada!</Text>
        ) : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  input: { borderWidth: 1, borderColor: '#ccc', marginBottom: 12, padding: 10, borderRadius: 6 },
  btn: { backgroundColor: '#000', padding: 12, alignItems: 'center', borderRadius: 6 },
  btnText: { color: '#fff', fontWeight: 'bold' },
  error: { color: 'red', marginTop: 10 },
  success: { color: 'green', marginTop: 10 },
  registerBtn: { marginTop: 15, alignItems: 'center'},
  registerText: { color: '#1E90FF', textDecorationLine: 'underline' },
});