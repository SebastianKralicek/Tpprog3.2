import React, { Component } from 'react';
import { View, Text, TextInput, FlatList, Pressable, StyleSheet } from 'react-native';
import { db, auth } from '../firebase/config';
import firebase from 'firebase';

export default class CommentPost extends Component {
  constructor(props) {
    super(props);
    this.state = {
      comments: [],
      newComment: '',
    };
  }

  componentDidMount() {
    const postId = this.props.route.params.postId;

    this.unsubscribe = db
      .collection('comments')
      .where('postId', '==', postId)
      .orderBy('createdAt', 'asc')
      .onSnapshot(
        (snapshot) => {
          const fetched = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          this.setState({ comments: fetched });
        },
        (error) => {
          console.log('Error al cargar comentarios:', error);
        }
      );
  }

  componentWillUnmount() {
    if (this.unsubscribe) this.unsubscribe();
  }

  addComment = () => {
    const { newComment } = this.state;
    const postId = this.props.route.params.postId;
    const user = auth.currentUser;

    if (!user || newComment.trim() === '') return;

    db.collection('comments')
      .add({
        postId,
        text: newComment.trim(),
        owner: user.email,
        createdAt: firebase.firestore.Timestamp.now(),
      })
      .then(() => this.setState({ newComment: '' }))
      .catch((error) => console.log('Error al guardar comentario:', error));
  };

  renderItem = ({ item }) => (
    <View style={styles.commentBox}>
      <Text style={styles.commentUser}>{item.owner}</Text>
      <Text>{item.text}</Text>
    </View>
  );

  render() {
    const { comments, newComment } = this.state;

    return (
      <View style={styles.container}>
        <Text style={styles.title}>Comentarios</Text>

        {comments.length === 0 ? (
          <Text style={styles.empty}>No hay comentarios aún.</Text>
        ) : null}

        <FlatList
          data={comments}
          keyExtractor={(item) => item.id}
          renderItem={this.renderItem}
        />

        <TextInput
          placeholder="Escribe tu comentario..."
          value={newComment}
          onChangeText={(text) => this.setState({ newComment: text })}
          style={styles.input}
        />

        <Pressable onPress={this.addComment} style={styles.button}>
          <Text style={styles.buttonText}>Publicar</Text>
        </Pressable>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
  empty: { fontStyle: 'italic', color: '#666', marginBottom: 10 },
  commentBox: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#f9f9f9',
  },
  commentUser: { fontWeight: 'bold', marginBottom: 4 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginTop: 10,
    borderRadius: 5,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 10,
    marginTop: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: { color: 'white', fontWeight: 'bold' },
});