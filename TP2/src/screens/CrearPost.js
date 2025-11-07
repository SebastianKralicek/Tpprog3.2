import React, { Component } from "react";
import { View, Text, TextInput, Pressable, StyleSheet } from "react-native";
import { auth, db } from "../firebase/config";

export default class CrearPost extends Component {
  constructor(props) {
    super(props);
    this.state = {
      descripcion: "",
      error: "",
      exito: "",
      submitting: false,
    };
  }

  componentDidMount() {
    const user = auth.currentUser;
    if (!user) {
      this.props.navigation.push("Login");
    }
  }

  onSubmit() {
    const user = auth.currentUser;

    if (this.state.descripcion.length === 0) {
      this.setState({ error: "La descripción no puede estar vacía." });
      return;
    }

    this.setState({ submitting: true, error: "", exito: "" });

    const newPost = {
      owner: { email: user.email, nombre: user.displayName || "" },
      descripcion: this.state.descripcion.trim(),
      createdAt: Date.now(),
      likes: [],
    };

    db.collection("posts")
      .add(newPost)
      .then(() => {
        this.setState({
          descripcion: "",
          submitting: false,
          exito: "Post creado correctamente.",
        });

       
        this.props.navigation.navigate("Profile");

      })
      .catch((error) => {
        console.log("Error creando post:", error);
        this.setState({
          submitting: false,
          error: "No se pudo crear el post. Intentá de nuevo.",
        });
      });
  }

  render() {
    const { descripcion, error, exito, submitting } = this.state;

    return (
      <View style={styles.container}>
        <Text style={styles.title}>Crear posteo</Text>

        <TextInput
          style={styles.input}
          placeholder="Escribe aquí la descripción del post..."
          multiline
          value={descripcion}
          onChangeText={(text) =>
            this.setState({ descripcion: text, error: "", exito: "" })
          }
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}
        {exito ? <Text style={styles.success}>{exito}</Text> : null}

        <Pressable
          style={[styles.button, submitting && { opacity: 0.6 }]}
          onPress={() => this.onSubmit()}
          disabled={submitting}
        >
          <Text style={styles.buttonText}>
            {submitting ? "Publicando..." : "Publicar"}
          </Text>
        </Pressable>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 12 },
  input: {
    minHeight: 120,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    textAlignVertical: "top",
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "bold" },
  error: { color: "#a00", marginBottom: 8 },
  success: { color: "green", marginBottom: 8 },
});
