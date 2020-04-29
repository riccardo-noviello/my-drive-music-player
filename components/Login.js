import React, { Component } from "react";
import {
  TextInput,
  TouchableOpacity,
  View,
  Image,
  Text,
  StyleSheet,
  Linking
} from "react-native";

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      emailInput: "",
      passwordInput: ""
    };
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.loginContainer}>
          <Image
            resizeMode="contain"
            style={styles.logo}
            source={require("../img/logo.png")}
          />
        </View>

        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={() => Linking.openURL(this.props.loginUrl)}
        >
          <Text style={styles.buttonText}>AUTHORISE GOOGLE</Text>
        </TouchableOpacity>
        <View>
          <Text style={styles.instructions}>
            Step 1. Get an authorization code from Google
          </Text>
          <Text style={styles.instructions}>Step 2. Paste the code below</Text>
        </View>

        <TextInput
          style={styles.input}
          returnKeyType="go"
          placeholder="Code from Google"
          placeholderTextColor="rgba(225,225,225,0.7)"
          secureTextEntry
          onChangeText={text => this.setState({ passwordInput: text })}
          value={this.state.passwordInput}
        />

        <TextInput
          style={styles.input}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
          returnKeyType="next"
          placeholder="Your Gmail email"
          placeholderTextColor="rgba(225,225,225,0.7)"
          onChangeText={text => this.setState({ emailInput: text })}
          value={this.state.emailInput}
        />

        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={() =>
            this.props.onLoginCompletion(
              this.state.emailInput,
              this.state.passwordInput
            )
          }
        >
          <Text style={styles.buttonText}>NEXT</Text>
        </TouchableOpacity>
        <View style={styles.formContainer} />
      </View>
    );
  }
}

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#2c3e50"
  },
  loginContainer: {
    alignItems: "center",
    flexGrow: 1,
    justifyContent: "center"
  },
  logo: {
    position: "absolute",
    height: 200
  },
  instructions: {
    textAlign: "center",
    marginBottom: 5,
    padding: 5,
    color: "#fff",
    fontSize: 18
  },
  input: {
    height: 40,
    backgroundColor: "rgba(225,225,225,0.2)",
    marginBottom: 10,
    padding: 10,
    color: "#fff"
  },
  buttonContainer: {
    backgroundColor: "#2980b6",
    paddingVertical: 15
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "700"
  }
});
