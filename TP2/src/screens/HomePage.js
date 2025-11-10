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
    const content = item.data.descripcion || item.data.texto || '';

    let ownerLabel = 'Usuario';
    const owner = item.data.owner;  
    if (typeof owner === 'string') {
      ownerLabel = owner;
    } else if (owner && typeof owner === 'object') {
      ownerLabel = owner.email || owner.nombre || 'Usuario';
    } else if (item.data.userEmail) {
      ownerLabel = item.data.userEmail;
    }


    const fecha = (createdAt) => {
    if (!createdAt) return '';
    let dateObj;
    if (createdAt.toDate && typeof createdAt.toDate === 'function') {
      dateObj = createdAt.toDate();
    } else if (typeof createdAt === 'number') {
      dateObj = new Date(createdAt);
    } else {
      return '';
    }

    const now = new Date();
    const sameDay = dateObj.toDateString() === now.toDateString();
    const timeStr = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    if (sameDay) {
      return `posteó hoy a las ${timeStr}`;
    } else {
      const datePart = dateObj.toLocaleDateString();
      return `posteó el ${datePart} a las ${timeStr}`;
    }
  };

  const whenText = fecha(item.data.createdAt);

    return (
      <View style={styles.post}>
      <Text style={styles.postHeader}>
        {ownerLabel} {whenText ? whenText : ''}
      </Text>
      {content ? <Text style={styles.postText}>{content}</Text> : null}
      <View style={styles.metaRow}>
        <Text style={styles.likesCount}>❤ {likesArr.length}</Text>

        <View style={styles.actionsRight}>
          {iLike ? (
            <Pressable onPress={() => this.unlikePost(item.id)}>
              <Text style={styles.unlike}>DESLIKE</Text>
            </Pressable>
          ) : (
            <Pressable onPress={() => this.likePost(item.id)}>
              <Text style={styles.like}>LIKE</Text>
            </Pressable>
          )}

          <Pressable onPress={() => this.goToComments(item.id)}>
            <Text style={styles.comment}>Comentar</Text>
          </Pressable>
        </View>
      </View>
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
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 14,
    marginHorizontal: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ececec',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  postHeader: {
    fontSize: 12,
    color: '#444',
    fontStyle: 'italic',
    marginBottom: 8,
  },
  postText: {
    fontSize: 20,
    lineHeight: 28,
    color: '#111',
    fontWeight: '600',
    marginBottom: 12,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  likesCount: {
    fontSize: 13,
    color: '#d32f2f',
    fontWeight: '700',
  },
  actionsRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  like: {
    color: '#d32f2f',
    fontWeight: '700',
    marginLeft: 12,
    fontSize: 12,
  },
  unlike: {
    color: '#757575',
    fontWeight: '700',
    marginLeft: 12,
    fontSize: 12,
  },
  comment: {
    color: '#1565c0',
    fontWeight: '700',
    marginLeft: 12,
    fontSize: 12,
  },
});
