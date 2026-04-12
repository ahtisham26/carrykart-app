import React, { useState } from 'react';
import {
  Text, View, TextInput, TouchableOpacity,
  FlatList, StyleSheet, ScrollView
} from 'react-native';

export default function App() {

  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [orders, setOrders] = useState([]);

  // ADDRESS FIELDS
  const [pickupArea, setPickupArea] = useState('');
  const [pickupLandmark, setPickupLandmark] = useState('');
  const [pickupCity, setPickupCity] = useState('');

  const [dropArea, setDropArea] = useState('');
  const [dropLandmark, setDropLandmark] = useState('');
  const [dropCity, setDropCity] = useState('');

  const isAdmin = email === "ahtishamulhaq087@gmail.com";

  const login = () => {
    if (!email || !password) return;
    setUser(email);
  };

  const logout = () => setUser(null);

  const createOrder = () => {
    const price = 49 + Math.floor(Math.random() * 100);

    const newOrder = {
      id: Date.now().toString(),
      pickup: `${pickupArea}, ${pickupLandmark}, ${pickupCity}`,
      drop: `${dropArea}, ${dropLandmark}, ${dropCity}`,
      price,
      status: 'Pending',
      user: email
    };

    setOrders([...orders, newOrder]);

    // clear fields
    setPickupArea('');
    setPickupLandmark('');
    setPickupCity('');
    setDropArea('');
    setDropLandmark('');
    setDropCity('');
  };

  const acceptOrder = (id) => {
    setOrders(orders.map(o =>
      o.id === id ? { ...o, status: 'Accepted' } : o
    ));
  };

  const deliverOrder = (id) => {
    setOrders(orders.map(o =>
      o.id === id ? { ...o, status: 'Delivered' } : o
    ));
  };

  // 💰 ADMIN STATS
  const deliveredOrders = orders.filter(o => o.status === 'Delivered');
  const totalEarnings = deliveredOrders.reduce((sum, o) => sum + o.price, 0);

  // LOGIN
  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.logo}>CarryKart 🚀</Text>

        <TextInput placeholder="Email" style={styles.input} onChangeText={setEmail} />
        <TextInput placeholder="Password" secureTextEntry style={styles.input} onChangeText={setPassword} />

        <TouchableOpacity style={styles.button} onPress={login}>
          <Text style={styles.buttonText}>Enter</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // 👑 ADMIN PANEL
  if (isAdmin) {
    return (
      <ScrollView style={styles.container}>
        <Text style={styles.logo}>Admin Dashboard 👑</Text>

        <Text style={styles.stats}>📦 Delivered: {deliveredOrders.length}</Text>
        <Text style={styles.stats}>💰 Earnings: ₹{totalEarnings}</Text>

        <TouchableOpacity onPress={logout}>
          <Text style={styles.logout}>Logout</Text>
        </TouchableOpacity>

        <FlatList
          data={orders}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text>{item.pickup} → {item.drop}</Text>
              <Text>User: {item.user}</Text>
              <Text>₹{item.price}</Text>
              <Text>Status: {item.status}</Text>

              {item.status === 'Pending' && (
                <TouchableOpacity onPress={() => acceptOrder(item.id)}>
                  <Text style={styles.accept}>Accept</Text>
                </TouchableOpacity>
              )}

              {item.status === 'Accepted' && (
                <TouchableOpacity onPress={() => deliverOrder(item.id)}>
                  <Text style={styles.deliver}>Deliver</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        />
      </ScrollView>
    );
  }

  // 👤 USER PANEL
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.logo}>CarryKart 🚀</Text>

      <Text style={styles.welcome}>
        👋 Hello {email.split('@')[0]}
      </Text>

      <TouchableOpacity onPress={logout}>
        <Text style={styles.logout}>Logout</Text>
      </TouchableOpacity>

      {/* 📦 ADDRESS INPUT */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>📦 Enter Full Address</Text>

        <TextInput placeholder="Pickup Area" value={pickupArea} onChangeText={setPickupArea} style={styles.input}/>
        <TextInput placeholder="Pickup Landmark" value={pickupLandmark} onChangeText={setPickupLandmark} style={styles.input}/>
        <TextInput placeholder="Pickup City" value={pickupCity} onChangeText={setPickupCity} style={styles.input}/>

        <TextInput placeholder="Drop Area" value={dropArea} onChangeText={setDropArea} style={styles.input}/>
        <TextInput placeholder="Drop Landmark" value={dropLandmark} onChangeText={setDropLandmark} style={styles.input}/>
        <TextInput placeholder="Drop City" value={dropCity} onChangeText={setDropCity} style={styles.input}/>

        <TouchableOpacity style={styles.button} onPress={createOrder}>
          <Text style={styles.buttonText}>Book Delivery</Text>
        </TouchableOpacity>
      </View>

      {/* 📋 ORDERS */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>📦 My Orders</Text>

        <FlatList
          data={orders.filter(o => o.user === email)}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View style={styles.orderCard}>
              <Text>{item.pickup} → {item.drop}</Text>
              <Text>₹{item.price}</Text>
              <Text>Status: {item.status}</Text>
            </View>
          )}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#800020',
    padding: 20,
    paddingTop: 50,
  },
  logo: {
    fontSize: 26,
    color: 'white',
    fontWeight: 'bold',
  },
  welcome: {
    color: 'white',
    marginBottom: 10,
  },
  logout: {
    color: '#fff',
    marginBottom: 10,
  },
  stats: {
    color: 'white',
    marginBottom: 5,
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 15,
    marginBottom: 15,
  },
  cardTitle: {
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    backgroundColor: '#f2f2f2',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#800020',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  orderCard: {
    backgroundColor: '#f9f9f9',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  accept: {
    color: 'blue',
  },
  deliver: {
    color: 'green',
  },
});
