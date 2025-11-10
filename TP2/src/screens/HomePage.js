import React, { Component } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native';
import firebase from "firebase";
import { auth, db } from '../firebase/config';

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      loader: true
    };
    this._authUnsub = null;
    this._postsUnsub = null;
  }

  componentDidMount() {
    this._authUnsub = auth.onAuthStateChanged(user => {
      if (!user) {
        if (this.props.navigation && this.props.navigation.navigate) {
          this.props.navigation.navigate('Login');
        }
      } else {
        const q = db.collection('posts').orderBy('createdAt', 'desc');
        this._postsUnsub = q.onSnapshot(
          (docs) => {
            const posts = [];
            docs.forEach(doc => posts.push({ id: doc.id, data: doc.data() }));
            this.setState({ posts, loader: false });
          },
          (err) => {
            console.log('Error cargando posts:', err);
            this.setState({ loader: false });
          }
        );
      }
    });
  }

  componentWillUnmount() {
    if (this._authUnsub) this._authUnsub();
    if (this._postsUnsub) this._postsUnsub();
  }

  likePost(id) {
    const email = auth.currentUser ? auth.currentUser.email : null;
    if (!email) {
      if (this.props.navigation && this.props.navigation.navigate) {
        this.props.navigation.navigate('Login');
      }
      return;
    }
    db.collection('posts')
      .doc(id)
      .update({
        likes: firebase.firestore.FieldValue.arrayUnion(email)
      })
      .catch(e => console.log('Error like:', e));
  }

  unlikePost(id) {
    const email = auth.currentUser ? auth.currentUser.email : null;
    if (!email) {
      if (this.props.navigation && this.props.navigation.navigate) {
        this.props.navigation.navigate('Login');
      }
      return;
    }
    db.collection('posts')
      .doc(id)
      .update({
        likes: firebase.firestore.FieldValue.arrayRemove(email)
      })
      .catch(e => console.log('Error unlike:', e));
  }

  goToComments = (postId) => {
    const user = auth.currentUser;
    if (!user) {
      if (this.props.navigation && this.props.navigation.navigate) {
        this.props.navigation.navigate('Login');
      }
      return;
    }

    
    if (this.props.navigation && this.props.navigation.navigate) {
      this.props.navigation.navigate('ComentPost', { postId });
    }

    if (this.props.navigation && typeof this.props.navigation.getPadre === 'function') {
      const padre = this.props.navigation.getPadre();
      if (padre && padre.navigate) {
        parent.navigate('ComentPost', { postId });
      }
    }
  };

 renderItem = ({ item }) => {
    const email = auth.currentUser ? auth.currentUser.email : null;
    const likesArr = Array.isArray(item.data.likes) ? item.data.likes : [];
    const iLike = email ? likesArr.includes(email) : false;

    let ownerLabel = 'Usuario';
    const owner = item.data.owner;
    if (typeof owner === 'string') {
      ownerLabel = owner;
    } else if (owner && typeof owner === 'object') {
      ownerLabel = owner.email || owner.nombre || 'Usuario';
    } else if (item.data.userEmail) {
      ownerLabel = item.data.userEmail;
    }


    let createdAtText = '';
    try {
      if (item.data.createdAt && typeof item.data.createdAt.toDate === 'function') {
        createdAtText = item.data.createdAt.toDate().toLocaleString();
      }
    } catch (e) {}

    return (
      <View style={styles.post}>
        <Text style={styles.user}>Usuario: {ownerLabel}</Text>
        {item.data.texto ? <Text style={styles.text}>{item.data.texto}</Text> : null}
        {!!createdAtText && <Text style={styles.date}>{createdAtText}</Text>}

        <Text>Likes: {likesArr.length}</Text>

        {iLike ? (
          <Pressable onPress={() => this.unlikePost(item.id)}>
            <Text style={styles.unlike}>unlike</Text>
          </Pressable>
        ) : (
          <Pressable onPress={() => this.likePost(item.id)}>
            <Text style={styles.like}>like</Text>
          </Pressable>
        )}

        <Pressable onPress={() => this.goToComments(item.id)}>
          <Text style={styles.comment}>Comentar</Text>
        </Pressable>
      </View>
    );
  };

  keyExtractor = (item) => item.id;

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Home</Text>

        {this.state.loader ? (
          <View style={styles.center}><Text>Cargando...</Text></View>
        ) : (
          <FlatList
            data={this.state.posts}
            keyExtractor={this.keyExtractor}
            renderItem={this.renderItem}
            contentContainerStyle={{ paddingBottom: 16 }}
          />
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  center: { alignItems: 'center', justifyContent: 'center', padding: 12 },
  title: { fontSize: 22, fontWeight: '700', margin: 12 },
  post: {
    backgroundColor: '#f7f7f7',
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 12,
    marginBottom: 12
  },
  user: { fontSize: 16, fontWeight: '600', marginBottom: 6 },
  text: { fontSize: 14, marginBottom: 8 },
  date: { fontSize: 11, opacity: 0.6, marginBottom: 8 },
  like: { color: '#d32f2f', fontWeight: '700', marginTop: 6 },
  unlike: { color: '#757575', fontWeight: '700', marginTop: 6 },
  comment: { color: '#1565c0', fontWeight: '700', marginTop: 8 }
});
