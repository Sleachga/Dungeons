import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Alert,
  TextInput,
} from "react-native";

import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import io from "socket.io-client";
import LoginTextInput from "./components/LoginTextInput";
import * as CommonStyles from "./styles/CommonStyles";

class LoginScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      serverCode: null,
      serverStatus: "DISCONNECTED",
      username: null,
      errorText: "",
    };

    this.socket = global.socket;

    this.setUsername = this.setUsername.bind(this);
    this.setServerCode = this.setServerCode.bind(this);
  }

  setUsername = (username) => this.setState({ username });
  setServerCode = (serverCode) => this.setState({ serverCode, errorText: "" });
  setErrorText = (errorText) => this.setState({ errorText });
  setServerStatus = (serverStatus) => this.setState({ serverStatus });

  doSubmit = () => {
    switch (this.state.serverStatus) {
      case "CONNECTED":
        if (this.state.username) {
          this.socket.emit("username-set", this.state.username);
          this.props.navigation.navigate("Controller", {
            username: this.state.username
          });
        }
        break;
      case "DISCONNECTED":
        if (this.state.serverCode && this.state.serverCode.length === 4) {
          console.log(`Submitting Server Code: ${this.state.serverCode}`);
          if (this.socket) {
            this.socket.emit("mobile-server-code-req", this.state.serverCode);
          }
        }
    }
  };

  componentDidMount() {
    this.socket.on("platform-handshake", () =>
      this.socket.emit("platform-handshake", "USER")
    );
    this.socket.on("server-full", () => this.setErrorText("Server Full"));
    this.socket.on("server-code-failure", () =>
      this.setErrorText("No Server Found")
    );
    this.socket.on("server-code-success", () => {
      this.setServerCode("");
      this.setErrorText("Connected");
      this.setServerStatus("CONNECTED");
      Keyboard.dismiss();
    });
  }

  render() {
    return (
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <KeyboardAvoidingView
          behavior={Platform.OS == "ios" ? "padding" : "height"}
          style={styles.container}
        >
          <Text
            style={
              this.state.serverStatus === "CONNECTED"
                ? { padding: 20, ...styles.success }
                : { padding: 20, ...styles.error }
            }
          >
            {this.state.errorText}
          </Text>
          <LoginTextInput
            serverStatus={this.state.serverStatus}
            setUsername={this.setUsername}
            setServerCode={this.setServerCode}
            value={this.state.serverCode}
          />
          <View style={{ ...styles.inputView, backgroundColor: "green" }}>
            <TouchableOpacity
              style={styles.submitButton}
              onPress={this.doSubmit}
            >
              <Text
                style={{
                  textAlign: "center",
                  justifyContent: "center",
                  color: "white",
                }}
              >
                Submit
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    );
  }
}

export default LoginScreen;

const styles = StyleSheet.create({
  container: CommonStyles.container,
  inputView: CommonStyles.inputView,
  inputText: CommonStyles.inputText,
  submitButton: CommonStyles.submitButton,
  row: CommonStyles.row,
  error: { color: "red" },
  success: { color: "green" },
});
