// KEEP YOUR LOGIC SAME — only replace return part

return (
  <ScrollView style={{ flex: 1, backgroundColor: "#f5f5f5", padding: 15 }}>

    <Text style={{ fontSize: 22, color: "#800020", marginBottom: 15 }}>
      Welcome, {user.email}
    </Text>

    {/* BUTTONS */}
    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
      <TouchableOpacity style={styles.box}>
        <Text>Create Order</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.box}>
        <Text>My Orders</Text>
      </TouchableOpacity>
    </View>

    {/* FORM */}
    <View style={styles.card}>
      <Text style={styles.title}>Place Order</Text>

      {/* keep inputs SAME */}
    </View>

    {/* ORDERS */}
    <View style={styles.card}>
      <Text style={styles.title}>Recent Orders</Text>

      {/* keep mapping SAME */}
    </View>

  </ScrollView>
);

const styles = {
  box: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 15,
    width: "48%",
    alignItems: "center"
  },
  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 15,
    marginTop: 15
  },
  title: {
    color: "#800020",
    marginBottom: 10
  }
};
