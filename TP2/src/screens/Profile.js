import React, { Component } from "react";
import { View, Text, FlatList, Pressable, StyleSheet } from "react-native";
import { auth, db } from "../firebase/config";

export default class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      posts: [],
      error: "",
    };
  }

  componentDidMount() {
    const user = auth.currentUser;
    if (user) {
      this.setState({ user });

      db.collection("posts")
        .where("owner.email", "==", user.email)
        .onSnapshot((docs) => {
          let posts = [];
          docs.forEach((doc) => {
            posts.push({
              id: doc.id,
              data: doc.data(),
            });
          });
          this.setState({ posts });
        });
    }
  }

  borrarPost(id) {
    db.collection("posts")
      .doc(id)
      .delete()
      .then(() => {
        console.log("Post eliminado correctamente");
      })
      .catch((error) => {
        console.log("Error al eliminar post:", error);
        this.setState({ error: "No se pudo eliminar el post." });
      });
  }

  Logout() {
    auth
      .signOut()
      .then(() => this.props.navigation.push("Login"))
      .catch((error) => console.log("Error cerrando sesión:", error));
  }

  render() {
    const { user, posts, error } = this.state;

    return (
      <View style={styles.container}>
        {user ? (
          <>
            <Text style={styles.title}>Mi Perfil</Text>
            <Text style={styles.info}>{user.displayName}</Text>
            <Text style={styles.info}>{user.email}</Text>

            <Text style={styles.subtitle}>Mis Últimos Posteos</Text>

            {error ? <Text style={styles.error}>{error}</Text> : null}

            {posts.length === 0 ? (
              <Text style={styles.emptyText}>No tenés posteos todavía.</Text>
            ) : (
              <FlatList
                data={posts}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <View style={styles.post}>
                    <Text style={styles.postText}>{item.data.descripcion}</Text>
                    <Text style={styles.date}>
                      {item.data.createdAt
                        ? item.data.createdAt.toDate
                          ? item.data.createdAt.toDate().toLocaleString() 
                          : new Date(item.data.createdAt).toLocaleString() 
                        : "Sin fecha"}
                    </Text>

                    <Pressable
                      style={styles.deleteButton}
                      onPress={() => this.borrarPost(item.id)}
                    >
                      <Text style={styles.deleteText}>Eliminar</Text>
                    </Pressable>
                  </View>
                )}
              />
            )}

            <Pressable
              style={styles.logoutButton}
              onPress={() => this.Logout()}
            >
              <Text style={styles.logoutText}>Cerrar sesión</Text>
            </Pressable>
          </>
        ) : (
          <Text>Cargando usuario...</Text>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
  info: { fontSize: 16, marginBottom: 4 },
  subtitle: { fontSize: 18, fontWeight: "600", marginVertical: 10 },
  emptyText: { color: "#888", fontStyle: "italic", textAlign: "center" },
  error: { color: "red", textAlign: "center", marginBottom: 8 },

  post: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
  },
  postText: { fontSize: 16 },
  date: { fontSize: 12, color: "#555", marginTop: 4 },

  deleteButton: {
    backgroundColor: "#ff5c5c",
    paddingVertical: 6,
    marginTop: 6,
    borderRadius: 6,
    alignItems: "center",
  },
  deleteText: { color: "#fff", fontWeight: "bold" },

  logoutButton: {
    marginTop: 20,
    backgroundColor: "#d9534f",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  logoutText: { color: "#fff", fontWeight: "bold" },
});
