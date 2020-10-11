import React, { Component } from "react";
import { TextInput, StyleSheet, View } from "react-native";
import * as CommonStyles from "../styles/CommonStyles";

class LoginTextInput extends React.Component {
  render() {
    const usernameInput = (
      <TextInput
        style={styles.inputText}
        placeholder="What's your name?"
        placeholderTextColor="#003f5c"
        onChangeText={(code) => this.props.setUsername(code)}
      />
    );

    const serverCodeInput = (
      <TextInput
        style={styles.inputText}
        placeholder="Server Code"
        placeholderTextColor="#003f5c"
        autoCapitalize="characters"
        autoCorrect={false}
        maxLength={4}
        onChangeText={(code) => this.props.setServerCode(code)}
        value={this.props.value}
      />
    );

    return (
      <View style={styles.inputView}>
        { this.props.serverStatus === "CONNECTED" ? usernameInput : serverCodeInput }
      </View>
    );
  }
}

export default LoginTextInput;

const styles = StyleSheet.create({
  container: CommonStyles.container,
  inputView: CommonStyles.inputView,
  inputText: CommonStyles.inputText,
  submitButton: CommonStyles.submitButton,
  row: CommonStyles.row,
});
