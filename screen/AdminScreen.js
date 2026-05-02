<View style={{ padding: 15, backgroundColor: "#f5f5f5", flex: 1 }}>
  <FlatList
    data={orders}
    renderItem={({ item }) => (
      <View style={{
        backgroundColor: "#fff",
        padding: 15,
        borderRadius: 10,
        marginBottom: 10
      }}>
        <Text>Order ID: {item.id}</Text>
        <Text>Status: {item.status}</Text>

        <View style={{ flexDirection: "row", marginTop: 10 }}>
          <TouchableOpacity style={{ backgroundColor: "green", padding: 8, marginRight: 5 }}>
            <Text style={{ color: "#fff" }}>Accept</Text>
          </TouchableOpacity>

          <TouchableOpacity style={{ backgroundColor: "red", padding: 8 }}>
            <Text style={{ color: "#fff" }}>Reject</Text>
          </TouchableOpacity>
        </View>
      </View>
    )}
  />
</View>
