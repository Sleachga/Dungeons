import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  TouchableOpacity,
  Alert,
} from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faArrowUp,
  faArrowDown,
  faArrowLeft,
  faArrowRight,
  faCircle,
} from "@fortawesome/free-solid-svg-icons";

class ControllerScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      color: "white",
      username: this.props.route.params.username,
    };

    this.socket = global.socket;
  }

  setColor(color) {
    this.setState({ color });
    this.socket.emit("set-user-color", { color });
  }

  render() {
    return (
      <View style={styles.container}>
        <View
          style={{
            ...styles.row,
            flex: 0.8,
            flexDirection: "column",
            marginBottom: 30,
            backgroundColor: this.state.color,
          }}
        >
          <Text
            style={{
              fontSize: 20,
              paddingTop: 30,
              color: this.state.color === "white" ? "black" : "white",
            }}
          >
            {this.state.color === "white"
              ? "Please Select A Color..."
              : `Welcome, ${this.state.username}`}
          </Text>
        </View>
        <View style={{ ...styles.row, margin: 0 }}>
          <TouchableOpacity
            activeOpacity={0.5}
            style={{
              ...styles.button,
              ...styles.topRoundCorners,
              ...styles.border,
              borderBottomWidth: 0,
              backgroundColor: this.state.color,
            }}
            onPress={() => {}}
          >
            <FontAwesomeIcon icon={faArrowUp} />
          </TouchableOpacity>
        </View>
        <View style={{ ...styles.row, margin: 0 }}>
          <TouchableOpacity
            activeOpacity={0.5}
            style={{
              ...styles.button,
              ...styles.leftRoundCorners,
              ...styles.border,
              borderRightWidth: 0,
              backgroundColor: this.state.color,
            }}
            onPress={() => {}}
          >
            <FontAwesomeIcon icon={faArrowLeft} />
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.5}
            style={{ ...styles.button, backgroundColor: this.state.color }}
            onPress={() => {}}
          >
            <Text>OK</Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.5}
            style={{
              ...styles.button,
              ...styles.rightRoundCorners,
              ...styles.border,
              borderLeftWidth: 0,
              backgroundColor: this.state.color,
            }}
            onPress={() => {}}
          >
            <FontAwesomeIcon icon={faArrowRight} />
          </TouchableOpacity>
        </View>
        <View style={{ ...styles.row, margin: 0 }}>
          <TouchableOpacity
            activeOpacity={0.5}
            style={{
              ...styles.button,
              ...styles.bottomRoundCorners,
              ...styles.border,
              borderTopWidth: 0,
              backgroundColor: this.state.color,
            }}
            onPress={() => {}}
          >
            <FontAwesomeIcon icon={faArrowDown} />
          </TouchableOpacity>
        </View>
        <View
          style={{
            ...styles.row,
            justifyContent: "space-evenly",
            marginTop: 20,
          }}
        >
          <TouchableOpacity
            activeOpacity={0.5}
            style={{ ...styles.colorButton, backgroundColor: "#a57548" }}
            onPress={() => this.setColor("#a57548")}
          />
          <TouchableOpacity
            activeOpacity={0.5}
            style={{ ...styles.colorButton, backgroundColor: "#3066be" }}
            onPress={() => this.setColor("#3066be")}
          />
          <TouchableOpacity
            activeOpacity={0.5}
            style={{ ...styles.colorButton, backgroundColor: "#5fc5d1" }}
            onPress={() => this.setColor("#5fc5d1")}
          />
        </View>
        <View style={{ ...styles.row, justifyContent: "space-evenly" }}>
          <TouchableOpacity
            activeOpacity={0.5}
            style={{ ...styles.colorButton, backgroundColor: "#499f68" }}
            onPress={() => this.setColor("#499f68")}
          />
          <TouchableOpacity
            activeOpacity={0.5}
            style={{ ...styles.colorButton, backgroundColor: "#f8c7cc" }}
            onPress={() => this.setColor("#f8c7cc")}
          />
          <TouchableOpacity
            activeOpacity={0.5}
            style={{ ...styles.colorButton, backgroundColor: "#fcab10" }}
            onPress={() => this.setColor("#fcab10")}
          />
        </View>
        <View style={{ ...styles.row, justifyContent: "space-evenly" }}>
          <TouchableOpacity
            activeOpacity={0.5}
            style={{ ...styles.colorButton, backgroundColor: "#ec4e20" }}
            onPress={() => this.setColor("#ec4e20")}
          />
          <TouchableOpacity
            activeOpacity={0.5}
            style={{ ...styles.colorButton, backgroundColor: "#a51a1e" }}
            onPress={() => this.setColor("#a51a1e")}
          />
          <TouchableOpacity
            activeOpacity={0.5}
            style={{ ...styles.colorButton, backgroundColor: "#8563b0" }}
            onPress={() => this.setColor("#8563b0")}
          />
        </View>
      </View>
    );
  }
}

export default ControllerScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  row: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "stretch",
    textAlign: "center",
  },
  rowNoTop: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "red",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    alignSelf: "stretch",
    textAlign: "center",
  },
  rowNoBottom: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "red",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    alignSelf: "stretch",
    textAlign: "center",
  },
  buttonRow: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "blue",
    alignItems: "center",
    justifyContent: "center",
    margin: 10,
    alignSelf: "stretch",
    textAlign: "center",
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    backgroundColor: "white",
    aspectRatio: 1,
  },
  colorButton: {
    alignItems: "center",
    justifyContent: "center",
    height: "50%",
    aspectRatio: 1.5,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    borderTopWidth: 2,
    borderBottomWidth: 2,
    borderLeftWidth: 2,
    borderRightWidth: 2,
  },
  topRoundCorners: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  rightRoundCorners: {
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
  },
  bottomRoundCorners: {
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  leftRoundCorners: {
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
  },
  border: {
    borderColor: "black",
    borderTopWidth: 2,
    borderRightWidth: 2,
    borderBottomWidth: 2,
    borderLeftWidth: 2,
  },
});
