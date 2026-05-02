return (
  <ScrollView style={styles.container}>

    {/* HEADER */}
    <View style={styles.header}>
      <Text style={styles.welcome}>
        Hi, {user.email.split("@")[0]} 👋
      </Text>

      <TouchableOpacity onPress={logout}>
        <Text style={styles.logout}>Logout</Text>
      </TouchableOpacity>
    </View>

    {/* ACTION CARDS */}
    <View style={styles.actions}>

      <TouchableOpacity
        style={styles.actionCard}
        onPress={() => {
          setShowForm(true);
          setShowOrders(false);
        }}
      >
        <Text style={styles.actionTitle}>Create Order</Text>
        <Text style={styles.actionSub}>Place new delivery</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.actionCard}
        onPress={() => {
          setShowForm(false);
          setShowOrders(true);
        }}
      >
        <Text style={styles.actionTitle}>My Orders</Text>
        <Text style={styles.actionSub}>Track deliveries</Text>
      </TouchableOpacity>

    </View>

    {/* FORM */}
    {showForm && (
      <View style={styles.card}>
        <Text style={styles.cardTitle}>New Order</Text>

        <TextInput style={styles.input} placeholder="Name" value={name} onChangeText={setName}/>
        <TextInput style={styles.input} placeholder="Phone" value={phone} onChangeText={setPhone}/>
        <TextInput style={styles.input} placeholder="Pickup" value={pickup} onChangeText={setPickup}/>
        <TextInput style={styles.input} placeholder="Delivery" value={delivery} onChangeText={setDelivery}/>
        <TextInput style={styles.input} placeholder="Distance (km)" value={distance} onChangeText={setDistance}/>

        <Text style={styles.price}>
          Total: ₹{calculatePrice()}
        </Text>

        <TouchableOpacity style={styles.button} onPress={placeOrder}>
          <Text style={styles.buttonText}>Place Order</Text>
        </TouchableOpacity>
      </View>
    )}

    {/* ORDERS */}
    {showOrders && (
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Active Orders</Text>

        {orders.length === 0 ? (
          <Text style={styles.empty}>No orders yet</Text>
        ) : (
          orders.map(order => (
            <View key={order.id} style={styles.orderCard}>
              <Text style={styles.route}>
                {order.pickupAddress} → {order.deliveryAddress}
              </Text>

              <Text style={styles.meta}>
                ₹{order.amount} • {order.distance} km
              </Text>

              <Text style={styles.status}>
                {order.deliveryStatus}
              </Text>
            </View>
          ))
        )}
      </View>
    )}

  </ScrollView>
);
